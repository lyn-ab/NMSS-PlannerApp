import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";

interface Task {
  title: string;
  type: string;
  icon: string;
  locationName: string;
  duedate: Date;
  userNotes?: string;
  showMicrosteps?: boolean;
  microsteps?: string[];
  isGenerating?: boolean;
}

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
