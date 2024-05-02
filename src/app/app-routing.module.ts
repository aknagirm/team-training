import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexComponent } from './flex/flex.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes: Routes = [
  { path: 'flex-scroll', component: FlexComponent },
  { path: 'rxjs', component: RxjsComponent },
  { path: '', redirectTo: '/flex-scroll', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
