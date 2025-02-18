import React from 'react';

type IconButtonSize = 'large' | 'medium' | 'small';
type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  extraClasses?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

export default function IconButton({ icon, onClick, size = 'large', variant = 'primary', extraClasses }: IconButtonProps) {
  let buttonClasses = `flex shrink-0 items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${extraClasses}`;

  switch (variant) {
    case 'primary':
      buttonClasses += ' bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white focus-visible:outline-indigo-500';
      break;
    case 'secondary':
      buttonClasses += ' bg-gray-100 hover:bg-gray-200 active:bg-gray-200 focus-visible:outline-indigo-500';
      break;
    case 'ghost':
      buttonClasses += ' hover:bg-gray-200 active:bg-gray-200 focus-visible:outline-indigo-500';
      break;
  }

  switch (size) {
    case 'large':
      buttonClasses += ' h-10 px-4 rounded-md';
      break;
    case 'medium':
      buttonClasses += ' h-8 px-3 rounded-md';
      break;
    case 'small':
      buttonClasses += ' h-6 w-6 p-[2px] rounded-sm';
      break;
  }

  return (
    <button
      className={`${buttonClasses}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
