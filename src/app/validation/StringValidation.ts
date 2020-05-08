import {AbstractControl} from '@angular/forms';

export class StringValidation {

  /**
   * The password form contains only uppercase and lowercase letters without accents,
   * numbers, underscores and at least 8 characters
   * @param control
   */
  static passwordValidation(control: AbstractControl): { [key: string]: boolean } | null {
    const PASSRegEx = /^(?=\w*[A-Z]+)(?=\w*[0-9]+)(?=\w*[a-z]+)\w{8,}$/;
    if (PASSRegEx.test(control.value)) {
      return null;
    }
    return {password: true};
  }


  /**
   * The password form contains uppercase, lowercase letters, numbers,
   * underscores and at least 8 characters, can have UTF-8 characters
   * @param control
   *
   */
  static unicodePasswordVaidation(control: AbstractControl): { [key: string]: boolean } | null {
    const PASSRegEx = /^(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[a-z]+).{8,}$/;
    if (PASSRegEx.test(control.value)) {
      return null;
    }
    return {unicodePassword: true};
  }

  /**
   * Vietnamese Name
   * @param control
   */

  static vietnameseNameValidation(control: AbstractControl): { [key: string]: boolean } | null {
    // tslint:disable-next-line:max-line-length
    const vietnameseNameRegEx = /^([a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+\s?)+$/;
    if (vietnameseNameRegEx.test(control.value)) {
      return null;
    }
    return {vietnameseName: true};
  }

  /**
   * English Name
   * @param control
   */
  static englishNameValidation(control: AbstractControl): { [key: string]: boolean } | null {
    const englishNameRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (englishNameRegEx.test(control.value)) {
      return null;
    }
    return {englishName: true};
  }

  /**
   *
   * Text only includes lowercase letters, uppercase letters without numbers, numbers and underscores
   */

  static textNotAccentedValidation(control: AbstractControl): { [key: string]: boolean } | null {
    const textNotAccentedRegEx = /^\w+$/;
    if (textNotAccentedRegEx.test(control.value)) {
      return null;
    }
    return {textNotAccented: true};
  }
}

