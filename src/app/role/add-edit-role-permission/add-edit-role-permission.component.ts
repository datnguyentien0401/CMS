import {Component, OnInit} from '@angular/core';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../_services/api.service';
import {first} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {Menu} from "../../_models/Menu";

@Component({
  selector: 'app-add-edit-role-permission',
  templateUrl: './add-edit-role-permission.component.html',
  styleUrls: ['./add-edit-role-permission.component.scss']
})
export class AddEditRolePermissionComponent implements OnInit {

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private apiService: ApiService) {
  }

  MOBILE = 'MOBILE';
  WEB = 'WEB';
  title: string;
  // tslint:disable-next-line:ban-types
  menuList: any = [];
  permissionList: any;
  menuIds: Array<number>;
  permissionIds: Array<number>;

  role: any;
  addEditForm: FormGroup;

  menuLv1: Menu[] = [];
  menuLv2: Menu[] = [];

  ngOnInit() {
    this.menuIds = [];
    this.permissionIds = [];
    this.title = 'role.management.addPermission';
    const roleId = window.sessionStorage.getItem('addPermission');
    this.apiService.get('/role/' + roleId, null)
      .subscribe(role => {
        this.role = role;
        for (const menu of this.role.menus) {
          this.menuIds.push(menu.id);
        }
        for (const permission of this.role.permissions) {
          this.permissionIds.push(permission.id);
        }
        const params = new HttpParams()
          .set('client-id', this.role.clientId ? this.role.clientId : '');
        this.apiService.get('/menu/client-id', params)
          .subscribe(menuList => {
            console.log(menuList);
            this.menuList = menuList;
            this.setMenuLv();
          });

        this.apiService.get('/permission/client-id', params)
          .subscribe(permissionList => {
            this.permissionList = permissionList;
          });
      });
  }

  private setMenuLv() {
    const parentMenuIds = [];
    for (const menu of this.menuList) {
      if (menu.parentMenu === null) {
        this.menuLv1.push(menu);
        parentMenuIds.push(menu.id);
      }
    }
    parentMenuIds.slice(0, parentMenuIds.length);
    for (const menu of this.menuList) {
      if (menu.parentMenu != null && parentMenuIds.includes(menu.parentMenu.id) && !this.menuLv1.includes(menu)) {
        this.menuLv2.push(menu);
      }
    }
  }

  onSubmit() {
    const menuFormArray = this.formBuilder.array([]);
    const permissionFormArray = this.formBuilder.array([]);
    for (const menuId of this.menuIds) {
      const menuCtrl = new FormControl({
        id: menuId
      });
      menuFormArray.push(menuCtrl);
    }

    for (const permissionId of this.permissionIds) {
      const permissionCtrl = new FormControl({
        id: permissionId
      });
      permissionFormArray.push(permissionCtrl);
    }

    const formGroup = this.formBuilder.group({
      clientId: this.role.clientId,
      roleName: this.role.roleName,
      description: this.role.description,
      menus: menuFormArray,
      permissions: permissionFormArray
    });

    this.apiService.patch('/role/' + this.role.id, formGroup.value)
      .pipe(first())
      .subscribe(x => {
        this.dialog.closeAll();
      });

  }

  isChecked(id: any, type: string) {
    if (type === 'menu') {
      if (this.menuIds.includes(id)) {
        return true;
      }
    } else if (type === 'permission') {
      if (this.permissionIds.includes(id)) {
        return true;
      }
    }
  }

  changePermission($event: MatCheckboxChange) {
    const permissionId = $event.source.value;
    if ($event.checked) {
      this.permissionIds.push(Number(permissionId));
    } else {
      const index = this.permissionIds.indexOf(Number(permissionId));
      this.permissionIds.splice(index, 1);
    }
  }

  changeMenuChild($event: MatCheckboxChange) {
    const menuId = Number($event.source.value);
    this.changeMenuCurrent($event.checked, menuId);
    const menuChild = this.getMenuById(this.menuLv2, menuId);
    this.changeMenuParent($event.checked, this.menuLv1, this.menuLv2, menuChild);
  }

  changeMenuParent(isChecked: boolean, parentMenus: Menu[], childMenus: Menu[], menuChild: Menu) {
    if (menuChild) {
      for (const menuParent of parentMenus) {
        if (menuChild.parentMenu.id === menuParent.id) {
          if (isChecked) {
            if (this.menuIds.indexOf(menuParent.id) === -1) {
              this.menuIds.push(Number(menuParent.id));
            }
          } else {
            let childMenuCheckedNum = 0;
            for (const menu of childMenus) {
              if (menu.parentMenu.id === menuParent.id) {
                if (this.menuIds.indexOf(menu.id) !== -1) {
                  childMenuCheckedNum++;
                }
              }
            }
            if (childMenuCheckedNum === 0) {
              const index = this.menuIds.indexOf(menuParent.id);
              this.menuIds.splice(index, 1);
            }
          }
        }
      }
    }
  }

  changeMenuAll($event: MatCheckboxChange) {
    const menuId = Number($event.source.value);
    this.changeMenuCurrent($event.checked, menuId);
    this.changeMenuChildAll($event.checked, this.menuLv2, menuId);
  }

  changeMenuCurrent(isChecked: boolean, menuId: number) {
    if (isChecked) {
      this.menuIds.push(menuId);
    } else {
      const index = this.menuIds.indexOf(menuId);
      this.menuIds.splice(index, 1);
    }
  }

  changeMenuChildAll(isChecked: boolean, childMenus: Menu[], menuParentId: number) {
    for (const menuChild of childMenus) {
      if (menuParentId === menuChild.parentMenu.id) {
        if (isChecked) {
          this.menuIds.push(menuChild.id);
        } else {
          const index = this.menuIds.indexOf(menuChild.id);
          this.menuIds.splice(index, 1);
        }
      }
    }
  }

  getMenuById(menus: Menu[], id: number): Menu {
    for (const menu of menus) {
      if (menu.id === id) {
        return menu;
      }
    }
    return null;
  }
}
