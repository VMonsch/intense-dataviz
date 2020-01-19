import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {share, publishReplay, refCount, map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient, private firebaseService: FirebaseService) {}
  private root = 'https://wasabi.i3s.unice.fr';
  private apiRoute = '/api/v1';

  /**
   * Methode permettant de faire une autocompletion lorsqu'on recherche le nom d'un artiste ou d'un album
   * @param searchText : artiste ou album
   */
  getSearchWithAutoCompletion(searchText): Observable<any> {
    const url = this.root + '/search/fulltext/' + searchText;
    return this.executeQuery(url, null);
  }

  getArtistsWithMostAlbums(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/count/album' + '?limit=' + count + '&skip=' + skip;
    return this.executeQuery(url, null);
  }

  getArtistByName(artistName: string): Observable<any> {
    const url = this.root + this.apiRoute + '/artist_all/name/' + artistName;
    return this.executeQuery(url, artistName);
  }

  getArtistsWithMostBands(count: number = 5, skip: number = 0): Observable<any> {
    const url = this.root + this.apiRoute + '/artist/member/count/band' + '?limit=' + count + '&skip=' + skip;
    return this.executeQuery(url, null);
  }

  private serializeQuery(url: string, data: any) {
    const timestamp = new Date().getTime();
    return this.firebaseService.createQuery({url, timestamp, data});
  }

  private executeQuery(url: string, key: string): Observable<any> {
    let observableResponse;
    if (key != null && localStorage.getItem(key) !== null ) {
      observableResponse = of(JSON.parse(localStorage.getItem(key)));
    } else {
      observableResponse =  this.http.get(url).pipe(
        share(),
        publishReplay(1),
        refCount()
      );
    }

    observableResponse.subscribe(data => {
      let count = 0;
      let succes = false;
      while(count < 3 || !succes) {
        count++;
        try {
          if (key != null && localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(data));
          } else if (key != null) {
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify(data));
          }
          succes = true;
        } catch (e) {
          console.log('Local Storage is full, Please empty data');
          localStorage.clear();
        }
      }
      this.serializeQuery(url, data);
    });

    return observableResponse;


  }

  getAlbumDetails(artist: string, album: string) {
    const url = this.root + '/search/artist/' + artist + '/album/' + album ;
    return this.executeQuery(url, artist + album);
  }

  getSongDetails(idSong: string) {
    const url = this.root + this.apiRoute + '/song/id/' + idSong;
    return this.executeQuery(url, idSong);
  }

}
