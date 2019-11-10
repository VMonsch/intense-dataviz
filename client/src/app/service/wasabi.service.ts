import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {FirebaseService} from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient, private firebaseService: FirebaseService) {}
  private root = 'https://wasabi.i3s.unice.fr';
  private apiRoute = '/api/v1';
  private cache = {
    artistsWithMostAlbums: undefined,
    artistsWithMostBands: undefined
  };

  /**
   * Methode permettant de faire une autocompletion lorsqu'on recherche le nom d'un artiste ou d'un album
   * @param searchText : artiste ou album
   */
  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + '/search/fulltext/' + searchText;
    return this.executeQuery(url);
  }

  getArtistsWithMostAlbums(count: number = 5, skip: number = 0): Observable<any> {
    if (this.cache.artistsWithMostAlbums === undefined) {
      const url = this.root + this.apiRoute + '/artist/count/album' + '?limit=' + count + '&skip=' + skip;
      this.cache.artistsWithMostAlbums = this.executeQuery(url);
    }

    return this.cache.artistsWithMostAlbums;
  }

  getArtistByName(artistName: string): Observable<any> {
    const url = this.root + this.apiRoute + '/artist_all/name/' + artistName;
    return this.executeQuery(url);
  }

  getArtistsWithMostBands(count: number = 5, skip: number = 0): Observable<any> {
    if (this.cache.artistsWithMostBands === undefined) {
      const url = this.root + this.apiRoute + '/artist/member/count/band' + '?limit=' + count + '&skip=' + skip;
      this.cache.artistsWithMostBands = this.executeQuery(url);
    }

    return this.cache.artistsWithMostBands;
  }

  private serializeQuery(url: string, data: any) {
    const timestamp = new Date().getTime();
    return this.firebaseService.createQuery({url, timestamp, data});
  }

  private executeQuery(url: string): Observable<any> {
    const observableResponse = this.http.get(url);

    observableResponse.subscribe(data => {
      this.serializeQuery(url, data);
    });

    return observableResponse;
  }
}
