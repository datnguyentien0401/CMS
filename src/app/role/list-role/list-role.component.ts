import {Component, OnInit} from '@angular/core';
import {Search} from '../../_models/Search';
import {AppSettings} from '../../app.settings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig, MatTableDataSource, PageEvent} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {Role} from '../../_models/role.model';
import {AddEditRoleComponent} from '../add-edit-role/add-edit-role.component';
import {AddEditRolePermissionComponent} from '../add-edit-role-permission/add-edit-role-permission.component';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {

  warnConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };
  roles: any;
  search: Search;
  listForm: FormGroup;
  displayedColumns = ['stt', 'clientId', 'roleName', 'description', 'addEdit', 'delete', 'addPermission'];
  pageSizeOption = AppSettings.PAGE_SIZE_OPTIONS;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.listForm = this.formBuilder.group({
      text: ['']
    });
    this.search = new Search();
    this.search.clientId = '';
    this.search.text = '';
    this.search.pageSize = AppSettings.PAGE_SIZE;
    this.search.pageNumber = 0;
    this.searchRole();
  }

  addRole(): void {
    this.dialog.open(AddEditRoleComponent, {disableClose: false, width: '700px'})
      .beforeClosed().subscribe(x => {
      this.searchRole();
    });
  }

  editRole(role: Role) {
    window.sessionStorage.removeItem('editRoleId');
    window.sessionStorage.setItem('editRoleId', role.id.toString());

    this.dialog.open(AddEditRoleComponent, {disableClose: false, width: '700px'})
      .beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('editRoleId');
      this.searchRole();
    });
  }

  deleteRole(role: any) {
    console.log(role);
    if (confirm('Would you like delete this row?')) {
      if (role.menus.length === 0 && role.permissions.length === 0) {
        this.apiService.delete('/role/' + role.id)
          .subscribe(data => {
            this.searchRole();
          });
      } else {
        this.snackBar.open('This role has some menu and permission, please delete all first!!!', '', this.warnConfig);
      }

    }
  }

  filterRoleByClientId(clientId) {
    this.search.clientId = clientId ? clientId : '';
    this.searchRole();
  }

  searchRole() {
    this.search.text = this.listForm.controls.text.value;
    const params = new HttpParams()
      .set('clientId', this.search.clientId ? this.search.clientId : '')
      .set('text', this.search.text)
      .set('pageNumber', this.search.pageNumber.toString())
      .set('pageSize', this.search.pageSize.toString());

    this.apiService.getPaging('/role/find', params)
      .subscribe(data => {
        console.log(data);
        this.roles = new MatTableDataSource<Role>(data.content);
        this.search.pageNumber = data.number;
        this.search.pageSize = data.size;
        this.search.totalElements = data.totalElements;
      });
  }

  getPage(page: any) {
    this.search.pageNumber = page.pageIndex;
    this.search.pageSize = page.pageSize;
    this.searchRole();
  }

  addPermission(role: any) {
    window.sessionStorage.removeItem('addPermission');
    window.sessionStorage.setItem('addPermission', role.id);
    this.dialog.open(AddEditRolePermissionComponent, {
      disableClose: false,
      width: '90%',
      maxWidth: '90%',
      height: '500px'
    }).beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('addPermission');
      this.searchRole();
    });
  }
}
