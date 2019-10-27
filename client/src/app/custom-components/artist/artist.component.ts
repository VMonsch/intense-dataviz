import { Component, OnInit } from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private artistName: string;
  albums: [any];
  page = 1;
  pageSize = 5;
  collectionSize;

  constructor(private wasabiService: WasabiService,
              private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.artistName = this.router.url.split('/')[2];
    this.wasabiService.getArtistByName(this.artistName).subscribe(data => {
        this.albums = data.albums;
        this.collectionSize = data.albums.length;
        console.log(this.albums);
      }
    );
  }

  get albumFormatter(): Array<any> [] {
    return this.albums === undefined
      ? []
      : (this.albums.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));

  }
  /*
    - Membre
    - More informations
    - liste des albums
    - Qui a particper le plus a un album (custom chart chelou)
    - durée dans le groupe (member)
    - localisation
    - plus de genre d'album (donuts)
    - le plus de label utilisé (bar)
    - durée de vie de la brand
   */

}
