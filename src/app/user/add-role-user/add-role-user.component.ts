import {Component, OnInit} from '@angular/core';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import {FormBuilder, FormControl} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss']
})
export class AddRoleUserComponent implements OnInit {

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService) {

  }

  title: string;
  user: any;
  roleList: any;
  roleIds: Array<number> = [];

  ngOnInit() {
    this.title = 'user.management.addRole';
    const userId = window.sessionStorage.getItem('addRole');
    this.apiService.get('/user/' + userId, null)
      .subscribe(user => {
        this.user = user;
        for (const role of this.user.roles) {
          this.roleIds.push(role.id);
        }
      });

    this.apiService.get('/role/getAll', null)
      .subscribe(roleList => {
        this.roleList = roleList;
      });
  }

  onSubmit() {
    const roleFromArray = this.formBuilder.array([]);
    for (const role of this.roleList) {
      if (this.roleIds.includes(role.id)) {
        const roleCtrl = new FormControl({
          id: role.id,
        });
        roleFromArray.push(roleCtrl);
      }
    }

    const formGroup = this.formBuilder.group({
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      roles: roleFromArray
    });
    this.apiService.patch('/user/' + this.user.id, formGroup.value)
      .pipe(first())
      .subscribe(data => {

        this.dialog.closeAll();
      });
  }

  isChecked(roleId: any) {
    if (this.roleIds.includes(roleId)) {
      return true;
    }
  }

  createRoleIds($event: MatCheckboxChange) {
    const roleId = $event.source.value;
    if ($event.checked) {
      this.roleIds.push(Number(roleId));
    } else {
      const index = this.roleIds.indexOf(Number(roleId));
      this.roleIds.splice(index, 1);
    }
  }
}
