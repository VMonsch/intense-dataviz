import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_timeline from '@amcharts/amcharts4/plugins/timeline';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { WasabiService } from './wasabi.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone, private wasabiService: WasabiService) {}

  ngAfterViewInit() {
  this.zone.runOutsideAngular(() => {
    this.initXYDemoChart('demo-chart');
    this.initColumnChart('column-chart');
    });

  this.getHobbies();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  getHobbies() {
    this.wasabiService.getHobbies().then(response => {
      console.log(response.data);

    });
  }

  initXYDemoChart(divName: string) {
    const chart = am4core.create(divName, am4charts.XYChart);

    chart.paddingRight = 20;

    const data = [];
    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
    }

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    series.tooltipText = '{valueY.value}';
    chart.cursor = new am4charts.XYCursor();

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }

  initColumnChart(divName: string) {
    const chart = am4core.create(divName, am4charts.XYChart);

// Add data
    chart.data = [{
      name: 'John',
      points: 35654,
      color: chart.colors.next(),
      bullet: 'https://www.amcharts.com/lib/images/faces/A04.png'
    }, {
      name: 'Damon',
      points: 65456,
      color: chart.colors.next(),
      bullet: 'https://www.amcharts.com/lib/images/faces/C02.png'
    }, {
      name: 'Patrick',
      points: 45724,
      color: chart.colors.next(),
      bullet: 'https://www.amcharts.com/lib/images/faces/D02.png'
    }, {
      name: 'Mark',
      points: 13654,
      color: chart.colors.next(),
      bullet: 'https://www.amcharts.com/lib/images/faces/E01.png'
    }];

// Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
    categoryAxis.renderer.labels.template.fontSize = 20;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = '4,4';
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

// Do not crop bullets
    chart.maskBullets = false;

// Remove padding
    chart.paddingBottom = 0;

// Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'points';
    series.dataFields.categoryX = 'name';
    series.columns.template.propertyFields.fill = 'color';
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/b]';

// Add bullets
    const bullet = series.bullets.push(new am4charts.Bullet());
    const image = bullet.createChild(am4core.Image);
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'bottom';
    image.dy = 20;
    image.y = am4core.percent(100);
    image.propertyFields.href = 'bullet';
    image.tooltipText = series.columns.template.tooltipText;
    image.propertyFields.fill = 'color';
    image.filters.push(new am4core.DropShadowFilter());
  }
}
