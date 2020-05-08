import {AfterViewInit, Component, ElementRef, HostBinding, Inject, ViewChild} from '@angular/core';
import {NavService} from './_services/nav.service';
import {NavItem} from './_models/nav.item';
import {Router} from '@angular/router';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {LoginComponent} from './login/login.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {WINDOW} from "./_services/window.providers";
import {AppSettings} from "./app.settings";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  @HostBinding('class') componentCssClass;
  navItems: NavItem[];

  constructor(public overlayContainer: OverlayContainer, private navService: NavService, private router: Router,
              private authenticationService: AuthenticationService, private apiService: ApiService,
              private loginComponent: LoginComponent, private location: Location,
              @Inject(WINDOW) private window: Window) {
    if (!AppSettings.HOSTNAME) {
      console.log(this.window.location);
      AppSettings.PROTOCOL = this.window.location.protocol;
      AppSettings.HOSTNAME = this.window.location.hostname;
    }
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
    this.apiService.getJSON('assets/Menus.json').subscribe((data: any) => {
      this.navItems = data;
    });
    console.log('1. ', this.authenticationService.isAuthenticated());
    if (this.authenticationService.isAuthenticated()) {
      if (this.location.isCurrentPathEqualTo('')) {
        this.router.navigate(['home']);
      }
    } else {
      this.loginComponent.showLoginModal();
    }
  }

  changeTheme(theme) {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item !== 'cdk-overlay-container');
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
    this.componentCssClass = theme;
  }
}
