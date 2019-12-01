import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongPlayerManagerComponent } from './song-player-manager.component';

describe('SongPlayerManagerComponent', () => {
  let component: SongPlayerManagerComponent;
  let fixture: ComponentFixture<SongPlayerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongPlayerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongPlayerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
