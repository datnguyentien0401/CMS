import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ApiService} from '../../_services/api.service';
import {Observable} from 'rxjs';
import {first, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styleUrls: ['./add-edit-permission.component.scss']
})
export class AddEditPermissionComponent implements OnInit {

  constructor(public dialog: MatDialog, private apiService: ApiService, private formBuilder: FormBuilder) { }

  myControl = new FormControl();
  options: string[] = [];
  addEditForm: FormGroup;
  breakpoint: number;
  filteredOptions: Observable<string[]>;

  title: string;
  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      url: ['', [Validators.required]],
      description: ''
    });

    this.title = 'permission.management.add';
    if (window.sessionStorage.getItem('editPermissionId')) {
      this.title = 'permission.management.edit';
      const permissionId = window.sessionStorage.getItem('editPermissionId');
      this.apiService.get('/permission/' + permissionId, null)
        .subscribe(data => {
          this.addEditForm.setValue(data);
        });
    }

    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe(data => {
        this.options = data as string[];
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });
  }

  isEdit(): boolean {
    if (this.addEditForm.controls.id.value) {
      return true;
    }
  }

  onSubmit() {
    if (this.isEdit()) {
      const permissionId = window.sessionStorage.getItem('editPermissionId');
      this.apiService.patch('/permission/' + permissionId, this.addEditForm.value)
        .pipe(first())
        .subscribe(data => {
          this.dialog.closeAll();
        });
    } else {
      this.apiService.post('/permission', this.addEditForm.value)
        .subscribe(data => {
          this.dialog.closeAll();
        });
    }
  }

  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getOptionValue($event: any) {
    this.addEditForm.controls.clientId.setValue($event.option.value);
  }

}
