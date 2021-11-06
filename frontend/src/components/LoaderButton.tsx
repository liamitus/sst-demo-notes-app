import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

type LoaderButtonProps = {
  isLoading: boolean;
  className?: string;
  disabled: boolean;
} & {
  children: React.ReactNode;
} & ButtonProps;

export default function LoaderButton({
  isLoading,
  className = '',
  disabled = false,
  ...props
}: LoaderButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}
