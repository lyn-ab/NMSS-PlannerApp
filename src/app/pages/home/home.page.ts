import { Language } from './../../services/language';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../../services/accessibility';
import symptomsData from '../../../assets/data/symptoms.json';
import { HttpClient } from '@angular/common/http';
import { SECRET_KEYS } from 'src/environments/config-api';
import { GeminiService } from 'src/app/services/gemini';
import { Task } from '../../models/task.model';
import { Firebase } from 'src/app/services/firebase';
import { Persistence } from 'src/app/services/persistence';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  progressValue = 0.0;
  affirmation = "You're doing great! Just one step at a time.";// Placeholder for randomly generated affirmation

  allSymptoms = symptomsData.symptoms;

  viewTasks: Task[] = [];

  searchTerm = '';
  selectedSymptom: any = null;
  severity = 3;

  currentLanguage = 'en';

  filteredList: any[] = [];

  currentTime: string = '';
  currentMonthYear: string = '';
  weekDays: any[] = [];
  private timer: any;

  greeting : string = '';

  selectedTaskForModal: Task | null = null;

  userProfile = {
    userName: 'Jenna',
    conditions: ['Chronic Fatigue Syndrome', 'POTS'],
    triggers: ['Bright lights', 'Long standing'],
    currentEnergy: 'Low',
    preferences: 'Quiet environments, needs frequent sitting breaks'
  };



  constructor(
    private languageService: Language,
    private http: HttpClient,
    private accessibility: AccessibilityService,
    private toastController: ToastController,
    private geminiService: GeminiService,
    private firebase: Firebase,
    private persistence: Persistence
  ) {
    this.loadSymptoms();
     this.persistence.listen(); // Start listening to Firebase changes
   }

  ngOnInit() {
    this.currentLanguage = this.languageService.getLanguage();
    this.allSymptoms = symptomsData.symptoms || [];
    this.checkGeminiModels();
    this.updateClock();
    this.generateWeek();
    // Update time every minute
    this.timer = setInterval(() => this.updateClock(), 60000);
    this.setGreeting();

    

  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.viewTasks = this.persistence.getLocalList() || [];
    this.viewTasks = this.persistence.getRemoteList();

    console.log("Home Page loaded tasks:", this.viewTasks);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.currentMonthYear = now.toLocaleDateString([], { month: 'long', year: 'numeric' });
  }

  generateWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Get Sunday of the current week
    startOfWeek.setDate(now.getDate() - now.getDay());

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startOfWeek);
      tempDate.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        dayName: tempDate.toLocaleDateString([], { weekday: 'short' }), // "Mon", "Tue"
        dateNumber: tempDate.getDate(),
        isToday: tempDate.toDateString() === now.toDateString()
      });
    }
  }

  loadSymptoms(){
    this.http.get<any>('assets/data/symptoms.json').subscribe(data => {
      this.allSymptoms = data.symptoms;
    });
  }

  getSymptomName(symptom: any): string {
    if (!symptom || !symptom.names) return '';
    return (symptom.names as any)[this.currentLanguage] || '';
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredList = this.filterSymptoms();
  }

  filterSymptoms() {
    if(!this.allSymptoms || this.allSymptoms.length === 0 || !this.searchTerm.trim()) {
      return [];
    }
    return this.allSymptoms.filter(symptom => {
      const name = (symptom.names as any)?.[this.currentLanguage] || '';
      return name.toLowerCase().includes(this.searchTerm.toLowerCase());
    }).slice(0, 5);
  }

  saveLog(){}

  selectSymptom(symptom: any) {
    this.selectedSymptom = symptom;
    this.searchTerm = '';
    this.filteredList = [];
  }

  resetSelection(){
    this.selectedSymptom = null;
    this.severity = 3;
  }

  async skipTask(task: any) {
    console.log('Skipping: '+ task.title);
    const toast = await this.toastController.create({
      message: `Task '${task.title}' skipped. Taking a break is okay!`,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-skip-toast',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }]
    });
    await toast.present();
  }

  playGreeting() {
    this.accessibility.speak("Hello! How are you feeling today?", "en-US");
  }

  openSymptomLogger() {
    console.log('Navigate to logging page');
  }

 async toggleMicrosteps(task: any) {
    if (!task.microsteps || task.microsteps.length === 0) {
      task.isGenerating = true;
      try {
        const aiResponse = await this.generateSteps(task);
        task.microsteps = this.parseSteps(aiResponse);
      } catch (error) {
        console.error(error);
        task.microsteps = ["AI is currently unavailable. Try again later."];
      } finally {
        task.isGenerating = false;
      }
    }

    this.selectedTaskForModal = task;
  }

    closeSteps() {
    this.selectedTaskForModal = null;
  }

  async generateSteps(task: any): Promise<string> {
    const prompt = `
      ACT AS: An occupational therapist and executive function coach.
      USER PROFILE:
      - Conditions: ${this.userProfile.conditions.join(', ')}
      - Energy Level: ${this.userProfile.currentEnergy}
      - Triggers to avoid: ${this.userProfile.triggers.join(', ')}

      TASK: ${task.title} at ${task.locationName}
      USER'S SPECIFIC CONCERN: ${task.userNotes || 'None'}

      GOAL: Break this down into 5 "Micro-steps".

      STRICT RULES:
      1. DO NOT include any introductory text, greetings, or "Hello!".
      2. DO NOT include a conclusion or encouragement at the end.
      3. DO NOT use Markdown headers (like ###).
      4. ONLY output a numbered list (1-5).
      5. Each step must be a single, actionable sentence focused on energy conservation for ${this.userProfile.conditions[0]}.

      OUTPUT FORMAT:
      1. [Step 1]
      2. [Step 2]
      ...etc
    `;

    const result = await this.geminiService.generateText(prompt);
    return result;
  }

  parseSteps(text: string): string[] {
    return text
      .split(/\n/)
      .map(step => step.replace(/^\d+\.\s*|^\-\s*/, '').trim())
      .filter(step => step.length > 3)
      .slice(0, 5);
  }

  openLink(url: string) {
    if (url) {
      window.open(url, '_system');
    }
    else {
      console.error("No link provided for this task");
    }
  }

  async checkGeminiModels() {
    try {
      await this.geminiService.checkModels();
    } catch (err) {
      console.error("Could not list models:", err);
    }
  }

  setGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) {
        this.greeting='Morning';
      } else if (hour < 18) {
        this.greeting='Afternoon';
      } else {
        this.greeting='Evening';
      }
  }

}
