import React from 'react';

export function FullscreenExitIcon ({
  color = '#000',
  size = 20
}: {
  color?: string,
  size?: number
} = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path fill="none" d="M0 0h24v24H0z"/>
      <path
        fill={color}
        d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
      />
    </svg>
  )
}