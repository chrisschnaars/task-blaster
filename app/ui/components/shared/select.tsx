import React, { ChangeEvent } from 'react';

type SelectVariant = 'large' | 'medium';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  isDisabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  variant?: SelectVariant;
  value: string | number;
}

export default function Select({ children, isDisabled, onChange, variant = 'medium', value }: SelectProps) {
  let selectClasses = 'flex shrink-0 items-center rounded-lg text-sm leading-none font-semibold bg-[var(--color-button-bg)] hover-focus:bg-[var(--color-button-bg-hover)] active:bg-[var(--color-button-bg-hover)] border border-[var(--color-button-border)] text-[var(--color-text-primary)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

  switch (variant) {
    case 'large':
      selectClasses += ' h-10 px-4';
    case 'medium':
      selectClasses += ' h-8 px-3';
  }

  return (
    <select
      className={`${selectClasses}`}
      disabled={isDisabled}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
