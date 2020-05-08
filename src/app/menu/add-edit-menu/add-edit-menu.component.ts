import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {first, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Menu} from '../../_models/Menu';

@Component({
  selector: 'app-add-edit-menu',
  templateUrl: './add-edit-menu.component.html',
  styleUrls: ['./add-edit-menu.component.scss']
})
export class AddEditMenuComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  menus: any = new Observable<Menu>();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  addEditForm: FormGroup;
  breakpoint: number;
  title: string;
  selected = -1;
  parentMenu: any;

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      code: ['', [Validators.required, Validators.pattern('[a-zA-Z_]+([a-zA-Z_ ]+)*')]],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      url: '',
      appType: ['', [Validators.required]],
      parentMenu: Object
    });

    this.apiService.get('/menu/getAll', null)
      .subscribe(data => {
        this.menus = data;
      });

    this.title = 'menu.management.add';
    if (window.sessionStorage.getItem('editMenuId')) {
      this.title = 'menu.management.edit';
      const menuId = window.sessionStorage.getItem('editMenuId');
      this.apiService.get('/menu/' + menuId, null)
        .subscribe(data => {
          this.addEditForm.setValue(data);
          this.parentMenu = this.addEditForm.controls.parentMenu.value;
          console.log(this.parentMenu);
          if (this.menus.length > 0) {
            for (const menu of this.menus) {
              if (this.parentMenu.id === menu.id) {
                this.selected = menu.id;
                break;
              }
            }
          }
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

  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  onSubmit() {
    console.log(this.addEditForm.controls.parentMenu.value);
    if (this.addEditForm.controls.parentMenu.value === -1) {
      this.addEditForm.controls.parentMenu.setValue(null);
    } else {
      const parentMenu = new FormControl({
        id: this.addEditForm.controls.parentMenu.value
      });
      this.addEditForm.controls.parentMenu.setValue(parentMenu.value);
    }

    if (this.isEdit()) {
      const menuId = window.sessionStorage.getItem('editMenuId');
      this.apiService.patch('/menu/' + menuId, this.addEditForm.value)
        .pipe(first())
        .subscribe(data => {
          this.dialog.closeAll();
        });
    } else {

      this.apiService.post('/menu', this.addEditForm.value)
        .subscribe(data => {
            this.dialog.closeAll();
          },
          error1 => {
            // this.config.panelClass = 'warn';
            this.snackBar.open('This menu code is existed!', '', this.config);
          }
        );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
