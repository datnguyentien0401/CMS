import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {MatCheckboxChange, MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.scss']
})
export class AddEditClientComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };
// Constant
  READ_SCOPE = 'read';
  WRITE_SCOPE = 'write';

  // Authorities
  ROLE_CLIENT = 'ROLE_CLIENT';
  ROLE_TRUSTED_CLIENT = 'ROLE_TRUSTED_CLIENT';

  // authorized_grant_types
  PASSWORD_GRANT_TYPE = 'password';
  REFRESH_TOKEN = 'refresh_token';
  CLIENT_CREDENTIALS = 'client_credentials';
  AUTHORIZATION_CODE = 'authorization_code';

  SPERATOR = ',';


  title: string;
  addEditForm: FormGroup;
  scopes: string[];
  authoritiesArr: string[];
  // tslint:disable-next-line:variable-name
  grant_typeArr: string[];


  ngOnInit() {
    this.scopes = [];
    this.authoritiesArr = [];
    this.grant_typeArr = [];
    this.title = 'client.management.add';
    const integerRegex = '^[0-9]+$';
    this.addEditForm = this.formBuilder.group({
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      resourceIds: '',
      clientSecret: '',
      scope: '',
      authorizedGrantTypes: '',
      webServerRedirectUri: '',
      authorities: '',
      accessTokenValidity: ['', [Validators.pattern(integerRegex)]],
      refreshTokenValidity: ['', [Validators.pattern(integerRegex)]],
      additionalInformation: '',
      autoapprove: ''
    });


    if (window.sessionStorage.getItem('detailClientId')) {
      this.title = 'client.management.detail';
      const clientId = window.sessionStorage.getItem('detailClientId');
      this.apiService.get('/oauthClient/' + clientId, null)
        .subscribe(data => {
          this.addEditForm.setValue(data);
          this.setScopesData();
          this.setAuthoritiesData();
          this.setGrant_typeArrData();
        });
    } else if (window.sessionStorage.getItem('editClientId')) {

      this.title = 'client.management.edit';
      const clientId = window.sessionStorage.getItem('editClientId');
      this.apiService.get('/oauthClient/' + clientId, null)
        .subscribe(data => {
          this.addEditForm.setValue(data);
          this.setScopesData();
          this.setAuthoritiesData();
          this.setGrant_typeArrData();
        });
    }
  }


  isCreate() {
    if (window.sessionStorage.getItem('createClient') === 'true') {
      return true;
    }
  }

  isDetail() {
    return window.sessionStorage.getItem('detailClientId');
  }

  isEdit() {
    return window.sessionStorage.getItem('editClientId');
  }

  onSubmit() {
    if (this.isCreate()) {
      this.apiService.post('/oauthClient', this.addEditForm.value)
        .subscribe(data => {
            this.dialog.closeAll();
          },
          error1 => {
            this.snackBar.open('This application code is existed!', '', this.config);
          });
    } else {
      const clientId = window.sessionStorage.getItem('editClientId');
      this.apiService.patch('/oauthClient/' + clientId, this.addEditForm.value)
        .pipe()
        .subscribe(data => {
          this.dialog.closeAll();
        });
    }
  }

  //Create scope
  createScope($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.READ_SCOPE) {
        this.scopes[0] = data.value;
      } else if (data.id === this.WRITE_SCOPE) {
        this.scopes[1] = data.value;
      }
    } else {
      if (data.id === this.READ_SCOPE) {
        // this.scopes.splice(0, 1);
        this.scopes[0] = '';
      } else if (data.id === this.WRITE_SCOPE) {
        if (this.scopes.length < 2) {
          this.scopes.splice(0, 1);
        } else {
          this.scopes.splice(1, 1);
        }
      }
    }
    const scopesString = this.scopes.toString();
    const scopeForm = this.addEditForm.controls.scope;
    if (scopesString.startsWith(this.SPERATOR)) {
      scopeForm.setValue(scopesString.substring(1, scopesString.length));
    } else if (scopesString.endsWith(this.SPERATOR)) {
      scopeForm.setValue(scopesString.substring(0, scopesString.length - 1));
    } else {
      scopeForm.setValue(scopesString);
    }

    console.log(scopeForm.value);
  }

  isCheckedScope(value: string): boolean {
    if (this.scopes.includes(value)) {
      return true;
    }
  }

  private setScopesData() {
    const scopeString = this.addEditForm.controls.scope.value.toString();
    if (scopeString.includes(this.SPERATOR)) {
      this.scopes = scopeString.split(this.SPERATOR);
    } else {
      if (scopeString === this.READ_SCOPE) {
        this.scopes = [scopeString, ''];
      } else {
        this.scopes = ['', scopeString];
      }
    }
    console.log(this.scopes);
  }

  // Create authorities

  createAuthorities($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.ROLE_CLIENT) {
        this.authoritiesArr[0] = data.value;
      } else if (data.id === this.ROLE_TRUSTED_CLIENT) {
        this.authoritiesArr[1] = data.value;
      }
    } else {
      if (data.id === this.ROLE_CLIENT) {
        // this.authoritiesArr.splice(0, 1);
        this.authoritiesArr[0] = '';
      } else if (data.id === this.ROLE_TRUSTED_CLIENT) {
        if (this.authoritiesArr.length < 2) {
          this.authoritiesArr.splice(0, 1);
        } else {
          this.authoritiesArr.splice(1, 1);
        }
      }
    }
    const authoritiesArrString = this.authoritiesArr.toString();
    const authoritiesForm = this.addEditForm.controls.authorities;
    if (authoritiesArrString.startsWith(this.SPERATOR)) {
      authoritiesForm.setValue(authoritiesArrString.substring(1, authoritiesArrString.length));
    } else if (authoritiesArrString.endsWith(this.SPERATOR)) {
      authoritiesForm.setValue(authoritiesArrString.substring(0, authoritiesArrString.length - 1));
    } else {
      authoritiesForm.setValue(authoritiesArrString);
    }
    console.log(authoritiesForm.value);
  }

  isCheckedAuthorities(value: string): boolean {
    if (this.authoritiesArr.includes(value)) {
      return true;
    }
  }

  private setAuthoritiesData() {
    const authoritiesString = this.addEditForm.controls.authorities.value.toString();
    if (authoritiesString.includes(this.SPERATOR)) {
      this.authoritiesArr = authoritiesString.split(this.SPERATOR);
    } else {
      if (authoritiesString === this.ROLE_CLIENT) {
        this.authoritiesArr = [authoritiesString, ''];
      } else {
        this.authoritiesArr = ['', authoritiesString];
      }
    }
  }

  // Create authorized_grant_type
  createGrant_type($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.PASSWORD_GRANT_TYPE) {
        this.grant_typeArr[0] = data.value;
      } else if (data.id === this.REFRESH_TOKEN) {
        this.grant_typeArr[1] = data.value;
      } else if (data.id === this.CLIENT_CREDENTIALS) {
        this.grant_typeArr[2] = data.value;
      } else if (data.id === this.AUTHORIZATION_CODE) {
        this.grant_typeArr[3] = data.value;
      }
    } else {
      if (data.id === this.PASSWORD_GRANT_TYPE) {
        this.grant_typeArr[0] = '';
      } else if (data.id === this.REFRESH_TOKEN) {
        this.grant_typeArr[1] = '';
      } else if (data.id === this.CLIENT_CREDENTIALS) {
        this.grant_typeArr[2] = '';
      } else if (data.id === this.AUTHORIZATION_CODE) {
        this.grant_typeArr[3] = '';
      }
    }
    // tslint:disable-next-line:variable-name
    const grant_typeArrString = this.grant_typeArr.toString();
    this.addEditForm.controls.authorizedGrantTypes.setValue(grant_typeArrString);
    // tslint:disable-next-line:variable-name
    // const grant_typeForm = this.addEditForm.controls.authorizedGrantTypes;
  }

  isCheckedGrant_type(value: string): boolean {
    if (this.grant_typeArr.includes(value)) {
      return true;
    }
  }

  private setGrant_typeArrData() {
    // tslint:disable-next-line:variable-name
    const grant_typeString = this.addEditForm.controls.authorizedGrantTypes.value.toString();
    if (grant_typeString.includes(this.SPERATOR)) {
      this.grant_typeArr = grant_typeString.split(this.SPERATOR);
    } else {
      if (grant_typeString === this.PASSWORD_GRANT_TYPE) {
        this.grant_typeArr = [grant_typeString, '', '', ''];
      } else if (grant_typeString === this.REFRESH_TOKEN) {
        this.grant_typeArr = ['', grant_typeString, '', ''];
      } else if (grant_typeString === this.CLIENT_CREDENTIALS) {
        this.grant_typeArr = ['', '', grant_typeString, ''];
      } else if (grant_typeString === this.AUTHORIZATION_CODE) {
        this.grant_typeArr = ['', '', '', grant_typeString];
      }
    }
  }


}
