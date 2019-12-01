import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, AfterViewInit {
  private albumDetails;
  private artistName;
  private albumName;
  private songsUrls = [];

  constructor(private wasabiService: WasabiService,
              private ngxService: NgxUiLoaderService,
              private router: Router) { }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.ngxService.start();

    this.artistName = this.router.url.split('/')[2];
    this.albumName = this.router.url.split('/')[4];
    this.wasabiService.getAlbumDetails(this.artistName, this.albumName).subscribe(data => {

      this.albumDetails = data.albums;

      this.albumDetails.songs.forEach(e => {
        this.songsUrls.push(this.wasabiService.getSongDetails(e._id));
      });

      forkJoin(this.songsUrls).subscribe(respList => {
        this.albumDetails.songs = respList;
       // console.log(respList);
      });
    });
    this.ngxService.stop();
  }
}
