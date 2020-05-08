import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../_services/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Search} from '../../_models/Search';
import {AppSettings} from '../../app.settings';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {Menu} from '../../_models/Menu';
import {AddEditMenuComponent} from '../add-edit-menu/add-edit-menu.component';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent implements OnInit {
  menus: any;
  listForm: FormGroup;
  search: Search;
  displayedColumns = ['stt', 'clientId', 'code', 'url', 'appType', 'addEdit', 'delete'];
  pageSizeOption = AppSettings.PAGE_SIZE_OPTIONS;

  constructor(private dialog: MatDialog, private apiService: ApiService, private formBuilder: FormBuilder) {
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
    this.searchMenu();
  }

  filterMenuByClientId(clientId) {
    this.search.clientId = clientId ? clientId : '';
    this.searchMenu();
  }

  searchMenu() {
    this.search.text = this.listForm.controls.text.value;
    const params = new HttpParams()
      .set('clientId', this.search.clientId ? this.search.clientId : '')
      .set('text', this.search.text)
      .set('pageNumber', this.search.pageNumber.toString())
      .set('pageSize', this.search.pageSize.toString());

    this.apiService.getPaging('/menu/find', params)
      .subscribe(data => {
        console.log(data);
        this.menus = new MatTableDataSource<Menu>(data.content);
        this.search.pageNumber = data.number;
        this.search.pageSize = data.size;
        this.search.totalElements = data.totalElements;
      });
  }

  addMenu() {
    this.dialog.open(AddEditMenuComponent, {disableClose: false, width: '700px'})
      .beforeClosed().subscribe(x => {
      this.searchMenu();
    });
  }

  editMenu(menu: Menu) {
    window.sessionStorage.removeItem('editMenuId');
    window.sessionStorage.setItem('editMenuId', menu.id.toString());
    this.dialog.open(AddEditMenuComponent, {disableClose: false, width: '700px'})
      .beforeClosed().subscribe(data => {
      window.sessionStorage.removeItem('editMenuId');
      this.searchMenu();
    });
  }

  deleteMenu(menu: Menu) {
    if (confirm('Would you like delete this row?')) {
      this.apiService.delete('/menu/' + menu.id.toString())
        .subscribe(x => {
          this.searchMenu();
        });
    }
  }

  getPage(page: any) {
    this.search.pageNumber = page.pageIndex;
    this.search.pageSize = page.pageSize;
    this.searchMenu();
  }
}
