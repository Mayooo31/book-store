import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function minSelectedGenres(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      const selectedCount = control.value.length;
      if (selectedCount < min || selectedCount > max) {
        return { minSelectedGenres: true };
      }
    }
    return null;
  };
}
