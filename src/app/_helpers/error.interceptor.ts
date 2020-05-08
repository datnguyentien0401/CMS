import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {concat, Observable, throwError} from 'rxjs';
import {catchError, retryWhen, delay, take} from 'rxjs/operators';
import {AuthenticationService} from '../_services/authentication.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AppSettings} from '../app.settings';
import {LoginComponent} from '../login/login.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService,
              private loginComponent: LoginComponent) { }
  getAccessToken() {
    if (this.authenticationService.isAuthenticated()) {
      const json = JSON.parse(window.sessionStorage.getItem('token'));
      return json.token_type + ' ' + json.access_token;
    } else {
      return 'Basic ' + btoa(AppSettings.CLIENT_ID + ':' + AppSettings.CLIENT_SECRET);
    }
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Accept-Language': this.cookieService.get('lang'),
        Authorization  : this.getAccessToken(),
      },
    });
    console.log(request);
    return next.handle(request).pipe(
      // retryWhen(errors =>
      //   errors.pipe(delay(1000))
      // ),
      catchError(err => {
          if (err.status === 401) {
            AuthenticationService.requests.push(request);
            console.log(401);
            // auto logout if 401 response returned from api
            window.sessionStorage.removeItem('token');
            this.loginComponent.showLoginModal();
          }
          const error = err.error.message || err.statusText;
          return throwError(error);
        }
      )
    );
  }
}
