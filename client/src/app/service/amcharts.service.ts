import {Injectable, OnChanges, SimpleChanges} from '@angular/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4wordCloud from '@amcharts/amcharts4/plugins/wordCloud';
import * as am4timeline from '@amcharts/amcharts4/plugins/timeline';
import * as am4bullet from '@amcharts/amcharts4/plugins/bullets';
import {ArtistModel} from '../model/ArtistModel';

@Injectable({
  providedIn: 'root'
})

export class AmchartsService {

  constructor() {
  }

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
      data.push({date: new Date(2018, 0, i), name: 'name' + i, value: visits});
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
      if (album.genre === '') {
        album.genre = 'N/A';
      }
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


  drawWordCloud(wordCloud: am4wordCloud.WordCloud, words: string) {
    const series = wordCloud.series.push(new am4wordCloud.WordCloudSeries());

    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.tooltipText = '{word}: {value}';
    series.fontFamily = 'Courier New';
    series.minFontSize = am4core.percent(10);
    series.maxFontSize = am4core.percent(30);

    series.text = words;
  }


  drawTimeLineComparator(chart: am4timeline.CurveChart, firstArtist: ArtistModel, secondArtist: ArtistModel) {

    chart.curveContainer.padding(100, 20, 50, 20);
    chart.maskBullets = false;

    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
    chart.dateFormatter.dateFormat = 'yyyy-MM-dd';

    setTimelineData(chart, firstArtist, secondArtist);

    chart.fontSize = 10;
    chart.tooltipContainer.fontSize = 10;

    // @ts-ignore
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.paddingRight = 25;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.innerRadius = 10;
    categoryAxis.renderer.radius = 30;

    // @ts-ignore
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());


    dateAxis.renderer.points = getPoints();


    dateAxis.renderer.autoScale = true;
    dateAxis.renderer.autoCenter = true;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.baseInterval = {count: 1, timeUnit: 'year'};
    dateAxis.renderer.tooltipLocation = 0;
    dateAxis.renderer.line.strokeDasharray = '1,4';
    dateAxis.renderer.line.strokeOpacity = 0.5;
    dateAxis.tooltip.background.fillOpacity = 0.2;
    dateAxis.tooltip.background.cornerRadius = 5;
    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground');
    dateAxis.tooltip.label.paddingTop = 7;
    dateAxis.endLocation = 0;
    dateAxis.startLocation = -0.5;
    dateAxis.min = new Date(1980, 0, 9, 23, 55).getTime();
    dateAxis.max = new Date(2015, 0, 11, 7, 10).getTime();

    const labelTemplate = dateAxis.renderer.labels.template;
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.fillOpacity = 0.6;
    labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor('background');
    labelTemplate.background.fillOpacity = 1;
    labelTemplate.fill = new am4core.InterfaceColorSet().getFor('text');
    labelTemplate.padding(7, 7, 7, 7);

    const series = chart.series.push(new am4timeline.CurveColumnSeries());
    series.columns.template.height = am4core.percent(30);

    series.dataFields.openDateX = 'start';
    series.dataFields.dateX = 'end';
    series.dataFields.categoryY = 'category';
    series.baseAxis = categoryAxis;
    series.columns.template.propertyFields.fill = 'color'; // get color from data
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.strokeOpacity = 0;
    series.columns.template.fillOpacity = 0.6;

    const imageBullet1 = series.bullets.push(new am4bullet.PinBullet());
    imageBullet1.background.radius = 15;
    imageBullet1.locationX = 1;
    imageBullet1.propertyFields.stroke = 'color';
    imageBullet1.background.propertyFields.fill = 'color';
    imageBullet1.image = new am4core.Image();
    imageBullet1.image.propertyFields.href = 'icon';
    imageBullet1.image.scale = 0.7;
    imageBullet1.circle.radius = am4core.percent(100);
    imageBullet1.background.fillOpacity = 0.8;
    imageBullet1.background.strokeOpacity = 0;
    imageBullet1.dy = -2;
    imageBullet1.background.pointerBaseWidth = 7;
    imageBullet1.background.pointerLength = 7;
    imageBullet1.tooltipText = '{text}';

    series.tooltip.pointerOrientation = 'up';

    imageBullet1.background.adapter.add('pointerAngle', (value, target) => {
      if (target.dataItem) {
        // @ts-ignore
        const position = dateAxis.valueToPosition(target.dataItem.openDateX.getTime());
        return dateAxis.renderer.positionToAngle(position);
      }
      return value;
    });

    const hs = imageBullet1.states.create('hover');
    hs.properties.scale = 1.3;
    hs.properties.opacity = 1;

    const textBullet = series.bullets.push(new am4charts.LabelBullet());
    textBullet.label.propertyFields.text = 'text';
    textBullet.disabled = true;
    textBullet.propertyFields.disabled = 'textDisabled';
    textBullet.label.strokeOpacity = 0;
    textBullet.locationX = 1;
    textBullet.dy = -100;
    textBullet.label.textAlign = 'middle';

    const cursor = new am4timeline.CurveCursor();
    chart.cursor = cursor;
    cursor.xAxis = dateAxis;
    cursor.yAxis = categoryAxis;
    cursor.lineY.disabled = true;
    cursor.lineX.disabled = true;

    dateAxis.renderer.tooltipLocation2 = 0;
    categoryAxis.cursorTooltipEnabled = false;

    chart.zoomOutButton.disabled = true;

    let previousBullet;

    chart.events.on('inited', () => {
      setTimeout(() => {
        hoverItem(series.dataItems.getIndex(0));
      }, 2000);
    });

    function hoverItem(dataItem) {
      const bullet = dataItem.bullets.getKey(imageBullet1.uid);
      let index = dataItem.index;

      if (index >= series.dataItems.length - 1) {
        index = -1;
      }

      if (bullet) {

        if (previousBullet) {
          previousBullet.isHover = false;
        }

        bullet.isHover = true;

        previousBullet = bullet;
      }
      setTimeout(
        () => {
          hoverItem(series.dataItems.getIndex(index + 1));
        }, 1000);
    }

  }
}

function setTimelineData(chart: am4timeline.CurveChart, firstArtist: ArtistModel, secondArtist: ArtistModel) {

  const colorSet = new am4core.ColorSet();
  const firstArtistColor = colorSet.getIndex(7);
  const secondArtistColor = colorSet.getIndex(17);

  chart.data = [];
  console.log(firstArtist);
  firstArtist.albums.forEach(album => {
      const data = {category: null, icon: null, start: null, end: null, color: null, text: ''};
      data.category = '';
      if(album.publicationDate != null ){
        data.start = album.publicationDate;
        data.end = album.publicationDate;
      }
      data.color = firstArtistColor;
      data.text = firstArtist.name + ' - ' + album.title + ' - ' + album.publicationDate ;
      data.icon = firstArtist.picture;
      chart.data.push(data);
    });

  secondArtist.albums.forEach(album => {
      const data = {category: null, icon: null, start: null, end: null, color: null, text: ''};
      data.category = '';
    if(album.publicationDate != null ){
      data.start = album.publicationDate;
      data.end = album.publicationDate;
    }
      data.color = secondArtistColor;
      data.text = secondArtist.name + ' - ' + album.title + ' - ' + album.publicationDate ;
      data.icon = secondArtist.picture;
      chart.data.push(data);
    });

}

function getPoints() {

  const points = [{ x: -1300, y: 200 }, { x: 0, y: 200 }];

  const w = 400;
  const h = 400;
  const levelCount = 4;

  const radius = am4core.math.min(w / (levelCount - 1) / 2, h / 2);
  const startX = radius;

  for (let i = 0; i < 25; i++) {
    const angle = 0 + i / 25 * 90;
    const centerPoint = { y: 200 - radius, x: 0 };
    points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
  }


  for (let i = 0; i < levelCount; i++) {
    let centerPoint;
    if (i % 2 !== 0) {
      points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i });
      points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i });

      centerPoint = { y: h / 2 - radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
      if (i < levelCount - 1) {
        for (let k = 0; k < 50; k++) {
          const angle = -90 + k / 50 * 180;
          points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
        }
      }

      if (i === levelCount - 1) {
        points.pop();
        points.push({ y: -radius, x: startX + w / (levelCount - 1) * i });
        centerPoint = { y: -radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
        for (let k = 0; k < 25; k++) {
          const angle = -90 + k / 25 * 90;
          points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
        }
        points.push({ y: 0, x: 1300 });
      }

    } else {
      points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i });
      points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i });
      centerPoint = { y: -h / 2 + radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
      if (i < levelCount - 1) {
        for (let k = 0; k < 50; k++) {
          const angle = -90 - k / 50 * 180;
          points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
        }
      }
    }
  }

  return points;
}
