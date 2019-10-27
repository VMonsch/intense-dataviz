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
  data;

  /**
   * Methode permettant de faire une autocompletion lorsqu'on recherche le nom d'un artiste ou d'un album
   * @param searchText : artiste ou album
   */
  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + '/search/fulltext/' + searchText;
    return this.http.get(url);
  }

  getArtistsWithMostAlbums(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/count/album' + '?limit=' + count + '&skip=' + skip;
    return this.http.get(url);
  }

  getArtistByName(artistName: string): Observable<any> {
    const url = this.root + this.apiRoute + '/artist_all/name/' + artistName;
    return this.http.get(url);
  }

  getArtistsWithMostBands(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/member/count/band' + '?limit=' + count + '&skip=' + skip;
    return this.http.get(url);
  }
}
