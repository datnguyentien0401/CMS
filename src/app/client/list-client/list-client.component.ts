import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {Search} from '../../_models/Search';
import {AppSettings} from '../../app.settings';
import {HttpParams} from '@angular/common/http';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Client} from '../../_models/Client';
import {AddEditClientComponent} from '../add-edit-client/add-edit-client.component';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dialog: MatDialog) {
  }

  clients: any;
  search: Search;
  listForm: FormGroup;
  displayedColumns = ['stt', 'clientId', 'scope',
    'authorities', 'accessTokenValidity', 'addEdit', 'detail', 'delete'];

  pageSizeOption = AppSettings.PAGE_SIZE_OPTIONS;

  ngOnInit() {
    this.listForm = this.formBuilder.group({
      text: ['']
    });
    this.search = new Search();
    this.search.pageNumber = 0;
    this.search.text = '';
    this.search.pageSize = AppSettings.PAGE_SIZE;
    this.searchClient();
  }

  searchClient() {
    this.search.text = this.listForm.controls.text.value;
    const params = new HttpParams()
      .set('text', this.search.text)
      .set('pageNumber', this.search.pageNumber.toString())
      .set('pageSize', this.search.pageSize.toString());
    this.apiService.getPaging('/oauthClient/find', params)
      .subscribe(data => {
        console.log(data);
        this.clients = new MatTableDataSource<Client>(data.content);
        this.search.pageSize = data.size;
        this.search.pageNumber = data.number;
        this.search.totalElements = data.totalElements;
      });
  }

  getPage(page: any) {
    console.log(page);
  }

  addClient() {
    window.sessionStorage.removeItem('createClient');
    window.sessionStorage.setItem('createClient', 'true');
    this.dialog.open(AddEditClientComponent, {
      disableClose: false,
      width: '1000px'
    }).beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('createClient');
      this.searchClient();
    });
  }

  editClient(client: any) {
    window.sessionStorage.removeItem('editClientId');
    window.sessionStorage.setItem('editClientId', client.clientId);
    this.dialog.open(AddEditClientComponent, {
      disableClose: false,
      width: '1000px'
    }).beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('editClientId');
      this.searchClient();
    });

  }

  deleteClient(client: any) {
    if (confirm('Would you like delete this application?')) {
      this.apiService.delete('/oauthClient/' + client.clientId)
        .subscribe(data => {
          this.searchClient();
        });
    }
  }

  getDetail(client: any) {
    window.sessionStorage.removeItem('detailClient');
    window.sessionStorage.setItem('detailClientId', client.clientId);
    this.dialog.open(AddEditClientComponent, {
      disableClose: false,
      width: '1000px'
    }).beforeClosed().subscribe(x => {
      window.sessionStorage.removeItem('detailClientId');
    });
  }
}
