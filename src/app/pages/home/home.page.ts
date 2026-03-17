import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../../services/accessibility';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  progressValue = 0.4; // Example: 40% complete
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

  constructor(private accessibility: AccessibilityService) {

   }

  ngOnInit() {
  }


  playGreeting() {
    // Just call the service!
    this.accessibility.speak("Hello! How are you feeling today?", "en-US");
  }

  openSymptomLogger() {
    // Navigate to your symptom logging page
    console.log('Navigate to logging page');
  }

  generateSteps(task: any) {
    // This is where your AI logic will eventually hook in
    console.log('Generating steps for:', task.title);
  }

  skipTask(task: any) {
    // Logic to discard task or send email
    alert('Task skipped. Taking a break is okay!');
  }

  openLink(url: string) {
    if (url) {
      // '_system' tells the device to open the link in the default browser (Safari/Chrome)
      window.open(url, '_system');
    } else {
      console.error("No link provided for this task");
    }
  }

}
