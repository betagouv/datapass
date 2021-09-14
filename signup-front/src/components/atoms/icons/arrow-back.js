import React from 'react';

// Source: https://material.io/tools/icons/?icon=arrow_back&style=baseline https://material.io/tools/icons/static/icons/baseline-arrow_back-24px.svg
const ArrowBackIcon = ({ color = 'var(--theme-dark-text)', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={color}
    />
  </svg>
);

export default ArrowBackIcon;
