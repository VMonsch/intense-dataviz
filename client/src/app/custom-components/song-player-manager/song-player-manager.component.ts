import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
const Plyr = require('plyr');

@Component({
  selector: 'app-song-player-manager',
  templateUrl: './song-player-manager.component.html',
  styleUrls: ['./song-player-manager.component.css']
})
export class SongPlayerManagerComponent implements OnInit, AfterViewInit {

  constructor() { }
  @Input()
  songs;

  ngOnInit() {
  }
  // ngAfterViewChecked()
  ngAfterViewInit(): void {
    for (const [i, value] of this.songs.entries()) {
      const plyr = new Plyr('#songPlyr' + i + ' ', {captions: {active: true}});
    }
  }

}





