import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
provideFirebaseApp(() => initializeApp({
  projectId: "nmss-plannerapp",
  appId: "1:649323939819:web:089ca9f15389a2c6457bae",
  storageBucket: "nmss-plannerapp.firebasestorage.app",
  apiKey: "AIzaSyDyB009jq0hAYhAxRIOUXCWi22j1HTnrdQ",
  authDomain: "nmss-plannerapp.firebaseapp.com",
  messagingSenderId: "649323939819"
})), provideAuth(() => getAuth())],
  bootstrap: [AppComponent],
})
export class AppModule {}
