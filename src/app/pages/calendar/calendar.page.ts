import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  imports: [IonicModule],
})
export class CalendarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
