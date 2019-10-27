import { Injectable } from '@angular/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

@Injectable({
  providedIn: 'root'
})

export class AmchartsService {

  constructor() { }

  drawColumnChart(columnChart: am4charts.XYChart, data: Array<any> = []) {
    // this.columnChart.dispose();
    columnChart.data = [];

    data.forEach(artist => {
      columnChart.data.push({
        name: artist.name || artist.membername,
        points: artist.sum,
        color: columnChart.colors.next(),
        bullet: this.getRandomFace()
      });
    });

    const categoryAxis = columnChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
    categoryAxis.renderer.labels.template.fontSize = 20;

    const valueAxis = columnChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = '4,4';
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    columnChart.maskBullets = false;

    columnChart.paddingBottom = 0;

    const series = columnChart.series.push(new am4charts.ColumnSeries());
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

  drawOscilloChart(oscilloChart: am4charts.XYChart, data: Array<any> = []) {

    oscilloChart.paddingRight = 20;

    oscilloChart.data = [];

    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
    }

    oscilloChart.data = data;

    const dateAxis = oscilloChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = oscilloChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = oscilloChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    series.tooltipText = '{valueY.value}';
    oscilloChart.cursor = new am4charts.XYCursor();

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    oscilloChart.scrollbarX = scrollbarX;
  }

  getRandomFace() {
    const characters = 'ABCDEFGHIJKLMNO';
    const numbers = '12345';

    const randomLetter = characters.charAt(Math.floor(Math.random() * characters.length));
    const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));

    return 'https://www.amcharts.com/lib/images/faces/' + randomLetter + '0' + randomNumber + '.png';
  }
}
