import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: 'artist/:name', component: AppComponent},
  {path: 'home', component: AppComponent},
  {path: '**', redirectTo : '/home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
