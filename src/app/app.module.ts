import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgxPaginationModule} from 'ngx-pagination';
import {CookieService} from 'ngx-cookie-service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {MatPaginatorIntl} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MultilanguagePanigator} from './_helpers/multilanguage.paginator';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatCheckboxModule} from '@angular/material/checkbox';

// import {
//   CovalentCommonModule, CovalentDataTableModule, CovalentDialogsModule,
//   CovalentExpansionPanelModule,
//   CovalentLayoutModule, CovalentLoadingModule,
//   CovalentMediaModule, CovalentMenuModule, CovalentMessageModule,
//   CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule,
//   CovalentStepsModule
// } from '@covalent/core';
import {FlexLayoutModule} from '@angular/flex-layout';


import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AddEditUserComponent} from './user/add-edit-user/add-edit-user.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {NavService} from './_services/nav.service';
import {MenuListItemComponent} from './_helpers/menu-list-item/menu-list-item.component';
import {TopNavComponent} from './_helpers/top-nav/top-nav.component';
import {LogoutComponent} from './logout/logout.component';
import {MaterialModule} from './material.module';
import {ListRoleComponent} from './role/list-role/list-role.component';
import {ListMenuComponent} from './menu/list-menu/list-menu.component';
import {ListPermissionComponent} from './permission/list-permission/list-permission.component';
import {AddEditPermissionComponent} from './permission/add-edit-permission/add-edit-permission.component';
import {AddEditMenuComponent} from './menu/add-edit-menu/add-edit-menu.component';
import {AddEditRoleComponent} from './role/add-edit-role/add-edit-role.component';
import {AppRoutingModule} from './app-routing.module';
import { ListClientComponent } from './client/list-client/list-client.component';
import { AddEditClientComponent } from './client/add-edit-client/add-edit-client.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AddEditRolePermissionComponent } from './role/add-edit-role-permission/add-edit-role-permission.component';
import { AddRoleUserComponent } from './user/add-role-user/add-role-user.component';
import {PhoneValidation} from './validation/PhoneValidation';
import {StringValidation} from './validation/StringValidation';
import {NumberValidation} from './validation/NumberValidation';
import {DateValidation} from './validation/DateValidation';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { FilterComponent } from '../filter/filter.component';
import {WINDOW_PROVIDERS} from "./_services/window.providers";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    AddEditUserComponent,
    ListUserComponent,
    MenuListItemComponent,
    TopNavComponent,
    ListRoleComponent,
    ListMenuComponent,
    ListPermissionComponent,
    AddEditPermissionComponent,
    AddEditMenuComponent,
    AddEditRoleComponent,
    ListClientComponent,
    AddEditClientComponent,
    AddEditRolePermissionComponent,
    AddRoleUserComponent,
    FilterComponent,
  ],
  // Mấy ông mà gọi Modal là phải cho vào đây nhé @@
  entryComponents: [
    LoginComponent,
    AddEditUserComponent,
    AddEditRoleComponent,
    AddEditPermissionComponent,
    AddEditMenuComponent,
    AddEditClientComponent,
    AddEditRolePermissionComponent,
    AddRoleUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    /** Covalent Modules */
    // CovalentCommonModule,
    // CovalentLayoutModule,
    // CovalentMediaModule,
    // CovalentExpansionPanelModule,
    // CovalentStepsModule,
    // CovalentDialogsModule,
    // CovalentLoadingModule,
    // CovalentSearchModule,
    // CovalentPagingModule,
    // CovalentNotificationsModule,
    // CovalentMenuModule,
    // CovalentDataTableModule,
    // CovalentMessageModule,
    // Additional **/
    NgxChartsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CookieService,
    LoginComponent,
    AuthenticationService,
    ApiService,
    NavService,
    WINDOW_PROVIDERS,
    PhoneValidation,
    StringValidation,
    NumberValidation,
    DateValidation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
