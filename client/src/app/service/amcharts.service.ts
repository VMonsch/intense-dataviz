import {Injectable, OnChanges, SimpleChanges} from '@angular/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

@Injectable({
  providedIn: 'root'
})

export class AmchartsService {

  constructor() { }

  drawColumnChart(columnChart: am4charts.XYChart, data: Array<any> = []) {
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


  drawDonutChartArtistKind(donutChart: am4charts.PieChart, data: Array<any> = []) {

    const pieSeries = donutChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'count';
    pieSeries.dataFields.category = 'genre';

// Let's cut a hole in our Pie chart the size of 30% the radius
    donutChart.innerRadius = am4core.percent(30);

    pieSeries.labels.template.disabled = true;
// Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
      {
        property: 'cursor',
        value: 'pointer'
      }
    ];

    pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter());
    shadow.opacity = 0;

// Create hover state
    const hoverState = pieSeries.slices.template.states.getKey('hover'); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter());
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    donutChart.data = [];
    data.forEach(album => {
      if (album.genre === '') {  album.genre = 'N/A'; }
      if (donutChart.data.some(e => e.genre === album.genre)) {
          donutChart.data.find(e2 => e2.genre === album.genre).count += 1;
        } else {
          donutChart.data.push({genre: album.genre, count: 1});
        }
      });


    donutChart.legend = new am4charts.Legend();
    donutChart.legend.position = 'right';
  }

  drawDurationInBrand(chart: am4charts.XYChart, data: Array<any> = []) {
    data.forEach(e => {
      if (e.end === '') {
        e.end = new Date().getFullYear();
      } else {
        e.end = e.end.substring(0, 4);
      }
      e.begin = e.begin.substring(0, 4);
    });
    chart.data = data;
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.axisFills.template.disabled = true;
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.inversed = true;
    // categoryAxis.renderer.grid.template.strokeDasharray = '1,3';

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = 'name';
    series.dataFields.openValueX = 'begin';
    series.dataFields.valueX = 'end';
    series.tooltipText = 'Debut: {openValueX.value} Fin: {valueX.value}';
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.columns.template.height = 0.01;
    series.tooltip.pointerOrientation = 'vertical';

    const openBullet = series.bullets.create(am4charts.CircleBullet);
    // openBullet.locationX = 1;
    // @ts-ignore
    openBullet.locationX = 1;

    const closeBullet = series.bullets.create(am4charts.CircleBullet);
    closeBullet.fill = chart.colors.getIndex(4);
    closeBullet.stroke = closeBullet.fill;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'zoomY';
  }

  drawStackedArtistContribution(chart: am4charts.XYChart, data: any[], listOfArtist: any[]) {

    chart.data = data;
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'title';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 285;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;


    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    listOfArtist.forEach(e => {
      // Set up series
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.name = e;
      series.dataFields.valueY = e;
      series.dataFields.categoryX = 'title';
      series.sequencedInterpolation = true;

      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = '[bold]{name}[/]\n[font-size:14px] Contribution : {valueY}';

      // Add label
      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = '{valueY}';
      labelBullet.locationY = 0.5;
    });

// Legend
    chart.legend = new am4charts.Legend();

  }

}
