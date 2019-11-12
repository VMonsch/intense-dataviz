import { Component, OnInit } from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private artistName: string;
  albums: [any];
  members: [any];
  page = 1;
  pageSize = 5;
  collectionSize;
  charts = {
    donutOfAlbumGenre: new am4charts.PieChart(),
    dumbellPlotDurationLife : new am4charts.XYChart(),
  };

  constructor(private wasabiService: WasabiService,
              private amChartsService: AmchartsService,
              private ngxService: NgxUiLoaderService,
              private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.ngxService.start();

    this.artistName = this.router.url.split('/')[2];
    this.wasabiService.getArtistByName(this.artistName).subscribe(data => {
        this.albums = data.albums;
        this.collectionSize = data.albums.length;
        this.members = data.members;
        this.initDonutChart(this.charts.donutOfAlbumGenre, 'kind-of-albums');
        this.initDumbellPlotChart(this.charts.dumbellPlotDurationLife, 'dumbell-plot-for-life-duration-brand');
        this.ngxService.stop();
      }
    );
  }

  initDonutChart(chart: am4charts.PieChart, divName: string) {
    chart = am4core.create(divName, am4charts.PieChart);
    this.amChartsService.drawDonutChartArtistKind(chart, this.albums);
  }

  initDumbellPlotChart(chart: am4charts.XYChart, divName: string) {
    chart = am4core.create(divName, am4charts.XYChart);
    this.amChartsService.drawDurationInBrand(chart, this.members);
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
