import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogoutComponent} from './logout/logout.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {AddEditUserComponent} from './user/add-edit-user/add-edit-user.component';
import {ListRoleComponent} from './role/list-role/list-role.component';
import {AddEditRoleComponent} from './role/add-edit-role/add-edit-role.component';
import {ListMenuComponent} from './menu/list-menu/list-menu.component';
import {AddEditMenuComponent} from './menu/add-edit-menu/add-edit-menu.component';
import {ListPermissionComponent} from './permission/list-permission/list-permission.component';
import {AddEditPermissionComponent} from './permission/add-edit-permission/add-edit-permission.component';
import {ListClientComponent} from './client/list-client/list-client.component';
import {AddEditClientComponent} from './client/add-edit-client/add-edit-client.component';


const routes: Routes = [
  {path: '', component: ListUserComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'list-user', component: ListUserComponent},
  {path: 'add-edit-user', component: AddEditUserComponent},
  {path: 'list-role', component: ListRoleComponent},
  {path: 'add-edit-role', component: AddEditRoleComponent},
  {path: 'list-menu', component: ListMenuComponent},
  {path: 'add-edit-menu', component: AddEditMenuComponent},
  {path: 'list-permission', component: ListPermissionComponent},
  {path: 'add-edit-permission', component: AddEditPermissionComponent},
  {path: 'list-client', component: ListClientComponent},
  {path: 'add-edit-client', component: AddEditClientComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
