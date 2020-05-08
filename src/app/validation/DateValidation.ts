import {AbstractControl} from '@angular/forms';

export class DateValidation {

  /**
   * Date in datepicker, with leap year, delimiter /, no redundant characters on both sides, may be missing dates
   * @param control
   */
  static dateValidation(control: AbstractControl): { [key: string]: boolean } | null {
    // tslint:disable-next-line:max-line-length
    const dateRegEx = /^(([13578]|1[02])[\/]([1-9]|[12][0-9]|3[01])[\/](18|19|20)[0-9]{2})\b$|^(([469]|11)[\/]([1-9]|[12][0-9]|30)[\/](18|19|20)[0-9]{2})\b$|^((2)[\/]([1-9]|1[0-9]|2[0-8])[\/](18|19|20)[0-9]{2})\b$|^((2)[\/]29[\/](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))\b$/;
    const monthRegEx = /^(0?[1-9]|1[0-2])\/(\d{4})$/;
    if (dateRegEx.test(control.value)) {
      return null;
    } else if (monthRegEx.test(control.value)) {
      return null;
    }
    return {date: true};
  }
}
