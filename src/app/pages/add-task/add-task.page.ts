import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddTaskPage implements OnInit {

  newTask: Task = {
    title: '',
    type: 'General',
    icon: 'list-outline',
    locationName: '',
    duedate: new Date(),
    userNotes: '',
    microsteps: []
  };

  categories = [
    { name: 'Refill', icon: 'color-fill-outline' },
    { name: 'Bills', icon: 'cash-outline' },
    { name: 'Meetings', icon: 'people-outline' },
    { name: 'Shopping', icon: 'cart-outline' },
    { name: 'Meds', icon: 'medkit-outline' },
    { name: 'Chore', icon: 'home-outline' }
  ];

  constructor() { }

  ngOnInit() {
  }

selectCategory(cat: any) {
    this.newTask.type = cat.name;
    this.newTask.icon = cat.icon;
  }

  startVoiceRecognition() {
    // We can implement Web Speech API here later!
    console.log("Listening...");
  }

  saveTask() {
    console.log("Saving to Firebase/Local...", this.newTask);
    // Logic to push to array and navigate back
  }
}


