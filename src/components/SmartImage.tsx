import { useState, type ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function SmartImage({ src, alt, className, fallbackClassName, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br from-pink-soft to-pink/30 ${fallbackClassName ?? className ?? ""}`}
      >
        <span className="serif italic text-pink-deep/70 text-sm tracking-wider">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.04 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...(rest as object)}
    />
  );
}
