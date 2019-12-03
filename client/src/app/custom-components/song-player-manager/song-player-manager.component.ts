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
  songs;
  @Input()
  clickEventSubject: Subject<any>;
  @Output()
  eventEmitterPlaySong = new EventEmitter();

  ngOnInit() {
    this.clickEventSubject.subscribe(isPlay => {
      if (isPlay) {
        const index = 0;
        this.playAll(index);
      } else {
        this.stopAll(null);
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
        this.stopAll(event.target.childNodes[1].id);
        this.eventEmitterPlaySong.emit(true);
      });
      plyr.on('pause', event => {
        this.eventEmitterPlaySong.emit(false);
      });
    }
   }
  ngAfterViewInit(): void {

  }

   playAll(index): void {
    const currentSong = document.getElementById('songPlyr' + index);
    this.stopAll(null);
    currentSong.play();
    currentSong.onended = () => {
      if (this.songs.length > index) {
        index++;
        this.playAll(index);
      }
      return 0;
    };
  }

  stopAll(exceptIndex): void {
    for (let i = 0; i < this.songs.length; i++) {
      if (exceptIndex == null || 'songPlyr' + i !== exceptIndex) {
        const sound = document.getElementById('songPlyr' + i);
        sound.pause();
        sound.currentTime = 0;
      }
    }
  }


}





