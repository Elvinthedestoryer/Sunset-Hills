import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sun/Sunset Rings */}
      <circle cx="200" cy="150" r="110" fill="#E67E22" fillOpacity="0.3" />
      <circle cx="200" cy="150" r="90" fill="#D35400" fillOpacity="0.4" />
      <circle cx="200" cy="150" r="70" fill="#E67E22" fillOpacity="0.6" />
      
      {/* Main Core Sun */}
      <defs>
        <radialGradient id="sunBloom" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FFD97D" />
          <stop offset="100%" stopColor="#F39C12" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="165" r="45" fill="url(#sunBloom)" shadow-blur="20" />

      {/* Birds in Sky */}
      <g fill="#6D411F" opacity="0.8">
        <path d="M125 95C130 98 135 98 140 95C135 96 130 96 125 95Z" />
        <path d="M145 105C150 108 155 108 160 105C155 106 150 106 145 105Z" />
        <path d="M135 125C145 130 155 130 165 125C155 127 145 127 135 125Z" />
      </g>

      {/* Mountain Silhouette */}
      <path 
        d="M70 230L140 165L170 195L220 165L260 195L340 240L200 225L70 230Z" 
        fill="#1A2521" 
      />
      
      {/* Palm Trees */}
      <g transform="translate(240, 150)">
        {/* Tree 1 */}
        <path d="M15 80Q20 50 15 0" stroke="#1A2521" strokeWidth="4" fill="none" />
        <g fill="#1A2521">
          <path d="M15 0C0 -10 -20 10 15 0" />
          <path d="M15 0C30 -15 45 5 15 0" />
          <path d="M15 0C-10 -20 10 -30 15 0" />
          <path d="M15 0C40 -5 35 -20 15 0" />
        </g>
        
        {/* Tree 2 */}
        <g transform="translate(35, 40) scale(0.7)">
          <path d="M5 60Q10 30 5 0" stroke="#1A2521" strokeWidth="4" fill="none" />
          <g fill="#1A2521">
            <path d="M5 0C-10 -10 -25 10 5 0" />
            <path d="M5 0C25 -15 40 5 5 0" />
            <path d="M5 0C-5 -20 15 -25 5 0" />
          </g>
        </g>
      </g>

      {/* Small details on mountain */}
      <circle cx="225" cy="195" r="3" fill="#1A2521" />
      <circle cx="235" cy="200" r="2.5" fill="#1A2521" />
      <circle cx="245" cy="205" r="2" fill="#1A2521" />
      
    </svg>
  );
}
