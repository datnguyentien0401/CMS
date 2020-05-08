import {AbstractControl, Validators} from '@angular/forms';
import {Injectable} from '@angular/core';


export class PhoneValidation {

  /**
   * Viet Nam phone
   * @param control
   */
  static VietNamphone(control: AbstractControl): { [key: string]: boolean } | null {
    const REGEX = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    console.log('test');
    if (REGEX.test(control.value)) {
      return null;
    }
    return {VietNamphone: true};
  }


}
