import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {Router} from '@angular/router';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ArtistModel} from '../../model/ArtistModel';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})

export class ArtistComponent implements OnInit, AfterViewInit {

  artist = new ArtistModel();
  donutOfAlbumGenre: am4charts.PieChart;
  dumbellPlotDurationLife: am4charts.XYChart;
  artistContribution: am4charts.XYChart;
  chartsrender = {
    donut: false,
    dumbell: false,
    stacked: false
  };

  constructor(private wasabiService: WasabiService,
              private amChartsService: AmchartsService,
              private ngxService: NgxUiLoaderService,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(routeParameters => this.artist.name = routeParameters.artistName);
  }

  ngAfterViewInit() {
    if (!this.chartsrender.donut && this.artist.albums !== undefined) {
      this.initDonutChart('kind-of-albums');
      this.chartsrender.donut = true;
    }
    if (!this.chartsrender.dumbell && this.artist.members !== undefined) {
      this.initDumbellPlotChart('dumbell-plot-for-life-duration-brand');
      this.chartsrender.dumbell = true;
    }
    if (!this.chartsrender.stacked && this.artist.albums !== undefined) {
      this.initStackedChart('stacked-artist-contribution');
      this.chartsrender.stacked = true;
    }
  }

  ngOnInit() {
    this.ngxService.start();

    this.wasabiService.getArtistByName(this.artist.name).subscribe(data => {
      this.artist.albums = data.albums;
      this.artist.picture = data.picture.xl;
      this.artist.collectionSize = data.albums.length;
      this.artist.members = data.members;
      this.artist.moreInfo = data.urlWikipedia;
      if (document.getElementById('kind-of-albums') !== null) {
        this.initDonutChart( 'kind-of-albums');
        this.chartsrender.donut = true;
      }
      if (document.getElementById('dumbell-plot-for-life-duration-brand') !== null) {
        this.initDumbellPlotChart( 'dumbell-plot-for-life-duration-brand');
        this.chartsrender.dumbell = true;

      }
      if (document.getElementById('stacked-artist-contribution') !== null) {
        this.initStackedChart('stacked-artist-contribution');
        this.chartsrender.stacked = true;
      }
      this.ngxService.stop();
    });
  }

  initDonutChart( divName: string) {
    this.donutOfAlbumGenre = am4core.create(divName, am4charts.PieChart);
    this.amChartsService.drawDonutChartArtistKind(this.donutOfAlbumGenre, this.artist.albums);
  }

  initDumbellPlotChart( divName: string) {
    this.dumbellPlotDurationLife = am4core.create(divName, am4charts.XYChart);
    this.amChartsService.drawDurationInBrand(this.dumbellPlotDurationLife, this.artist.members);
  }

  initStackedChart(divName: string) {
    this.artistContribution = am4core.create(divName, am4charts.XYChart);
    const data = [];
    const listOfArtist = [];
    this.artist.albums.forEach(a => {
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
    this.amChartsService.drawStackedArtistContribution(this.artistContribution, data, listOfArtist);
  }

  onClickAlbum(album) {
    this.router.navigate(['/artist', album.name, 'album', album.title]);
  }
}
