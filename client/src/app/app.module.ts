import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { WasabiService } from './service/wasabi.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from './custom-components/artist/artist.component';
import { NavBarComponent } from './custom-components/nav-bar/nav-bar.component';
import { HomepageComponent } from './custom-components/homepage/homepage.component';
import { AlbumComponent } from './custom-components/album/album.component';
import { ColumnChartComponent } from './custom-components/charts/column-chart/column-chart.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { environment } from '../environments/environment';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.rectangleBounceParty, // foreground spinner type
  fgsColor: 'lightgreen',
  text: 'Wasabi',
  hasProgressBar: false,
};

@NgModule({
  declarations: [
    AppComponent,
    ArtistComponent,
    NavBarComponent,
    HomepageComponent,
    AlbumComponent,
    ColumnChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [WasabiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
