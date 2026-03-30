import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// ── IMPORTANT: adjust this path to match where firebase.config.ts actually is
// If setup.page.ts is in src/app/pages/ → use '../../firebase.config'
// If setup.page.ts is in src/app/       → use './firebase.config'
import { SECRET_KEYS } from 'src/environments/config-api';
import { initializeApp } from 'firebase/app';
const app = initializeApp(SECRET_KEYS.firebaseConfig);
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SetupPage {

  Math = Math;

  currentStep = 1;
  totalSteps  = 4;
  saving      = false;
  errorMsg    = '';

  genderOptions  = ['Male', 'Female'];

  symptomOptions = [
    'Fatigue', 'Muscle weakness', 'Numbness or tingling',
    'Balance or coordination issues', 'Vision problems', 'Cognitive fog',
    'Bladder or bowel issues', 'Spasticity', 'Pain',
    'Depression or anxiety', 'Speech difficulties', 'Tremors'
  ];

  triggerOptions = [
    'Heat or humidity', 'Physical overexertion', 'Stress or anxiety',
    'Illness or infection', 'Poor sleep', 'Bright lights',
    'Alcohol', 'Skipping medications'
  ];

  formData = {
    age: '', gender: '', height: '', weight: '',
    symptoms: [] as string[], otherSymptom: '',
    triggers: [] as string[], otherTrigger: '',
    medications: '', doctorName: '', clinic: ''
  };

  constructor(private router: Router) {}

  toggle(list: string[], item: string) {
    const i = list.indexOf(item);
    if (i === -1) list.push(item);
    else list.splice(i, 1);
  }

  nextStep() {
    this.errorMsg = '';
    if (this.currentStep === 1) {
      if (!this.formData.age || +this.formData.age < 1 || +this.formData.age > 120) {
        this.errorMsg = 'Please enter a valid age (1–120).'; return;
      }
      if (!this.formData.gender) {
        this.errorMsg = 'Please select your gender.'; return;
      }
      if (!this.formData.height || +this.formData.height < 50) {
        this.errorMsg = 'Please enter a valid height in cm (min 50).'; return;
      }
      if (!this.formData.weight || +this.formData.weight < 20) {
        this.errorMsg = 'Please enter a valid weight in kg (min 20).'; return;
      }
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    this.errorMsg = '';
    if (this.currentStep > 1) this.currentStep--;
  }

  async saveProfile() {
    // Reset state
    this.saving   = true;
    this.errorMsg = '';

    try {
      // 1. Get current user
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (!user) {
        this.saving   = false;
        this.errorMsg = 'Not logged in — please sign in again.';
        this.router.navigateByUrl('/login');
        return;
      }

      // 2. Build arrays (merge "other" free text)
      const symptoms = [...this.formData.symptoms];
      if (this.formData.otherSymptom.trim())
        symptoms.push(this.formData.otherSymptom.trim());

      const triggers = [...this.formData.triggers];
      if (this.formData.otherTrigger.trim())
        triggers.push(this.formData.otherTrigger.trim());

      // 3. Write to Firestore
      const db = getFirestore(app);
      await setDoc(doc(db, 'users', user.uid), {
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName,
        age:         Number(this.formData.age),
        gender:      this.formData.gender,
        height:      Number(this.formData.height),
        weight:      Number(this.formData.weight),
        symptoms,
        triggers,
        medications: this.formData.medications.trim(),
        doctorName:  this.formData.doctorName.trim(),
        clinic:      this.formData.clinic.trim(),
        createdAt:   new Date().toISOString()
      }, { merge: true });   // merge:true is safer — won't wipe existing data

      // 4. Navigate on success
      this.saving = false;
      this.router.navigateByUrl('/home');

    } catch (err: any) {
      this.saving   = false;

      // Show a human-readable error so you know exactly what went wrong
      if (err?.code === 'permission-denied') {
        this.errorMsg =
          '⚠️ Firestore permission denied. Go to Firebase Console → ' +
          'Firestore → Rules and set: allow read, write: if request.auth != null;';
      } else if (err?.code === 'not-found') {
        this.errorMsg = 'Firestore database not found. Check Firebase Console.';
      } else {
        this.errorMsg = `Save failed: ${err?.message ?? 'Unknown error'}`;
      }

      console.error('[SetupPage] saveProfile error:', err);
    }
  }
}
