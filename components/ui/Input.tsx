
import React, { useState, InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface BaseProps {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  containerClassName?: string;
  maxLength?: number;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

const Input: React.FC<InputProps | TextareaProps> = ({
  label,
  error,
  success,
  helperText,
  className = '',
  containerClassName = '',
  as = 'input',
  value,
  id,
  maxLength,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const [isFocused, setIsFocused] = useState(false);
  const valString = value ? String(value) : '';
  const hasValue = valString.length > 0;
  
  const baseClasses = `
    w-full bg-white dark:bg-gray-800 border-2 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none transition-all duration-200
    placeholder-transparent peer
    ${error ? 'border-red-500 input-error' : success ? 'border-green-500' : isFocused ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-gray-200 dark:border-gray-700'}
    ${className}
  `;

  const labelClasses = `
    absolute left-4 top-3 text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none origin-[0]
    ${isFocused || hasValue ? 'input-label-float font-semibold' : 'text-base'}
    ${error ? 'text-red-500' : success ? 'text-green-500' : ''}
  `;

  return (
    <div className={`input-group mb-6 ${containerClassName}`}>
      <div className="relative">
        {as === 'textarea' ? (
          <textarea
            id={inputId}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={`${baseClasses} min-h-[120px] resize-y`}
            value={value}
            onFocus={(e) => { setIsFocused(true); (props.onFocus as any)?.(e); }}
            onBlur={(e) => { setIsFocused(false); (props.onBlur as any)?.(e); }}
            placeholder={label}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
          />
        ) : (
          <input
            id={inputId}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            className={baseClasses}
            value={value}
            onFocus={(e) => { setIsFocused(true); (props.onFocus as any)?.(e); }}
            onBlur={(e) => { setIsFocused(false); (props.onBlur as any)?.(e); }}
            placeholder={label}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
          />
        )}
        
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>

        {/* Icons */}
        <div className="absolute right-4 top-3.5 pointer-events-none transition-all duration-300">
          {error && <AlertCircle className="text-red-500 animate-pulse" size={20} />}
          {success && !error && <CheckCircle2 className="text-green-500 success-icon-anim" size={20} />}
        </div>
      </div>

      {/* Helper / Error Text / Counter */}
      <div className="mt-1 flex justify-between items-start text-xs min-h-[20px] transition-all duration-300">
        <div className="flex-1 mr-2">
          {error ? (
            <span id={errorId} className="text-red-500 flex items-center gap-1 font-medium slide-in-down" role="alert">
              {error}
            </span>
          ) : helperText ? (
            <span id={helperId} className="text-gray-500 dark:text-gray-400">{helperText}</span>
          ) : null}
        </div>
        
        {maxLength && (
          <span className={`font-mono transition-colors ${valString.length >= maxLength ? 'text-red-500 font-bold' : valString.length > maxLength * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
            {valString.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
