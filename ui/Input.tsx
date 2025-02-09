import { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: React.ReactNode;
    error?: React.ReactNode;
    description?: React.ReactNode;
  }
>(({ className, label, description, error, ...props }, ref) => (
  <>
    <Label
      label={label}
      description={description}
      required={props.required}
      className={className}
    >
      <input
        ref={ref}
        className="bg-gray-900 w-full rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-white hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 disabled:opacity-50 transition-colors"
        {...props}
      />
    </Label>
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </>
));
Input.displayName = 'Input';

export default Input;
