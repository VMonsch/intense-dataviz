import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WasabiService} from '../../service/wasabi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Subject} from 'rxjs';
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
  clickEventLecture: Subject<any> = new Subject();
  isLecture = false;
  pageSize = 5;
  nbSongs = 0;
  currentPage = 1;
  songListDisplayed = [];

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
      this.nbSongs = this.albumDetails.songs.length;
/*
      this.albumDetails.songs.forEach(e => {
        this.songsUrls.push(this.wasabiService.getSongDetails(e._id));
      });
*/

      for (let start = 0 ; start < this.pageSize * this.currentPage; start++) {
        this.songsUrls.push(this.wasabiService.getSongDetails(this.albumDetails.songs[start]._id));
      }

      forkJoin(this.songsUrls).subscribe(respList => {
        this.songListDisplayed = respList;
      });
    });

    this.ngxService.stop();
  }

  eventChildOnChangePage(event): void {
    if (this.currentPage + event > 0 && Math.ceil(this.albumDetails.songs.length / this.pageSize) >= this.currentPage + event) {
      this.currentPage = this.currentPage + event;
      this.songsUrls = [];
      for (let start = (this.pageSize * this.currentPage) - this.pageSize;
           start < this.pageSize * this.currentPage && start < this.albumDetails.songs.length;
           start++) {
        this.songsUrls.push(this.wasabiService.getSongDetails(this.albumDetails.songs[start]._id));

      }
      forkJoin(this.songsUrls).subscribe(respList => {
        this.songListDisplayed = respList;
      });
    }
  }

  // feature play-all
  onNotifyChild() {
    this.isLecture = !this.isLecture;
    this.clickEventLecture.next(this.isLecture );
  }
  // feature play-all
  eventPlaySong(event): void {
    this.isLecture = event;
    if (event) {
        document.querySelectorAll('.bar').forEach(e => {
          e.classList.remove('noAnim');
        });
      } else {
        document.querySelectorAll('.bar').forEach(e => {
          e.classList.add('noAnim');
        });
      }
  }
}
