import { useId, type InputHTMLAttributes, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon.js';

interface FieldDescription { label: string; hint?: string; error?: string }
export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement>, FieldDescription { ref?: Ref<HTMLInputElement> }
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldDescription { ref?: Ref<HTMLTextAreaElement> }
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldDescription { ref?: Ref<HTMLSelectElement> }

function describedBy(id: string, hint: string | undefined, error: string | undefined, existing: string | undefined) {
  return [existing, hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined].filter(Boolean).join(' ') || undefined;
}
function FieldNotes({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  return <>{hint && <p id={`${id}-hint`} className="tw-field__hint">{hint}</p>}{error && <p id={`${id}-error`} className="tw-field__error">{error}</p>}</>;
}

export function TextField({ label, hint, error, id: suppliedId, className = '', 'aria-describedby': description, ...props }: TextFieldProps) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <div className="tw-field"><label className="tw-field__label" htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><input {...props} id={id} className={`tw-input ${className}`} aria-invalid={Boolean(error) || props['aria-invalid'] || undefined} aria-describedby={describedBy(id, hint, error, description)} /><FieldNotes id={id} hint={hint} error={error} /></div>;
}
export function TextArea({ label, hint, error, id: suppliedId, className = '', 'aria-describedby': description, rows = 4, ...props }: TextAreaProps) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <div className="tw-field"><label className="tw-field__label" htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><textarea {...props} id={id} rows={rows} className={`tw-input tw-input--textarea ${className}`} aria-invalid={Boolean(error) || props['aria-invalid'] || undefined} aria-describedby={describedBy(id, hint, error, description)} /><FieldNotes id={id} hint={hint} error={error} /></div>;
}
export function Select({ label, hint, error, id: suppliedId, className = '', 'aria-describedby': description, children, ...props }: SelectProps) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <div className="tw-field"><label className="tw-field__label" htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><select {...props} id={id} className={`tw-input tw-select ${className}`} aria-invalid={Boolean(error) || props['aria-invalid'] || undefined} aria-describedby={describedBy(id, hint, error, description)}>{children}</select><FieldNotes id={id} hint={hint} error={error} /></div>;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { label: string; ref?: Ref<HTMLInputElement> }
export function Checkbox({ label, id: suppliedId, className = '', ...props }: CheckboxProps) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <label htmlFor={id} className={`tw-checkbox ${className}`}><input {...props} type="checkbox" id={id} /><span className="tw-checkbox__box" aria-hidden="true"><Icon name="check" size={15} /></span><span>{label}</span></label>;
}

export interface SwitchProps { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean; id?: string; className?: string }
export function Switch({ label, checked, onCheckedChange, disabled = false, id: suppliedId, className = '' }: SwitchProps) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <div className={`tw-switch ${className}`}><button type="button" id={id} role="switch" aria-checked={checked} aria-labelledby={`${id}-label`} className="tw-switch__control" disabled={disabled} onClick={() => onCheckedChange(!checked)}><span className="tw-switch__track" aria-hidden="true"><span className="tw-switch__thumb" /></span></button><label id={`${id}-label`} htmlFor={id}>{label}</label></div>;
}
