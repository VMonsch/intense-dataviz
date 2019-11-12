import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {share} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient, private firebaseService: FirebaseService) {}
  private root = 'https://wasabi.i3s.unice.fr';
  private apiRoute = '/api/v1';
  cacheMap = new Map();

  /**
   * Methode permettant de faire une autocompletion lorsqu'on recherche le nom d'un artiste ou d'un album
   * @param searchText : artiste ou album
   */
  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + '/search/fulltext/' + searchText;
    return this.executeQuery(url);
  }

  getArtistsWithMostAlbums(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/count/album' + '?limit=' + count + '&skip=' + skip;

    if (!this.cacheMap.has(url)) {
      const data = this.executeQuery(url);
      this.cacheMap.set(url, data);
      return data;
    }
    return this.cacheMap.get(url);
  }

  getArtistByName(artistName: string): Observable<any> {
    const url = this.root + this.apiRoute + '/artist_all/name/' + artistName;
    return this.executeQuery(url);
  }

  getArtistsWithMostBands(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/member/count/band' + '?limit=' + count + '&skip=' + skip;
    return this.executeQuery(url);
  }

  private serializeQuery(url: string, data: any) {
    const timestamp = new Date().getTime();
    return this.firebaseService.createQuery({url, timestamp, data});
  }

  private executeQuery(url: string): Observable<any> {
    if (!this.cacheMap.has(url)) {
      const observableResponse = this.http.get(url).pipe(share());
      observableResponse.subscribe(data => {
        this.serializeQuery(url, data);
      });
      this.cacheMap.set(url, observableResponse);
    }
    return this.cacheMap.get(url);
  }

  getAlbumDetails(artist: string, album: string) {
    const url = this.root + '/search/artist/' + artist + '/album/' + album ;
    return this.executeQuery(url);
  }

  getSongDetails(idSong: string) {
    const url = this.root + this.apiRoute + '/song/id/' + idSong;
    return this.executeQuery(url);
  }
}
