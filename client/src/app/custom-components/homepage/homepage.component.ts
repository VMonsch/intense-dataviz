import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {AmchartsService} from '../../service/amcharts.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {Observable} from 'rxjs';

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
    public wasabiService: WasabiService,
    private amChartsService: AmchartsService) {}

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.wasabiService.getArtistsWithMostAlbums().subscribe(data => {
      this.artistsWithMostAlbums = data;
    });

    this.wasabiService.getArtistsWithMostBands().subscribe(data => {
      this.artistsWithMostBands = data;
    });
  }
}
