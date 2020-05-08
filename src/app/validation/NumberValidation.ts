import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class NumberValidation {

  /**
   * Include only positive integers, not limited to the number of digits, greater than the input value
   * @param minValue
   */
  static positiveNumberValidation(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const PosNumbRexEx = /^\d+$/;
      console.log('test');
      if (PosNumbRexEx.test(control.value)) {
        if (control.value > minValue) {
          return null;
        }
      }
      const positiveNumber: ValidationErrors = {
        positiveNumber: {
          actual: control.value,
          min: minValue
        }
      };
      console.log(positiveNumber);
      return positiveNumber;
    };
  }

  /**
   *
   * Include positive and negative integers
   * @param control
   */
  static numberValidation(control: AbstractControl): { [key: string]: boolean } | null {
    const numberRegEx = /^-?\d+$/;
    if (numberRegEx.test(control.value)) {
      return null;
    }
    return {number: true};
  }

  /**
   *
   * Include integers, decimals, delimiters as dots or commas
   * @param control
   */
  static decimaNumberValidation(control: AbstractControl): { [key: string]: boolean } | null {
    const decimaNumberRegEx = /^-?\d+([\.\,]\d+)?$/;
    if (decimaNumberRegEx.test(control.value)) {
      return null;
    }
    return {decimaNumber: true};
  }
}
