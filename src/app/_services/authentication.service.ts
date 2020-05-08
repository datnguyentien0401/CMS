import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {AppSettings} from '../app.settings';


@Injectable()
export class AuthenticationService {
  public static requests: HttpRequest<any>[];

  constructor(private http: HttpClient) {
    AuthenticationService.requests = [];
  }

  login(loginPayload) {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded'
    };
    console.log(loginPayload);
    return this.http.post(AppSettings.PROTOCOL + '//' + AppSettings.HOSTNAME + ':' + AppSettings.AUTHORIZATION_PORT + '/oauth/token', loginPayload, {headers});
  }

  // refreshToken() {
  //   const refresh_token = JSON.parse(window.sessionStorage.getItem('token')).refresh_token;
  //   window.sessionStorage.removeItem('token');
  //   const body = new HttpParams()
  //                         .set('grant_type', 'refresh_token')
  //                         .set('refresh_token', refresh_token);
  //   return this.http.post(AppSettings.BASE_AUTHORIZATION_URL + '/oauth/token', body).subscribe(data => {
  //     window.sessionStorage.setItem('token', JSON.stringify(data));
  //   }, error => {
  //     alert(error.error.error_description);
  //   });
  // }

  isAuthenticated() {
    if (window.sessionStorage.getItem('token') != null) {
      return true;
    }
    return false;
  }

}
