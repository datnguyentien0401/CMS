import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl('')
  });
  error: string | null;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router,
              private authenticationService: AuthenticationService,
              private cookieService: CookieService, private location: Location, private translateService: TranslateService) {
  }

  submit() {
    if (this.form.valid) {
      const body = new HttpParams()
        .set('username', this.form.controls.username.value)
        .set('password', this.form.controls.password.value)
        .set('grant_type', 'password');

      this.authenticationService.login(body.toString()).subscribe(data => {
        window.sessionStorage.setItem('token', JSON.stringify(data));
        this.cookieService.set('remember', this.form.controls.remember.value.toString());
        this.hideLoginModal();
        if (AuthenticationService.requests) {
          AuthenticationService.requests.forEach(request => {
            console.log(request.url);
          });
        }
        console.log('3. ', this.location, this.location.isCurrentPathEqualTo('/logout'));
        // if (this.location.isCurrentPathEqualTo('/%23/logout')) {
        //   this.location.back();
        // }
      }, error => {
        console.log(error);
        this.translateService.get('login.error').subscribe(e => {this.error = e; });
      });
    }
  }

  ngOnInit() {
    window.sessionStorage.removeItem('token');
  }

  showLoginModal() {
    console.log('isShowedDialog: ', this.dialog.openDialogs, this.dialog.openDialogs.length);
    if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) { return; }
    this.dialog.open(LoginComponent, {disableClose: true});
  }

  hideLoginModal() {
    this.dialog.closeAll();
  }
}
