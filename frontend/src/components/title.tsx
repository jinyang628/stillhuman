"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

type TitleProps = {
  onTitleComplete: () => void;
};

export default function Title({ onTitleComplete }: TitleProps) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings: ["Still Human"],
      typeSpeed: 30,
      showCursor: false,
      onComplete: onTitleComplete,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center">
        <span ref={el} />
      </h1>
    </>
  );
}
