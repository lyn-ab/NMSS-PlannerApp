import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';                          // NEW
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../../services/accessibility';

import { app } from '../../firebase.config';                       // NEW
import { getAuth, signOut } from 'firebase/auth';                  // NEW

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {

  // ── Everything below this line is your teammate's code, untouched ──────────

  progressValue = 0.4;
  affirmation = "You're doing great! Just one step at a time.";

  tasks = [
    {
      title: 'Weekly Sync',
      type: 'Meeting',
      icon: 'videocam',
      locationName: 'Google Meet',
      link: 'https://meet.google.com/xyz'
    },
    {
      title: 'Pharmacy Pickup',
      type: 'Refill',
      icon: 'medkit',
      locationName: 'Life Pharmacy',
      link: 'https://maps.google.com'
    }
  ];

  constructor(
    private accessibility: AccessibilityService,
    private toastController: ToastController,
    private router: Router                                         // NEW — added here
  ) {}

  ngOnInit() {}

  async skipTask(task: any) {
    console.log('Skipping: ' + task.title);
    const toast = await this.toastController.create({
      message: `Task '${task.title}' skipped. Taking a break is okay!`,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-skip-toast',
      buttons: [{ text: 'Dismiss', role: 'cancel' }]
    });
    await toast.present();
  }

  playGreeting() {
    this.accessibility.speak('Hello! How are you feeling today?', 'en-US');
  }

  openSymptomLogger() {
    console.log('Navigate to logging page');
  }

  generateSteps(task: any) {
    console.log('Generating steps for:', task.title);
  }
  goTo(path: string) {
    this.router.navigateByUrl(path);
  }
  openLink(url: string) {
    if (url) {
      window.open(url, '_system');
    } else {
      console.error('No link provided for this task');
    }
  }

  // ── NEW: logout — signs out of Firebase and returns to login ───────────────
  async logout() {
    const auth = getAuth(app);
    await signOut(auth);
    this.router.navigateByUrl('/login');
  }
}