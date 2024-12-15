import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function TimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value > 0 && value <= 1000 ? null : { unrealisticTime: true };
  };
}
