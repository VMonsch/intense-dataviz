import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase';
import { AppComponent } from './app.component';
import {ArtistComponent} from './custom-components/artist/artist.component';
import {NavBarComponent} from './custom-components/nav-bar/nav-bar.component';
import {HomepageComponent} from './custom-components/homepage/homepage.component';
import {AlbumComponent} from './custom-components/album/album.component';

const routes: Routes = [
  {path: 'artist/:name', component: ArtistComponent},
  {path: 'album/:name', component: AlbumComponent},
  {path: 'home', component: HomepageComponent},
  {path: '**', redirectTo : '/home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
