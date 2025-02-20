import React from 'react';

type ButtonSize = 'large' | 'medium' | 'small';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
  children?: React.ReactNode;
  hidden?: boolean;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export default function Button({ ariaLabel, children, hidden, icon, isDisabled, onClick, size = 'large', variant = 'primary' }: ButtonProps) {
  let buttonClasses = 'flex shrink-0 items-center gap-2 rounded-lg text-sm leading-none font-semibold border transition-all focus-visible:outline focus-visible:outline-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

  switch (variant) {
    case 'primary':
      buttonClasses += ' bg-[var(--color-button-bg-primary)] hover-focus:bg-[var(--color-button-bg-primary-hover)] active:bg-[var(--color-button-bg-primary-hover)] border-[var(--color-button-border-primary)] text-[var(--color-text-inverted)]';
      break;
    case 'secondary':
      buttonClasses += ' bg-[var(--color-button-bg)] hover-focus:bg-[var(--color-button-bg-hover)] active:bg-[var(--color-button-bg-hover)] border-[var(--color-button-border)] text-[var(--color-text-primary)]';
      break;
    case 'ghost':
      buttonClasses += ' bg-transparent] hover-focus:bg-[var(--color-button-bg-hover)] active:bg-[var(--color-button-bg-hover)] border-none text-[var(--color-text-primary)]';
      break;
  }

  switch (size) {
    case 'large':
      buttonClasses += ` rounded-lg h-10 ${children ? "px-4" : "w-10"}`;
    case 'medium':
      buttonClasses += ` rounded-lg h-8 ${children ? "px-3" : "w-8"}`;
    case 'small':
      buttonClasses += ` rounded-md h-6 ${children ? "px-3" : "p-[3px] w-6"}`;
  }

  if (hidden) {
    buttonClasses += ' opacity-0 group-hover:opacity-100 hover-focus:opacity-100'
  }

  return (
    <button
      className={`${buttonClasses}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {icon && (
        <>
          {icon}
        </>
      )}
      {children && (
        <span className="mb-[1px]">
          {children}
        </span>
      )}
    </button>
  );
}
