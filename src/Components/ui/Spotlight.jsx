import React from "react";
import { cn } from "@/utils/cn";


export const Spotlight = ({ className, fill }) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[150%] w-[138%] lg:h-[100%] lg:w-[200%] opacity-0 animate-[spotlight_2s_ease_0.75s_1_forwards]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 5787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "#605bff"}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
};
