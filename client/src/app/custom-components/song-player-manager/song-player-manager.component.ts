import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {Subject} from 'rxjs';
const Plyr = require('plyr');

@Component({
  selector: 'app-song-player-manager',
  templateUrl: './song-player-manager.component.html',
  styleUrls: ['./song-player-manager.component.css']
})
export class SongPlayerManagerComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked {


  constructor() { }
  @Input()
  currentPage;
  @Input()
  songs;
  @Input()
  clickEventSubject: Subject<any>;
  @Output()
  eventEmitterPlaySong = new EventEmitter();
  @Output()
  eventEmitterChangePage = new EventEmitter();
  private PLAYER_SUFFIX_ID = 'songPlyr';
  private currentPlayerID: HTMLMediaElement;
  private isPlayAll = false;

  ngOnInit() {
    this.clickEventSubject.subscribe(isPlay => {
      this.isPlayAll = isPlay;
      if (isPlay) {
        const index = 0;
        this.playAll(index);
      } else {
        this.stopCurrentSong(null, true);
      }

    });
  }
  ngAfterContentInit(): void {
  }

  ngAfterViewChecked(): void {
    for (const [i, value] of this.songs.entries()) {
      const id = '#songPlyr' + i;
      const plyr = new Plyr(id, {captions: {active: true}});
      document.querySelector(id + '> source' ).setAttribute('src', value.preview);
      plyr.on('play', event => {
        if (!this.isPlayAll) {
          this.isPlayAll = false;
          this.stopCurrentSong(plyr.media, false);
          this.currentPlayerID = plyr.media;
          this.eventEmitterPlaySong.emit(true);
        }
      });
      plyr.on('pause', event => {
          if (!this.isPlayAll) {
            this.eventEmitterPlaySong.emit(plyr.media !== this.currentPlayerID);
          }
      });
      plyr.on('ended', event => {
        if (!this.isPlayAll) {
         this.stopCurrentSong(null, true);
        }
      });
    }
   }
  ngAfterViewInit(): void {

  }

  // feature play-all
   playAll(index): void {
    this.isPlayAll = true;
    this.currentPlayerID = document.getElementById(this.PLAYER_SUFFIX_ID + index) as HTMLMediaElement;
    this.currentPlayerID.play();
    this.currentPlayerID.onended = () => {
      if (this.songs.length > index && this.isPlayAll) {
        this.currentPlayerID.pause();
        this.currentPlayerID.currentTime = 0;
        index++;
        this.playAll(index);
      }
      return 0;
    };
  }

  stopCurrentSong(idPlayerClicked, forceStop): void {
    if (forceStop || this.currentPlayerID !== undefined && idPlayerClicked !== null && this.currentPlayerID !== idPlayerClicked) {
      this.currentPlayerID.pause();
      this.currentPlayerID.currentTime = 0;
      this.currentPlayerID = undefined;
    }
  }

  animeAudioBar(): void {

  }

  onNextPage(): void {
    this.eventEmitterChangePage.emit(1);
  }

  onPrevPage(): void {
    this.eventEmitterChangePage.emit(-1);
  }

}





