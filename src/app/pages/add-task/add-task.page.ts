import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  imports: [IonicModule],
})
export class AddTaskPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
