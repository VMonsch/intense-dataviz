import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private zone: NgZone,
    private wasabiService: WasabiService,
    private amChartsService: AmchartsService) {}

  charts = {
    artistsWithMostAlbumsChart: new am4charts.XYChart(),
    artistsWithMostBandsChart: new am4charts.XYChart(),
    oscilloChart: new am4charts.XYChart()
  };

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.initColumnChart(this.charts.artistsWithMostAlbumsChart, 'artists-with-most-albums-chart', this.wasabiService.getArtistsWithMostAlbums());
      this.initColumnChart(this.charts.artistsWithMostBandsChart, 'artists-with-most-bands-chart', this.wasabiService.getArtistsWithMostBands());
    });
  }

  ngOnInit() {
  }

  initColumnChart(chart: am4charts.XYChart, divName: string, observable: Observable<any>) {
    chart = am4core.create(divName, am4charts.XYChart);

    observable.subscribe(data => {
      this.amChartsService.drawColumnChart(chart, data);
    });
  }

  initOscilloChart(divName: string, observable: Observable<any>) {
    this.charts.oscilloChart = am4core.create(divName, am4charts.XYChart);

    observable.subscribe(data => {
      this.amChartsService.drawOscilloChart(this.charts.oscilloChart, data);
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      this.charts.artistsWithMostAlbumsChart.dispose();
      this.charts.artistsWithMostBandsChart.dispose();
      this.charts.oscilloChart.dispose();
    });
  }
}
