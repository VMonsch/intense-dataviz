import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4wordCloud from '@amcharts/amcharts4/plugins/wordCloud';
import * as am4timeline from '@amcharts/amcharts4/plugins/timeline';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ArtistModel} from '../../model/ArtistModel';
import {forkJoin, Observable} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})

export class ComparisonComponent implements OnInit, AfterViewInit {

  firstArtist = new ArtistModel();
  secondArtist = new ArtistModel();
  wordCloud: am4wordCloud.WordCloud;
  timelineComparator: am4timeline.CurveChart;
  gradientGauge: am4charts.GaugeChart;
  chartsrender = {
    wordCloud: false,
    gradientGauge: false,
    timelineComparator: false
  };

  constructor(private wasabiService: WasabiService,
              private amChartsService: AmchartsService,
              private ngxService: NgxUiLoaderService,
              private titleService: Title,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(routeParameters => {
      this.firstArtist.name = routeParameters.firstArtistName;
      this.secondArtist.name = routeParameters.secondArtistName;
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.firstArtist.name + ' VS ' + this.secondArtist.name + ' - ' + environment.appName);

    this.ngxService.start();

    forkJoin(
      this.fetchArtist(this.firstArtist),
      this.fetchArtist(this.secondArtist)
    ).subscribe(completion => {
      if (document.getElementById('word-cloud') !== undefined) {
        this.initWordCloud( 'word-cloud');
        this.chartsrender.wordCloud = true;
      }
      if (document.getElementById('deezer-fans-counter') !== undefined) {
        this.initDeezerFansGauge('deezer-fans-counter');
        this.chartsrender.gradientGauge = true;
      }
      if (document.getElementById('timeline-comparator') !== undefined) {
        this.initTimelineComparator( 'timeline-comparator');
        this.chartsrender.wordCloud = true;
      }
      this.ngxService.stop();
    });
  }

  ngAfterViewInit() {
    if (this.firstArtist !== undefined && this.secondArtist !== undefined) {
      if (!this.chartsrender.wordCloud) {
        this.initWordCloud('word-cloud');
        this.chartsrender.wordCloud = true;
      }
      if (!this.chartsrender.gradientGauge) {
        this.initDeezerFansGauge('deezer-fans-counter');
        this.chartsrender.gradientGauge = true;
      }
      if (!this.chartsrender.timelineComparator) {
        this.initTimelineComparator( 'timeline-comparator');
        this.chartsrender.wordCloud = true;
      }
    }
  }

  fetchArtist(artist: ArtistModel): Observable<any> {
    const observable = this.wasabiService.getArtistByName(artist.name);

    observable.subscribe(data => {
      artist.albums = data.albums;
      artist.picture = data.picture.xl;
      artist.collectionSize = data.albums.length;
      artist.members = data.members;
      artist.moreInfo = data.urlWikipedia;
      artist.deezerFans = data.deezerFans;
    });

    return observable;
  }

  onClickAlbum(album) {
    this.router.navigate(['/artist', album.name, 'album', album.title]);
  }

  initWordCloud(divName: string) {
    this.wordCloud = am4core.create(divName, am4wordCloud.WordCloud);

    this.amChartsService.drawWordCloud(this.wordCloud, this.getWords());
  }

  initDeezerFansGauge(divName: string) {
    this.gradientGauge = am4core.create(divName, am4charts.GaugeChart);
    this.amChartsService.drawDoubleGauge(this.gradientGauge, this.firstArtist.name, this.firstArtist.deezerFans, this.secondArtist.name, this.secondArtist.deezerFans);
  }

  initTimelineComparator(divName: string) {
      this.timelineComparator = am4core.create(divName, am4timeline.CurveChart);
      this.amChartsService.drawTimeLineComparator(this.timelineComparator, this.firstArtist, this.secondArtist);
  }


  private getWords(): string {
    let words = '';

    words = words.concat(this.getWordsForArtist(this.firstArtist));
    words = words.concat(this.getWordsForArtist(this.secondArtist));

    return words;
  }

  private getWordsForArtist(artist: ArtistModel): string {
    let words = '';

    words = words.concat(' ', artist.name);

    artist.members.forEach(member => words.concat(' ', member.name));

    artist.albums.forEach(album => {
      words = words.concat(' ', album.name);
      words = words.concat(' ', album.title);
      words = words.concat(' ', album.genre);
    });

    return words;
  }
}
