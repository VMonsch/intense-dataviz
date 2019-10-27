import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient) {}
  private root = 'https://wasabi.i3s.unice.fr';
  private apiRoute = '/api/v1';

  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + '/search/fulltext/' + searchText;
    return this.http.get(url);
  }

  getArtistsWithMostAlbums(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/count/album' + '?limit=' + count + '&skip=' + skip;
    return this.http.get(url);
  }

  getArtistsWithMostBands(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/member/count/band' + '?limit=' + count + '&skip=' + skip;
    return this.http.get(url);
  }
}
