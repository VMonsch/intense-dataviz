import {AfterViewInit, Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AmchartsService} from '../../../service/amcharts.service';
import {Observable} from 'rxjs';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})

export class ColumnChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  chart: am4charts.XYChart;
  @Input()
  chartId: string;
  @Input()
  data: Array<any>;

  constructor(private zone: NgZone,
              private amChartsService: AmchartsService) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.initChart();
    });
  }

  ngOnInit() {
  }

  initChart() {
    this.chart = am4core.create(this.chartId, am4charts.XYChart);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart !== undefined) {
      this.amChartsService.drawColumnChart(this.chart, this.data);
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      this.chart.dispose();
    });
  }

}
