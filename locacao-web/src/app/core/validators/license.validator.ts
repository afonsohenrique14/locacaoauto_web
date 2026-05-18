// core/validators/license.validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function licenseExpiryValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const expiry = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today ? { licenseExpired: true } : null;
}

export function licenseNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // ← vazio passa
  const number = control.value?.replace(/\D/g, '');
  if (!number || number.length !== 11) return { licenseNumberInvalid: true };
  if (/^(\d)\1+$/.test(number)) return { licenseNumberInvalid: true };
  return null;
}
