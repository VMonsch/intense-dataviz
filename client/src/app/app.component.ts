import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { WasabiService } from './service/wasabi.service';
import { AmchartsService } from './service/amcharts.service';
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
  constructor() {}

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }
}
