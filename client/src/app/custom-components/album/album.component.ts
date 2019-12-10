import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit, AfterViewInit {
  albumDetails;
  artistName;
  albumName;
  songsUrls = [];

  constructor(private wasabiService: WasabiService,
              private ngxService: NgxUiLoaderService,
              private titleService: Title,
              private router: Router,
              private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(routeParameters => {
      this.artistName = routeParameters.artistName;
      this.albumName = routeParameters.albumTitle;
    });
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.titleService.setTitle(this.albumName + ' - ' + this.artistName + ' - ' + environment.appName);
    this.ngxService.start();
    this.wasabiService.getAlbumDetails(this.artistName, this.albumName).subscribe(data => {

      this.albumDetails = data.albums;

      this.albumDetails.songs.forEach(e => {
        this.songsUrls.push(this.wasabiService.getSongDetails(e._id));
      });

      forkJoin(this.songsUrls).subscribe(respList => {
        this.albumDetails.songs = respList;
      });
    });

    this.ngxService.stop();
  }
}
