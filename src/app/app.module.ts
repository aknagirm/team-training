import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexComponent } from './flex/flex.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AppComponent, FlexComponent, RxjsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    NgbModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
