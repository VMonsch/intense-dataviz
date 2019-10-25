import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { HttpClientModule } from '@angular/common/http';
import { WasabiService } from './wasabi.service';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { ArtistComponent } from './artist/artist.component';


@NgModule({
  declarations: [
    AppComponent,
    ArtistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  providers: [WasabiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
