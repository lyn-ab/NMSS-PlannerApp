import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { AlertController } from '@ionic/angular';
import { IONIC_ICONS } from '../../../assets/data/icon';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddTaskPage implements OnInit {
  isEditingCustom = false;
  allIcons = IONIC_ICONS;
  filteredIcons = [...IONIC_ICONS];

  minDate: string = new Date().toISOString();

  newTask: Task = {
    title: '',
    type: 'General',
    icon: 'list-outline',
    locationName: '',
    duedate: new Date().toISOString() as any,
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

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  startVoiceRecognition() {
    // We can implement Web Speech API here later!
    console.log("Listening...");
  }

  async saveTask() {
    
    console.log("Saving to Firebase/Local...", this.newTask);
    // Logic to push to array and navigate back
  }

  filterIcons(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredIcons = this.allIcons.filter(icon =>
      icon.name.toLowerCase().includes(query)
    );
  }

  startCustomEdit() {
    this.isEditingCustom = true;
    // If starting fresh, set a default icon
    if (!this.isCustomCategorySelected()) {
      this.newTask.icon = 'apps-outline';
      this.newTask.type = '';
    }
  }

  selectCategory(cat: any) {
    this.newTask.type = cat.name;
    this.newTask.icon = cat.icon;
    this.isEditingCustom = false; // Hide the setup card if a preset is picked
  }

  selectCustomIcon(icon: any, modal: any) {
    this.newTask.icon = icon.value;
    modal.dismiss();
  }

  isCustomCategorySelected() {
    return this.newTask.type !== '' && !this.categories.some(cat => cat.name === this.newTask.type);
  }

  toggleCustomEdit() {
    this.isEditingCustom = !this.isEditingCustom;
    // Set some defaults if they are opening it for the first time
    if (this.isEditingCustom && !this.isCustomCategorySelected()) {
      this.newTask.type = '';
      this.newTask.icon = 'help-circle-outline';
    }
  }
}


