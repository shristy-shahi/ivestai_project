import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  glow?: "primary" | "success" | "danger" | "none";
  elevated?: boolean;
  sm?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "section";
  id?: string;
}

export default function Card({
  children, hover = false, glow = "none", elevated = false, sm = false,
  className = "", style, as: Tag = "div", id,
}: CardProps) {
  const classes = [
    "card",
    hover ? "card-hover" : "",
    glow === "primary" ? "card-glow-primary" : "",
    glow === "success" ? "card-glow-success" : "",
    elevated ? "card-elevated" : "",
    sm ? "card-sm" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Tag className={classes} style={style} id={id}>
      {children}
    </Tag>
  );
}
