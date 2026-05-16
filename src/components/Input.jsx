import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className = '', containerClass = '', ...props },
  ref
) {
  return (
    <div className={containerClass}>
      {label && <label className="label-base">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          className={`input-base ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export default Input;
