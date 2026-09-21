"use client";

import { useId } from "react";

const P_PATH =
  "M3.05 0L58.95 0L70.92-71.82L108.63-71.82C162.05-71.82 200.22-102.99 208.01-151.21C215.91-198.86 189.04-231.27 136.98-231.27L41.44-231.27M78.26-115.86L90-186.22L117.56-186.22C142.74-186.22 153.58-172.78 150.19-151.21C146.69-129.87 131.22-115.86 105.70-115.86";

const SPARK_PATH =
  "M 0.00 -20.00 L 2.83 -2.83 L 20.00 0.00 L 2.83 2.83 L 0.00 20.00 L -2.83 2.83 L -20.00 0.00 L -2.83 -2.83 Z";

export function BrandMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const pGrad = `${uid}-p`;
  const sparkGrad = `${uid}-spark`;

  return (
    <svg
      viewBox="48 42 416 416"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={pGrad} x1="12%" y1="100%" x2="88%" y2="0%">
          <stop offset="0%" stopColor="#3FCBAA" />
          <stop offset="55%" stopColor="#63E6BE" />
          <stop offset="100%" stopColor="#8AF3D4" />
        </linearGradient>
        <radialGradient id={sparkGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE28A" />
          <stop offset="100%" stopColor="#FFD166" />
        </radialGradient>
      </defs>
      <circle cx="256" cy="250" r="196" fill="#0D1B2D" />
      <g transform="translate(258 256) rotate(-1) translate(-106.21039517296329 115.63636363636364)">
        <path d={P_PATH} fill={`url(#${pGrad})`} />
        <g transform="translate(201.3717846641084 -219.27272727272728) rotate(26)">
          <path d={SPARK_PATH} fill={`url(#${sparkGrad})`} />
        </g>
      </g>
    </svg>
  );
}
