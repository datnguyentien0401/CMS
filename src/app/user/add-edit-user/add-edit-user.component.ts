import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../_services/api.service';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router, private userService: ApiService) {
  }

  addEditForm: FormGroup;
  breakpoint: number;

  title: string;
  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]]
    });
    this.title = 'user.management.add';
    if (window.sessionStorage.getItem('editUserId')) {
      this.title = 'user.management.edit';
      const userId = window.sessionStorage.getItem('editUserId');
      this.userService.get('/user/' + userId, null)
        .subscribe(data => {
          console.log(data);
          this.addEditForm.setValue(data);
        });
    }
  }

  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  isEdit() {
    if (this.addEditForm.controls.id.value) {
      return true;
    }
  }
  onSubmit() {
     if (this.isEdit()) {
       const userId = window.sessionStorage.getItem('editUserId');
       this.userService.patch('/user/' + userId, this.addEditForm.value)
        .pipe(first())
        .subscribe(data => {
            this.dialog.closeAll();
          });
    } else {
      this.userService.post('/user', this.addEditForm.value)
        .subscribe(data => {
          this.dialog.closeAll();
        });
    }
  }

}
