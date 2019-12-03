import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {ArtistComponent} from './custom-components/artist/artist.component';
import {NavBarComponent} from './custom-components/nav-bar/nav-bar.component';
import {HomepageComponent} from './custom-components/homepage/homepage.component';
import {AlbumComponent} from './custom-components/album/album.component';
import {ComparisonComponent} from './custom-components/comparison/comparison.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'artist/:artistName', component: ArtistComponent},
  {path: 'artist/:artistName/album/:albumTitle', component: AlbumComponent},
  {path: 'comparison/:', component: ComparisonComponent},
  {path: '**', redirectTo : '/'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
