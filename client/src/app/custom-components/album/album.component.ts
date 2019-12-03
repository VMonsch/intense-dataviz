import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
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
              private router: Router,
              private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(routeParameters => {
      this.artistName = routeParameters.artistName;
      this.albumName = routeParameters.albumName;
    });
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
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
