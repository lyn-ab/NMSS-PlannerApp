import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { AlertController } from '@ionic/angular';
import { IONIC_ICONS } from '../../../assets/data/icon';
import { Firebase } from 'src/app/services/firebase';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { SECRET_KEYS } from 'src/environments/config-api';
import { Persistence } from 'src/app/services/persistence';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddTaskPage implements OnInit {
  isEditingCustom = false;
  allIcons = IONIC_ICONS;
  filteredIcons = [...IONIC_ICONS];

  minDate: string = new Date().toISOString();

  db: any;

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

  constructor(private navCtrl: NavController,
    private alertCtrl: AlertController,
    private firebase: Firebase,
    private toastController: ToastController,
    private persistence: Persistence)
    {}

  ngOnInit() {
  }

  startVoiceRecognition() {
    // We can implement Web Speech API here later!
    console.log("Listening...");
  }

  async saveTask() {
  if (!this.newTask.title.trim()) {
    const alert = await this.alertCtrl.create({
      header: 'Missing Title',
      message: 'Please name your task before saving.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  try {
    const key = this.firebase.pushToList('tasks', this.newTask);
    console.log("Task fully saved to Firebase:", key);

    this.persistence.add({...this.newTask, s: key}, 'local'); // Add to local list with the same key for consistency  

    const toast = await this.toastController.create({
      message: 'Task scheduled successfully!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();
    this.navCtrl.back(); // Go home
  } catch (error) {
    console.error("Save failed:", error);
  }
}

  filterIcons(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredIcons = this.allIcons.filter(icon =>
      icon.name.toLowerCase().includes(query)
    );
  }

  startCustomEdit() {
    this.isEditingCustom = true;
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


