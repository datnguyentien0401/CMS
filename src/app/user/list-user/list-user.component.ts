import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../_models/user.model';
import {ApiService} from '../../_services/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Search} from '../../_models/Search';
import {AppSettings} from '../../app.settings';
import {HttpParams} from '@angular/common/http';
import {AddEditUserComponent} from '../add-edit-user/add-edit-user.component';
import {MatDialog, MatPaginatorIntl, MatSnackBar, MatSnackBarConfig, MatTableDataSource} from '@angular/material';
import {MultilanguagePanigator} from '../../_helpers/multilanguage.paginator';
import {AddRoleUserComponent} from '../add-role-user/add-role-user.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator}
  ]
})
export class ListUserComponent implements OnInit {

  warnConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };

  users: any;
  search: Search;
  listForm: FormGroup;
  displayedColumns = ['stt', 'username', 'firstName', 'lastName', 'addEdit', 'delete', 'addRole'];
  pageSizeOption = AppSettings.PAGE_SIZE_OPTIONS;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
  }

  ngOnInit() {
    this.listForm = this.formBuilder.group({
      text: ['']
    });
    this.search = new Search();
    this.search.text = '';
    this.search.pageSize = AppSettings.PAGE_SIZE;
    this.search.pageNumber = 0;
    this.searchUser();
  }

  deleteUser(user: User): void {

    if (confirm('Would you like delete this row?')) {
      if (user.roles.length === 0) {
        this.apiService.delete('/user/' + user.id)
          .subscribe(data => {
            this.searchUser();
          });
      } else {
        this.snackBar.open('This user has some role, please delete all user\'s roles first!!!', '', this.warnConfig);
      }

    }
  }

  editUser(user: User): void {
    window.sessionStorage.removeItem('editUserId');
    window.sessionStorage.setItem('editUserId', user.id.toString());
    this.dialog.open(AddEditUserComponent, {disableClose: false, width: '500px'})
      .beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('editUserId');
      this.searchUser();
    });
  }

  addUser(): void {
    this.dialog.open(AddEditUserComponent, {disableClose: false, width: '500px'})
      .beforeClosed().subscribe(x => {
      this.searchUser();
    });
  }

  searchUser() {
    this.search.text = this.listForm.controls.text.value;
    const params = new HttpParams()
      .set('text', this.search.text)
      .set('pageNumber', this.search.pageNumber.toString())
      .set('pageSize', this.search.pageSize.toString());
    this.apiService.getPaging('/user/find', params)
      .subscribe(data => {
        console.log(data);
        this.users = new MatTableDataSource<User>(data.content);
        this.search.pageSize = data.size;
        this.search.pageNumber = data.number;
        this.search.totalElements = data.totalElements;
      });
  }

  getPage(page: any) {
    this.search.pageNumber = page.pageIndex;
    this.search.pageSize = page.pageSize;
    this.searchUser();
  }

  addRole(user: any) {
    window.sessionStorage.removeItem('addRole');
    window.sessionStorage.setItem('addRole', user.id);
    this.dialog.open(AddRoleUserComponent, {
      disableClose: false,
      width: '60%',
      maxWidth: '90%',
      maxHeight: '90vh'
    }).beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('addRole');
      this.searchUser();
    });
  }
}
