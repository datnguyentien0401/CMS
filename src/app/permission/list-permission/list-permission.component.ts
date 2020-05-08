import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {Search} from '../../_models/Search';
import {AppSettings} from '../../app.settings';
import {HttpParams} from '@angular/common/http';
import {Permission} from '../../_models/Permission';
import {AddEditPermissionComponent} from '../add-edit-permission/add-edit-permission.component';

@Component({
  selector: 'app-list-permission',
  templateUrl: './list-permission.component.html',
  styleUrls: ['./list-permission.component.scss']
})
export class ListPermissionComponent implements OnInit {

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService) {
  }

  permissions: any;
  search: Search;
  listForm: FormGroup;
  displayedColumns = ['stt', 'clientId', 'url', 'description', 'addEdit', 'delete'];
  pageSizeOption = AppSettings.PAGE_SIZE_OPTIONS;
  ngOnInit() {
    this.listForm = this.formBuilder.group({
      text: ['']
    });
    this.search = new Search();
    this.search.clientId = '';
    this.search.text = '';
    this.search.pageSize = AppSettings.PAGE_SIZE;
    this.search.pageNumber = 0;
    this.searchPermission();
  }

  addPermission(): void {
    this.dialog.open(AddEditPermissionComponent, {disableClose: false, width: '500px'})
      .beforeClosed().subscribe(x => {
      this.searchPermission();
    });
  }

  editPermission(permission: Permission) {
    window.sessionStorage.removeItem('editPermissionId');
    window.sessionStorage.setItem('editPermissionId', permission.id.toString());

    this.dialog.open(AddEditPermissionComponent, {disableClose: false, width: '500px'})
      .beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('editPermissionId');
      this.searchPermission();
    });
  }

  deletePermission(permission: Permission) {
    if (confirm('Would you like delete this row?')) {
      this.apiService.delete('/permission/' + permission.id)
        .subscribe(data => {
          this.searchPermission();
        });
    }
  }

  filterPermissionByClientId(clientId) {
    this.search.clientId = clientId ? clientId : '';
    this.searchPermission();
  }

  searchPermission() {
    this.search.text = this.listForm.controls.text.value;
    const params = new HttpParams()
      .set('clientId', this.search.clientId ? this.search.clientId : '')
      .set('text', this.search.text)
      .set('pageNumber', this.search.pageNumber.toString())
      .set('pageSize', this.search.pageSize.toString());

    this.apiService.getPaging('/permission/find', params)
      .subscribe(data => {
        console.log(data);
        this.permissions = new MatTableDataSource<Permission>(data.content);
        this.search.pageNumber = data.number;
        this.search.pageSize = data.size;
        this.search.totalElements = data.totalElements;
      });
  }

  getPage(page: any) {
    this.search.pageNumber = page.pageIndex;
    this.search.pageSize = page.pageSize;
    this.searchPermission();
  }
}
