import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Tags,
  Settings,
  MessageSquareQuote,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Plus,
  X,
  LogOut,
  ExternalLink,
  Upload,
  Sparkles,
} from "lucide-react";
import {
  buscarDepoimentos,
  buscarPortfolio,
  enviarArquivo,
  excluirCategoria,
  excluirDepoimento,
  excluirItem,
  extrairVimeoId,
  removerArquivo,
  salvarCategoria,
  salvarConfig,
  salvarDepoimento,
  salvarItem,
  supabase,
  supabaseAtivo,
  trocarOrdem,
  trocarOrdemCategoria,
  trocarOrdemDepoimento,
  type Categoria,
  type Depoimento,
  type ItemPortfolio,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do portfólio | Júlia Figueiredo" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Aba = "video" | "foto" | "depoimentos" | "categorias" | "ajustes";

// ═══════════════ Página ═══════════════

function AdminPage() {
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!supabaseAtivo) {
      setCarregandoSessao(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setLogado(Boolean(data.session));
      setEmail(data.session?.user.email ?? "");
      setCarregandoSessao(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sessao) => {
      setLogado(Boolean(sessao));
      setEmail(sessao?.user.email ?? "");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseAtivo) {
    return (
      <Centro>
        <h1 className="serif text-3xl mb-3">Painel não configurado</h1>
        <p className="text-sm text-muted-foreground">
          Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env e reinicie o servidor.
        </p>
      </Centro>
    );
  }

  if (carregandoSessao) {
    return (
      <Centro>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </Centro>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />
      {logado ? <Painel email={email} /> : <Login />}
    </>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">{children}</div>
    </div>
  );
}

// ═══════════════ Login ═══════════════

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setEnviando(true);
    setErro("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setEnviando(false);
    if (error) setErro("E-mail ou senha não conferem. Tente de novo.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-9">
        <div className="eyebrow mb-3">Área restrita</div>
        <h1 className="serif text-3xl mb-1">Painel do portfólio</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Entre para adicionar, editar e organizar seus trabalhos.
        </p>

        <Campo rotulo="E-mail">
          <input
            type="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            className={estiloInput}
          />
        </Campo>

        <Campo rotulo="Senha">
          <input
            type="password"
            value={senha}
            autoComplete="current-password"
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            className={estiloInput}
          />
        </Campo>

        <button onClick={entrar} disabled={enviando} className={`${estiloBotao} w-full`}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>

        {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}
      </div>
    </div>
  );
}

// ═══════════════ Painel ═══════════════

function Painel({ email }: { email: string }) {
  const qc = useQueryClient();
  const [aba, setAba] = useState<Aba>("video");
  const [editando, setEditando] = useState<ItemPortfolio | null | undefined>(undefined);
  const [editandoCat, setEditandoCat] = useState<Categoria | null | undefined>(undefined);
  const [editandoDep, setEditandoDep] = useState<Depoimento | null | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-admin"],
    queryFn: () => buscarPortfolio(true),
    retry: false,
  });

  const depoimentos = useQuery({
    queryKey: ["depoimentos-admin"],
    queryFn: () => buscarDepoimentos(true),
    retry: false,
  });

  const atualizar = () => {
    qc.invalidateQueries({ queryKey: ["portfolio-admin"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
    qc.invalidateQueries({ queryKey: ["depoimentos-admin"] });
    qc.invalidateQueries({ queryKey: ["depoimentos"] });
  };

  const itens = data?.itens ?? [];
  const categorias = data?.categorias ?? [];

  const lista = useMemo(
    () =>
      aba === "video" || aba === "foto"
        ? itens.filter((i) => i.tipo === aba).sort((a, b) => a.ordem - b.ordem)
        : [],
    [itens, aba],
  );

  async function mover(item: ItemPortfolio, direcao: -1 | 1) {
    const idx = lista.findIndex((i) => i.id === item.id);
    const vizinho = lista[idx + direcao];
    if (!vizinho) return;
    try {
      await trocarOrdem(item, vizinho);
      atualizar();
    } catch {
      toast.error("Não deu para reordenar agora.");
    }
  }

  async function remover(item: ItemPortfolio) {
    if (!confirm(`Excluir "${item.titulo}"? Essa ação não tem volta.`)) return;
    try {
      await excluirItem(item.id);
      await removerArquivo(item.poster_url);
      if (item.full_url !== item.poster_url) await removerArquivo(item.full_url);
      atualizar();
      toast.success("Item excluído.");
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  async function moverCat(cat: Categoria, direcao: -1 | 1) {
    const idx = categorias.findIndex((c) => c.id === cat.id);
    const vizinho = categorias[idx + direcao];
    if (!vizinho) return;
    try {
      await trocarOrdemCategoria(cat, vizinho);
      atualizar();
    } catch {
      toast.error("Não deu para reordenar agora.");
    }
  }

  async function removerCat(cat: Categoria) {
    const uso = itens.filter((i) => i.categoria_id === cat.id).length;
    const texto = uso
      ? `Excluir "${cat.nome}"? ${uso === 1 ? "O item que usa" : `Os ${uso} itens que usam`} essa categoria continuam no site, mas ficam sem categoria.`
      : `Excluir "${cat.nome}"?`;
    if (!confirm(texto)) return;
    try {
      await excluirCategoria(cat.id);
      atualizar();
      toast.success("Categoria excluída.");
    } catch {
      toast.error("Não foi possível excluir a categoria.");
    }
  }

  const abas: { chave: Aba; rotulo: string; icone: React.ReactNode }[] = [
    { chave: "video", rotulo: "Vídeos", icone: <VideoIcon size={13} /> },
    { chave: "foto", rotulo: "Fotos", icone: <ImageIcon size={13} /> },
    { chave: "depoimentos", rotulo: "Depoimentos", icone: <MessageSquareQuote size={13} /> },
    { chave: "categorias", rotulo: "Categorias", icone: <Tags size={13} /> },
    { chave: "ajustes", rotulo: "Ajustes", icone: <Settings size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-navy px-6 py-4 lg:px-10">
        <div>
          <h1 className="serif text-2xl text-cream">Painel do portfólio</h1>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-cream/50">{email}</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/#portfolio"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-cream/85 transition hover:bg-cream/10"
          >
            <ExternalLink size={13} /> Ver site
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-cream/85 transition hover:bg-cream/10"
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-wrap gap-2 rounded-full border border-border bg-card p-1.5 w-fit">
          {abas.map((a) => (
            <button
              key={a.chave}
              onClick={() => setAba(a.chave)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] transition ${
                aba === a.chave
                  ? "bg-navy text-cream dark:bg-pink dark:text-navy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {a.icone} {a.rotulo}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

        {error && (
          <div className="mb-8 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
            <p className="mb-1 font-medium text-destructive">
              Não foi possível carregar os dados do Supabase
            </p>
            <p className="text-sm text-muted-foreground">
              As listas abaixo estão vazias por causa desse erro, não porque o banco está vazio.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground">
              {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
            </pre>
          </div>
        )}

        {!isLoading && (aba === "video" || aba === "foto") && (
          <>
            <Cabecalho
              titulo={aba === "video" ? "Vídeos" : "Fotos"}
              descricao={
                lista.length
                  ? `${lista.length} ${lista.length === 1 ? "item" : "itens"}, ${lista.filter((i) => i.publicado).length} no ar`
                  : "Nenhum item cadastrado ainda."
              }
              acao={
                <button onClick={() => setEditando(null)} className={estiloBotao}>
                  <Plus size={13} className="mr-2 inline" />
                  {aba === "video" ? "Adicionar vídeo" : "Adicionar foto"}
                </button>
              }
            />

            {lista.length === 0 ? (
              <Vazio texto="Adicione o primeiro trabalho para ele aparecer no site." />
            ) : (
              <div className="grid gap-3">
                {lista.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-pink-soft">
                      {item.poster_url && (
                        <img
                          src={item.poster_url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="min-w-40 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.titulo}</span>
                        {item.destaque && <Sparkles size={13} className="text-pink-deep" />}
                      </div>
                      {item.subtitulo && (
                        <p className="text-sm text-muted-foreground">{item.subtitulo}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Etiqueta>
                          {categorias.find((c) => c.id === item.categoria_id)?.nome ??
                            "Sem categoria"}
                        </Etiqueta>
                        {!item.publicado && <Etiqueta tom="alerta">Rascunho</Etiqueta>}
                        {item.tipo === "video" && (
                          <Etiqueta>{item.vimeo_id ? "Vimeo" : "Arquivo"}</Etiqueta>
                        )}
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                      <BotaoIcone
                        onClick={() => mover(item, -1)}
                        disabled={idx === 0}
                        rotulo="Subir"
                      >
                        <ArrowUp size={14} />
                      </BotaoIcone>
                      <BotaoIcone
                        onClick={() => mover(item, 1)}
                        disabled={idx === lista.length - 1}
                        rotulo="Descer"
                      >
                        <ArrowDown size={14} />
                      </BotaoIcone>
                      <BotaoIcone onClick={() => setEditando(item)} rotulo="Editar">
                        <Pencil size={14} />
                      </BotaoIcone>
                      <BotaoIcone onClick={() => remover(item)} rotulo="Excluir" perigo>
                        <Trash2 size={14} />
                      </BotaoIcone>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && aba === "depoimentos" && (
          <SecaoDepoimentos
            lista={depoimentos.data ?? []}
            carregando={depoimentos.isLoading}
            onNovo={() => setEditandoDep(null)}
            onEditar={setEditandoDep}
            onAtualizar={atualizar}
          />
        )}

        {!isLoading && aba === "categorias" && (
          <>
            <Cabecalho
              titulo="Categorias"
              descricao="Viram os filtros que aparecem dentro da seção de portfólio."
              acao={
                <button onClick={() => setEditandoCat(null)} className={estiloBotao}>
                  <Plus size={13} className="mr-2 inline" /> Adicionar categoria
                </button>
              }
            />
            {categorias.length === 0 ? (
              <Vazio texto="Crie categorias como Beleza ou Gastronomia para separar os trabalhos." />
            ) : (
              <div className="grid gap-3">
                {categorias.map((cat, idx) => {
                  const uso = itens.filter((i) => i.categoria_id === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{cat.nome}</div>
                        <p className="text-sm text-muted-foreground">
                          {uso === 0 ? "Nenhum item" : uso === 1 ? "1 item" : `${uso} itens`}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5">
                        <BotaoIcone
                          onClick={() => moverCat(cat, -1)}
                          disabled={idx === 0}
                          rotulo="Subir"
                        >
                          <ArrowUp size={14} />
                        </BotaoIcone>
                        <BotaoIcone
                          onClick={() => moverCat(cat, 1)}
                          disabled={idx === categorias.length - 1}
                          rotulo="Descer"
                        >
                          <ArrowDown size={14} />
                        </BotaoIcone>
                        <BotaoIcone onClick={() => setEditandoCat(cat)} rotulo="Renomear">
                          <Pencil size={14} />
                        </BotaoIcone>
                        <BotaoIcone onClick={() => removerCat(cat)} rotulo="Excluir" perigo>
                          <Trash2 size={14} />
                        </BotaoIcone>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!isLoading && aba === "ajustes" && (
          <Ajustes
            videosPorPagina={data?.config.videosPorPagina ?? 6}
            fotosPorPagina={data?.config.fotosPorPagina ?? 12}
            onSalvo={atualizar}
          />
        )}
      </div>

      {editando !== undefined && (
        <ModalItem
          item={editando}
          tipo={editando?.tipo ?? (aba === "foto" ? "foto" : "video")}
          categorias={categorias}
          itens={itens}
          onFechar={() => setEditando(undefined)}
          onSalvo={() => {
            setEditando(undefined);
            atualizar();
          }}
        />
      )}

      {editandoCat !== undefined && (
        <ModalCategoria
          categoria={editandoCat}
          categorias={categorias}
          onFechar={() => setEditandoCat(undefined)}
          onSalvo={() => {
            setEditandoCat(undefined);
            atualizar();
          }}
        />
      )}

      {editandoDep !== undefined && (
        <ModalDepoimento
          depoimento={editandoDep}
          lista={depoimentos.data ?? []}
          onFechar={() => setEditandoDep(undefined)}
          onSalvo={() => {
            setEditandoDep(undefined);
            atualizar();
          }}
        />
      )}
    </div>
  );
}

// ═══════════════ Modal de item ═══════════════

function ModalItem({
  item,
  tipo,
  categorias,
  itens,
  onFechar,
  onSalvo,
}: {
  item: ItemPortfolio | null;
  tipo: "video" | "foto";
  categorias: Categoria[];
  itens: ItemPortfolio[];
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const ehVideo = tipo === "video";
  const [titulo, setTitulo] = useState(item?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(item?.subtitulo ?? "");
  const [categoriaId, setCategoriaId] = useState(item?.categoria_id ?? "");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [linkVimeo, setLinkVimeo] = useState(item?.vimeo_id ?? "");
  const [videoUrl, setVideoUrl] = useState(item?.video_url ?? "");
  const [destaque, setDestaque] = useState(item?.destaque ?? false);
  const [publicado, setPublicado] = useState(item?.publicado ?? true);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previa, setPrevia] = useState(item?.poster_url ?? "");
  const [salvando, setSalvando] = useState(false);
  const inputArquivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  function receberArquivo(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Escolha um arquivo de imagem.");
    if (f.size > 8 * 1024 * 1024) return toast.error("A imagem passa de 8 MB. Reduza antes de enviar.");
    setArquivo(f);
    setPrevia(URL.createObjectURL(f));
  }

  const mutacao = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("Coloque um título.");

      const vimeoId = ehVideo ? extrairVimeoId(linkVimeo) : null;
      if (ehVideo && !vimeoId && !videoUrl.trim()) {
        throw new Error("Informe o link do Vimeo ou o caminho do arquivo de vídeo.");
      }
      if (!ehVideo && !arquivo && !item) {
        throw new Error("Escolha o arquivo da foto.");
      }

      let categoria = categoriaId || null;
      if (categoria === "__nova") {
        const nome = novaCategoria.trim();
        if (!nome) throw new Error("Dê um nome para a nova categoria.");
        const ordem = Math.max(0, ...categorias.map((c) => c.ordem)) + 1;
        const criada = await salvarCategoria(nome, ordem);
        categoria = criada.id;
      }

      let imagemUrl = item?.poster_url ?? null;
      if (arquivo) imagemUrl = await enviarArquivo(arquivo, ehVideo ? "capas" : "fotos");

      const dados: Partial<ItemPortfolio> = {
        tipo,
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        categoria_id: categoria,
        poster_url: imagemUrl,
        publicado,
      };

      if (ehVideo) {
        dados.vimeo_id = vimeoId;
        dados.video_url = vimeoId ? null : videoUrl.trim();
        dados.destaque = destaque;
      } else {
        dados.full_url = imagemUrl;
      }

      if (!item) {
        const mesmos = itens.filter((i) => i.tipo === tipo);
        dados.ordem = Math.max(0, ...mesmos.map((i) => i.ordem)) + 1;
      }

      await salvarItem(dados, item?.id);
    },
    onSuccess: () => {
      toast.success(item ? "Alterações salvas." : ehVideo ? "Vídeo publicado." : "Foto publicada.");
      onSalvo();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar."),
    onSettled: () => setSalvando(false),
  });

  const titulo_modal = item
    ? ehVideo
      ? "Editar vídeo"
      : "Editar foto"
    : ehVideo
      ? "Adicionar vídeo"
      : "Adicionar foto";

  return (
    <Modal onFechar={onFechar} titulo={titulo_modal}>
      {ehVideo && (
        <>
          <Campo rotulo="Link do Vimeo" dica="Cole o link completo ou só o número do vídeo.">
            <input
              type="text"
              value={linkVimeo}
              onChange={(e) => setLinkVimeo(e.target.value)}
              placeholder="https://vimeo.com/1198257063"
              className={estiloInput}
            />
          </Campo>

          <Campo
            rotulo="Ou arquivo de vídeo"
            dica="Caminho de um mp4 dentro de /public, como /videos/video1.mp4. Ignorado se houver link do Vimeo."
          >
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="/videos/video1.mp4"
              className={estiloInput}
            />
          </Campo>
        </>
      )}

      <Campo
        rotulo={ehVideo ? "Capa do vídeo" : "Arquivo da foto"}
        dica={
          ehVideo
            ? "Opcional para o Vimeo, que busca a capa automaticamente. Formato vertical fica melhor."
            : "JPG, PNG ou WEBP em formato vertical."
        }
      >
        <div
          onClick={() => inputArquivo.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            receberArquivo(e.dataTransfer.files?.[0]);
          }}
          className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/40 p-5 text-center transition hover:border-pink-deep"
        >
          {previa ? (
            <img src={previa} alt="" className="mx-auto mb-3 max-h-40 rounded" />
          ) : (
            <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {previa ? "Toque para trocar a imagem" : "Toque para escolher ou arraste a imagem aqui"}
          </p>
          <input
            ref={inputArquivo}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => receberArquivo(e.target.files?.[0])}
          />
        </div>
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Título">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="We Pink"
            className={estiloInput}
          />
        </Campo>
        <Campo rotulo="Legenda" dica="Aparece embaixo do título. Pode ficar em branco.">
          <input
            type="text"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className={estiloInput}
          />
        </Campo>
      </div>

      <Campo rotulo="Categoria">
        <select
          value={categoriaId ?? ""}
          onChange={(e) => setCategoriaId(e.target.value)}
          className={estiloInput}
        >
          <option value="">Sem categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
          <option value="__nova">Criar nova categoria</option>
        </select>
      </Campo>

      {categoriaId === "__nova" && (
        <Campo rotulo="Nome da nova categoria">
          <input
            type="text"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            placeholder="Ex.: Moda"
            className={estiloInput}
          />
        </Campo>
      )}

      <div className="grid gap-3">
        {ehVideo && (
          <Marcador
            marcado={destaque}
            onMudar={setDestaque}
            rotulo="Marcar como Featured"
            dica="Coloca o selo rosa no canto do card."
          />
        )}
        <Marcador
          marcado={publicado}
          onMudar={setPublicado}
          rotulo="Mostrar no site"
          dica="Desmarque para deixar como rascunho, visível só aqui."
        />
      </div>

      <div className="mt-7 flex justify-end gap-2">
        <button onClick={onFechar} className={estiloBotaoFantasma}>
          Cancelar
        </button>
        <button
          onClick={() => {
            setSalvando(true);
            mutacao.mutate();
          }}
          disabled={salvando}
          className={estiloBotao}
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════ Modal de categoria ═══════════════

function ModalCategoria({
  categoria,
  categorias,
  onFechar,
  onSalvo,
}: {
  categoria: Categoria | null;
  categorias: Categoria[];
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim()) return toast.error("Escreva o nome da categoria.");
    setSalvando(true);
    try {
      const ordem = Math.max(0, ...categorias.map((c) => c.ordem)) + 1;
      await salvarCategoria(nome.trim(), ordem, categoria?.id);
      toast.success(categoria ? "Categoria renomeada." : "Categoria criada.");
      onSalvo();
    } catch {
      toast.error("Já existe uma categoria com esse nome.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal onFechar={onFechar} titulo={categoria ? "Renomear categoria" : "Adicionar categoria"}>
      <Campo rotulo="Nome">
        <input
          type="text"
          value={nome}
          autoFocus
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && salvar()}
          placeholder="Ex.: Moda"
          className={estiloInput}
        />
      </Campo>
      <div className="mt-7 flex justify-end gap-2">
        <button onClick={onFechar} className={estiloBotaoFantasma}>
          Cancelar
        </button>
        <button onClick={salvar} disabled={salvando} className={estiloBotao}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════ Depoimentos ═══════════════

function SecaoDepoimentos({
  lista,
  carregando,
  onNovo,
  onEditar,
  onAtualizar,
}: {
  lista: Depoimento[];
  carregando: boolean;
  onNovo: () => void;
  onEditar: (d: Depoimento) => void;
  onAtualizar: () => void;
}) {
  const ordenados = [...lista].sort((a, b) => a.ordem - b.ordem);

  async function mover(dep: Depoimento, direcao: -1 | 1) {
    const idx = ordenados.findIndex((d) => d.id === dep.id);
    const vizinho = ordenados[idx + direcao];
    if (!vizinho) return;
    try {
      await trocarOrdemDepoimento(dep, vizinho);
      onAtualizar();
    } catch {
      toast.error("Não deu para reordenar agora.");
    }
  }

  async function remover(dep: Depoimento) {
    if (!confirm(`Excluir o depoimento de "${dep.nome}"? Essa ação não tem volta.`)) return;
    try {
      await excluirDepoimento(dep.id);
      await removerArquivo(dep.avatar_url);
      onAtualizar();
      toast.success("Depoimento excluído.");
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Depoimentos"
        descricao={
          ordenados.length
            ? `${ordenados.length} ${ordenados.length === 1 ? "depoimento" : "depoimentos"}, ${ordenados.filter((d) => d.publicado).length} no ar`
            : "Aparecem no carrossel da seção O que as marcas dizem."
        }
        acao={
          <button onClick={onNovo} className={estiloBotao}>
            <Plus size={13} className="mr-2 inline" /> Adicionar depoimento
          </button>
        }
      />

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : ordenados.length === 0 ? (
        <Vazio texto="Adicione o primeiro depoimento para o carrossel aparecer no site." />
      ) : (
        <div className="grid gap-3">
          {ordenados.map((dep, idx) => (
            <div
              key={dep.id}
              className="flex flex-wrap items-start gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-pink-deep/10 serif text-lg text-pink-deep">
                {dep.avatar_url ? (
                  <img src={dep.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  dep.nome.trim().charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-48 flex-1">
                <div className="font-medium">{dep.nome}</div>
                {dep.cargo && <p className="text-xs text-muted-foreground">{dep.cargo}</p>}
                <p className="mt-1 line-clamp-2 text-sm italic text-muted-foreground">
                  "{dep.texto}"
                </p>
                {!dep.publicado && (
                  <div className="mt-2">
                    <Etiqueta tom="alerta">Rascunho</Etiqueta>
                  </div>
                )}
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <BotaoIcone onClick={() => mover(dep, -1)} disabled={idx === 0} rotulo="Subir">
                  <ArrowUp size={14} />
                </BotaoIcone>
                <BotaoIcone
                  onClick={() => mover(dep, 1)}
                  disabled={idx === ordenados.length - 1}
                  rotulo="Descer"
                >
                  <ArrowDown size={14} />
                </BotaoIcone>
                <BotaoIcone onClick={() => onEditar(dep)} rotulo="Editar">
                  <Pencil size={14} />
                </BotaoIcone>
                <BotaoIcone onClick={() => remover(dep)} rotulo="Excluir" perigo>
                  <Trash2 size={14} />
                </BotaoIcone>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ModalDepoimento({
  depoimento,
  lista,
  onFechar,
  onSalvo,
}: {
  depoimento: Depoimento | null;
  lista: Depoimento[];
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const [texto, setTexto] = useState(depoimento?.texto ?? "");
  const [nome, setNome] = useState(depoimento?.nome ?? "");
  const [cargo, setCargo] = useState(depoimento?.cargo ?? "");
  const [publicado, setPublicado] = useState(depoimento?.publicado ?? true);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previa, setPrevia] = useState(depoimento?.avatar_url ?? "");
  const [salvando, setSalvando] = useState(false);
  const inputArquivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  function receberArquivo(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Escolha um arquivo de imagem.");
    if (f.size > 4 * 1024 * 1024) return toast.error("A imagem passa de 4 MB. Reduza antes de enviar.");
    setArquivo(f);
    setPrevia(URL.createObjectURL(f));
  }

  async function salvar() {
    if (!texto.trim()) return toast.error("Escreva o texto do depoimento.");
    if (!nome.trim()) return toast.error("Coloque o nome da marca ou da pessoa.");

    setSalvando(true);
    try {
      let avatar = depoimento?.avatar_url ?? null;
      if (arquivo) avatar = await enviarArquivo(arquivo, "avatares");

      const dados: Partial<Depoimento> = {
        texto: texto.trim(),
        nome: nome.trim(),
        cargo: cargo.trim(),
        avatar_url: avatar,
        publicado,
      };

      if (!depoimento) dados.ordem = Math.max(0, ...lista.map((d) => d.ordem)) + 1;

      await salvarDepoimento(dados, depoimento?.id);
      toast.success(depoimento ? "Alterações salvas." : "Depoimento publicado.");
      onSalvo();
    } catch {
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      onFechar={onFechar}
      titulo={depoimento ? "Editar depoimento" : "Adicionar depoimento"}
    >
      <Campo rotulo="Depoimento" dica="As aspas são adicionadas automaticamente no site.">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          placeholder="Amamos o trabalho da Júlia!"
          className={`${estiloInput} resize-y`}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Nome da marca ou pessoa">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Perfumoá"
            className={estiloInput}
          />
        </Campo>
        <Campo rotulo="Cargo" dica="Opcional, aparece embaixo do nome.">
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Gerente de Marketing"
            className={estiloInput}
          />
        </Campo>
      </div>

      <Campo
        rotulo="Logo ou foto"
        dica="Opcional. Sem imagem, o site mostra a primeira letra do nome dentro do círculo."
      >
        <div
          onClick={() => inputArquivo.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            receberArquivo(e.dataTransfer.files?.[0]);
          }}
          className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/40 p-5 text-center transition hover:border-pink-deep"
        >
          {previa ? (
            <img
              src={previa}
              alt=""
              className="mx-auto mb-3 h-20 w-20 rounded-full border border-border object-cover"
            />
          ) : (
            <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {previa ? "Toque para trocar a imagem" : "Toque para escolher ou arraste a imagem aqui"}
          </p>
          <input
            ref={inputArquivo}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => receberArquivo(e.target.files?.[0])}
          />
        </div>
      </Campo>

      <Marcador
        marcado={publicado}
        onMudar={setPublicado}
        rotulo="Mostrar no site"
        dica="Desmarque para deixar como rascunho, visível só aqui."
      />

      <div className="mt-7 flex justify-end gap-2">
        <button onClick={onFechar} className={estiloBotaoFantasma}>
          Cancelar
        </button>
        <button onClick={salvar} disabled={salvando} className={estiloBotao}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════ Ajustes ═══════════════

function Ajustes({
  videosPorPagina,
  fotosPorPagina,
  onSalvo,
}: {
  videosPorPagina: number;
  fotosPorPagina: number;
  onSalvo: () => void;
}) {
  const [videos, setVideos] = useState(videosPorPagina);
  const [fotos, setFotos] = useState(fotosPorPagina);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (videos < 3 || fotos < 3) return toast.error("Use números a partir de 3.");
    setSalvando(true);
    try {
      await salvarConfig(videos, fotos);
      toast.success("Ajustes salvos.");
      onSalvo();
    } catch {
      toast.error("Não foi possível salvar os ajustes.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Ajustes"
        descricao="Quantos trabalhos aparecem antes de abrir uma nova página dentro da seção."
      />
      <div className="max-w-lg rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Vídeos por página">
            <input
              type="number"
              min={3}
              max={36}
              value={videos}
              onChange={(e) => setVideos(Number(e.target.value))}
              className={estiloInput}
            />
          </Campo>
          <Campo rotulo="Fotos por página">
            <input
              type="number"
              min={3}
              max={36}
              value={fotos}
              onChange={(e) => setFotos(Number(e.target.value))}
              className={estiloInput}
            />
          </Campo>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          No computador o grid mostra 3 vídeos ou 4 fotos por linha, então múltiplos de 3 e de 4
          fecham as linhas certinho.
        </p>
        <button onClick={salvar} disabled={salvando} className={estiloBotao}>
          {salvando ? "Salvando..." : "Salvar ajustes"}
        </button>
      </div>
    </>
  );
}

// ═══════════════ Peças reutilizadas ═══════════════

const estiloInput =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-deep";

const estiloBotao =
  "rounded-full bg-navy px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] text-cream transition hover:opacity-90 disabled:opacity-50 dark:bg-pink dark:text-navy";

const estiloBotaoFantasma =
  "rounded-full border border-border px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground";

function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
        {rotulo}
      </label>
      {children}
      {dica && <p className="mt-1.5 text-xs text-muted-foreground">{dica}</p>}
    </div>
  );
}

function Marcador({
  marcado,
  onMudar,
  rotulo,
  dica,
}: {
  marcado: boolean;
  onMudar: (v: boolean) => void;
  rotulo: string;
  dica?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={marcado}
        onChange={(e) => onMudar(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-pink-deep"
      />
      <span>
        <span className="text-sm">{rotulo}</span>
        {dica && <span className="block text-xs text-muted-foreground">{dica}</span>}
      </span>
    </label>
  );
}

function Cabecalho({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="serif text-3xl">{titulo}</h2>
        {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <p className="text-sm text-muted-foreground">{texto}</p>
    </div>
  );
}

function Etiqueta({ children, tom }: { children: React.ReactNode; tom?: "alerta" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] ${
        tom === "alerta"
          ? "bg-destructive/10 text-destructive"
          : "bg-pink-deep/10 text-pink-deep"
      }`}
    >
      {children}
    </span>
  );
}

function BotaoIcone({
  children,
  onClick,
  disabled,
  rotulo,
  perigo,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  rotulo: string;
  perigo?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={rotulo}
      aria-label={rotulo}
      className={`flex h-9 w-9 items-center justify-center rounded-md border border-border transition disabled:opacity-30 ${
        perigo
          ? "text-muted-foreground hover:border-destructive hover:text-destructive"
          : "text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({
  titulo,
  onFechar,
  children,
}: {
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 p-4 backdrop-blur-sm"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto my-10 w-full max-w-lg rounded-lg border border-border bg-card p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="serif text-2xl">{titulo}</h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="text-muted-foreground transition hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
