import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {Observable} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, AfterViewInit {

  artistsWithMostAlbums: Array<any>;
  artistsWithMostBands: Array<any>;

  constructor(
    private zone: NgZone,
    private titleService: Title,
    public wasabiService: WasabiService,
    private amChartsService: AmchartsService) {}

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.titleService.setTitle(environment.appName + ' - ' + 'Music data visualization based on Wasabi');

    this.wasabiService.getArtistsWithMostAlbums().subscribe(data => {
      this.artistsWithMostAlbums = data;
    });

    this.wasabiService.getArtistsWithMostBands().subscribe(data => {
      this.artistsWithMostBands = data;
    });
  }
}
