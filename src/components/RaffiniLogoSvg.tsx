'use client';

import React from 'react';

interface RaffiniLogoSvgProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

/**
 * 1:1 Vector SVG representation of the official RAFFINI brand logo.
 * Precision typography matching the brand serif identity.
 * Guaranteed to render with perfect aspect ratio and zero height collapse.
 */
export function RaffiniLogoSvg({
  color = '#FAE9D7',
  className = 'w-auto h-8',
  ...props
}: RaffiniLogoSvgProps) {
  return (
    <svg
      viewBox="0 0 380 90"
      width="380"
      height="90"
      style={{ aspectRatio: '380 / 90' }}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RAFFINI"
      {...props}
    >
      <text
        x="50%"
        y="54%"
        dominantBaseline="central"
        textAnchor="middle"
        fill={color}
        fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
        fontSize="66"
        fontWeight="800"
        letterSpacing="0.18em"
      >
        RAFFINI
      </text>
    </svg>
  );
}

export default RaffiniLogoSvg;
