import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {Router} from '@angular/router';
import * as am4charts from '@amcharts/amcharts4/charts';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Artist} from '../../model/artist';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnDestroy, AfterViewInit {
  constructor(
    private zone: NgZone,
    private wasabiService: WasabiService,
    private router: Router) {}

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

  onSelectSearch(item) {
    console.log(item);
    this.router.navigate(['/artist', item.name]);

  }


}
