import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient) {}
  private root = 'https://wasabi.i3s.unice.fr/';

  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + 'search/fulltext/' + searchText;
    return this.http.get(url);
  }
}
