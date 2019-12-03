import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArtistComponent} from './custom-components/artist/artist.component';
import {HomepageComponent} from './custom-components/homepage/homepage.component';
import {AlbumComponent} from './custom-components/album/album.component';
import {ComparisonComponent} from './custom-components/comparison/comparison.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'artist/:artistName', component: ArtistComponent},
  {path: 'artist/:artistName/album/:albumTitle', component: AlbumComponent},
  {path: 'comparison/:firstArtistName/versus/:secondArtistName', component: ComparisonComponent},
  {path: '**', redirectTo : '/'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
