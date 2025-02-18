import React from 'react';

type ButtonSize = 'large' | 'medium';
type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export default function Button({ children, isDisabled, onClick, size = 'large', variant = 'primary' }: ButtonProps) {
  let buttonClasses = 'flex shrink-0 items-center rounded-md text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

  switch (variant) {
    case 'primary':
      buttonClasses += ' bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white focus-visible:outline-indigo-500';
      break;
    case 'secondary':
      buttonClasses += ' bg-gray-100 hover:bg-gray-200 active:bg-gray-200 focus-visible:outline-indigo-500';
      break;
  }

  switch (size) {
    case 'large':
      buttonClasses += ' h-10 px-4';
    case 'medium':
      buttonClasses += ' h-8 px-3';
  }

  return (
    <button
      className={`${buttonClasses}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
