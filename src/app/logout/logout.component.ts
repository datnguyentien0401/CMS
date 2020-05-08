import {Component, OnInit} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-logout',
  template: ``,
  styles: [``]
})
export class LogoutComponent implements OnInit {
  constructor(private loginComponent: LoginComponent, private location: Location) {
  }
  ngOnInit() {
    window.sessionStorage.removeItem('token');
    this.location.back();
    // this.loginComponent.showLoginModal();
  }
}
