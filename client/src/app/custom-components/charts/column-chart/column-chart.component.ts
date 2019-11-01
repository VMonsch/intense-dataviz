import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {AmchartsService} from '../../../service/amcharts.service';
import {Observable} from 'rxjs';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})

export class ColumnChartComponent implements OnInit, AfterViewInit {

  @Input()
  chartId: string;
  @Input()
  chart: am4charts.XYChart;
  @Input()
  observable: Observable<any>;

  constructor(private zone: NgZone,
              private amChartsService: AmchartsService) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.initColumnChart();
    });
  }

  ngOnInit() {
  }

  initColumnChart() {
    this.chart = am4core.create(this.chartId, am4charts.XYChart);

    this.observable.subscribe(data => {
      this.amChartsService.drawColumnChart(this.chart, data);
    });
  }

}
