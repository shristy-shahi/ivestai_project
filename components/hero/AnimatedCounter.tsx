"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export default function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 1.8, delay = 0, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(obj.current, {
      val: value,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${obj.current.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
    return () => { tween.kill(); };
  }, [value]);

  return <span ref={ref} style={style}>{prefix}0{suffix}</span>;
}
