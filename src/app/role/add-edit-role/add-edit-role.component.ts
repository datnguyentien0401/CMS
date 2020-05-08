import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ApiService} from '../../_services/api.service';
import {first, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {NumberValidation} from '../../validation/NumberValidation';
import {StringValidation} from '../../validation/StringValidation';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent implements OnInit {

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService) {
  }

  options: string[] = [];
  addEditForm: FormGroup;
  breakpoint: number;

  filteredOptions: Observable<string[]>;

  title: string;

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      roleName: ['', [Validators.required, StringValidation.textNotAccentedValidation]],
      description: ['', Validators.required]
    });

    this.title = 'role.management.add';

    if (window.sessionStorage.getItem('editRoleId')) {
      this.title = 'role.management.edit';
      const roleId = window.sessionStorage.getItem('editRoleId');
      this.apiService.get('/role/' + roleId, null)
        .subscribe(data => {
          this.addEditForm.setValue(data);
        });
    }
    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe(data => {
        this.options = data as string[];
        this.filteredOptions = this.addEditForm.controls.clientId.valueChanges
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
      const roleId = window.sessionStorage.getItem('editRoleId');
      this.apiService.patch('/role/' + roleId, this.addEditForm.value)
        .pipe(first())
        .subscribe(data => {
          this.dialog.closeAll();
        });
    } else {
      console.log(this.addEditForm.controls.clientId.value);
      this.apiService.post('/role', this.addEditForm.value)
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
