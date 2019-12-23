import { Component, OnInit } from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ArtistModel} from '../../model/ArtistModel';
import {forkJoin, Observable} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})

export class ComparisonComponent implements OnInit {

  firstArtist = new ArtistModel();
  secondArtist = new ArtistModel();
  charts = {
    donutOfAlbumGenre: new am4charts.PieChart(),
    dumbellPlotDurationLife : new am4charts.XYChart(),
    artistContribution : new am4charts.XYChart()
  };

  constructor(private wasabiService: WasabiService,
              private amChartsService: AmchartsService,
              private ngxService: NgxUiLoaderService,
              private titleService: Title,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(routeParameters => {
      this.firstArtist.name = routeParameters.firstArtistName;
      this.secondArtist.name = routeParameters.secondArtistName;
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.firstArtist.name + ' VS ' + this.secondArtist.name + ' - ' + environment.appName);

    this.ngxService.start();

    forkJoin(
      this.fetchArtist(this.firstArtist),
      this.fetchArtist(this.secondArtist)
    ).subscribe(completion => this.ngxService.stop());
  }

  fetchArtist(artist: ArtistModel): Observable<any> {
    const observable = this.wasabiService.getArtistByName(artist.name);

    observable.subscribe(data => {
      artist.albums = data.albums;
      artist.picture = data.picture.xl;
      artist.collectionSize = data.albums.length;
      artist.members = data.members;
      artist.moreInfo = data.urlWikipedia;
    });

    return observable;
  }

  onClickAlbum(album) {
    this.router.navigate(['/artist', album.name, 'album', album.title]);
  }

}
