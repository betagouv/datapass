import React from 'react';

// Source: https://material.io/resources/icons/?icon=send&style=baseline
const SendIcon = ({ color = 'var(--theme-dark-text)', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"
    />
  </svg>
);

export default SendIcon;
