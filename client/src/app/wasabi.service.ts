import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WasabiService {

  constructor(private http: HttpClient) {}

  private url = 'https://my-json-server.typicode.com/micbuffa/hobbies/db';


  getHobbies(): Promise<any> {

    // on va chercher par GET le fichier JSON sur un REST endpoint

    return this.http.get(this.url)
      .toPromise();

  }
}
