import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { WasabiService } from './wasabi.service';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Artist} from './model/artist';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy, AfterViewInit {
  constructor(
    private zone: NgZone,
    private wasabiService: WasabiService,
    private router: Router) {}

  private demoChart: am4charts.XYChart;
  private columnChart: am4charts.XYChart;

  searchText: string;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.wasabiService.getSearchWithAutoCompletion(term).pipe(
          catchError(() => {
            return of([]);
          }))
      ))

  formatter = (result: Artist) => result.name;

  ngAfterViewInit() {
  this.zone.runOutsideAngular(() => {
        this.initColumnChart('column-chart');
        this.initDemoChart('demo-chart');
  });
  }

  initDemoChart(divName: string) {
    this.demoChart = am4core.create(divName, am4charts.XYChart);

    this.demoChart.paddingRight = 20;

    const data = [];
    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
    }

    this.demoChart.data = data;

    const dateAxis = this.demoChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = this.demoChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = this.demoChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    series.tooltipText = '{valueY.value}';
    this.demoChart.cursor = new am4charts.XYCursor();

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.demoChart.scrollbarX = scrollbarX;
  }

  initColumnChart(divName: string) {
    this.columnChart = am4core.create(divName, am4charts.XYChart);
    // this.drawColumnChart();

    this.wasabiService.getArtistsWithMostAlbums().subscribe(data => {
      this.drawColumnChart(data);
    });
  }

  drawColumnChart(data: Array<any> = []) {
    // this.columnChart.dispose();
    this.columnChart.data = [];

    data.forEach(artist => {
      this.columnChart.data.push({
        name: artist.name,
        points: artist.sum,
        color: this.columnChart.colors.next(),
        bullet: this.getRandomFace()
      });
    });

    const categoryAxis = this.columnChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
    categoryAxis.renderer.labels.template.fontSize = 20;

    const valueAxis = this.columnChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = '4,4';
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    this.columnChart.maskBullets = false;

    this.columnChart.paddingBottom = 0;

    const series = this.columnChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'points';
    series.dataFields.categoryX = 'name';
    series.columns.template.propertyFields.fill = 'color';
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/b]';

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

  getRandomFace() {
    const characters = 'ABCDEFGHIJKLMNO';
    const numbers = '12345';

    const randomLetter = characters.charAt(Math.floor(Math.random() * characters.length));
    const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));

    return 'https://www.amcharts.com/lib/images/faces/' + randomLetter + '0' + randomNumber + '.png';
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.demoChart) {
        this.demoChart.dispose();
      }
      if (this.columnChart) {
        this.columnChart.dispose();
      }
    });
  }

  onSelectSearch(item) {
    console.log(item);
    this.router.navigate(['/artist', item.name]);

  }

}
