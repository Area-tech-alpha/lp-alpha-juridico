"use client";

import { useState } from "react";
import Link from "next/link";

export function PxAnchor() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setRevealed(true)}
        className="absolute w-px h-px p-0 m-0 opacity-0 overflow-hidden border-0"
      />

      {revealed && (
        <Link href="/" className="px-anchor-back">
          Voltar ao início
        </Link>
      )}
    </>
  );
}
