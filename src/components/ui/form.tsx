'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface FormProps {
  children: ReactNode;
  onSubmit: (data: FormData) => void | Promise<void>;
  className?: string;
}

export function Form({ children, onSubmit, className = '' }: FormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {children}
    </form>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea';
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
}

export function FormField({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  placeholder,
  defaultValue,
  error 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          id={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      {children}
    </div>
  );
}