import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

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

  columnChart: am4charts.XYChart;
  oscilloChart: am4charts.XYChart;

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.initColumnChart('column-chart');
      this.initOscilloChart('oscillo-chart');
    });
  }

  ngOnInit() {
  }

  initColumnChart(divName: string) {
    this.columnChart = am4core.create(divName, am4charts.XYChart);

    this.wasabiService.getArtistsWithMostAlbums().subscribe(data => {
      this.amChartsService.drawColumnChart(this.columnChart, data);
    });
  }

  initOscilloChart(divName: string) {
    this.oscilloChart = am4core.create(divName, am4charts.XYChart);

    this.wasabiService.getArtistsWithMostAlbums().subscribe(data => {
      this.amChartsService.drawOscilloChart(this.oscilloChart, data);
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.columnChart) {
        this.columnChart.dispose();
      }
      if (this.oscilloChart) {
        this.oscilloChart.dispose();
      }
    });
  }
}
