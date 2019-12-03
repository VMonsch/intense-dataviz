import { Component, OnInit } from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {Router} from '@angular/router';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})

export class ComparisonComponent implements OnInit {

  private artistName: string;
  artistPicture: string;
  albums: [any];
  members: [any];
  page = 1;
  pageSize = 5;
  collectionSize;
  moreInfo: string;
  charts = {
    donutOfAlbumGenre: new am4charts.PieChart(),
    dumbellPlotDurationLife : new am4charts.XYChart(),
    artistContribution : new am4charts.XYChart()
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
      this.artistPicture = data.picture.xl;
      this.collectionSize = data.albums.length;
      this.members = data.members;
      this.moreInfo = data.urlWikipedia;
      this.initDonutChart(this.charts.donutOfAlbumGenre, 'kind-of-albums');
      this.initDumbellPlotChart(this.charts.dumbellPlotDurationLife, 'dumbell-plot-for-life-duration-brand');
      this.initStackedChart(this.charts.artistContribution, 'stacked-artist-contribution');
      this.ngxService.stop();
    });
  }

  initDonutChart(chart: am4charts.PieChart, divName: string) {
    chart = am4core.create(divName, am4charts.PieChart);
    this.amChartsService.drawDonutChartArtistKind(chart, this.albums);
  }

  initDumbellPlotChart(chart: am4charts.XYChart, divName: string) {
    chart = am4core.create(divName, am4charts.XYChart);
    this.amChartsService.drawDurationInBrand(chart, this.members);
  }

  initStackedChart(chart: am4charts.XYChart, divName: string) {
    chart = am4core.create(divName, am4charts.XYChart);
    const data = [];
    const listOfArtist = [];
    this.albums.forEach(a => {
      const value = {};
      a.songs.forEach(s => {
        if (s.writer !== undefined) {
          s.writer.forEach(w => {
            if (value[w] === undefined) {
              value[w] = 1;
              if (!listOfArtist.includes(w)) {
                listOfArtist.push(w);
              }
            } else {
              value[w] += 1;
            }
          });
        }
      });
      if (a.title.length > 50) {
        a.title = a.title.substr(0, 50);
        a.title += '...';
      }
      // @ts-ignore
      value.title = a.title;
      data.push(value);
    });
    this.amChartsService.drawStackedArtistContribution(chart, data, listOfArtist);
  }

  get albumFormatter(): Array < any > [] {
    return this.albums === undefined
      ? []
      : (this.albums.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));

  }

  onClickAlbum(album) {
    this.router.navigate(['/artist', album.name, 'album', album.title]);
  }

}
