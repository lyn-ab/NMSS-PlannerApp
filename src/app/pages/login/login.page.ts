import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { app } from '../../firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LoginPage {

  loading  = false;
  errorMsg = '';

  constructor(private router: Router) {}

  async loginWithGoogle() {
    this.loading  = true;
    this.errorMsg = '';

    try {
      const auth     = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result   = await signInWithPopup(auth, provider);
      const user     = result.user;

      // Try Firestore — but route to /setup if ANYTHING goes wrong
      try {
        const db      = getFirestore(app);
        const userRef = doc(db, 'users', user.uid);
        const snap    = await getDoc(userRef);

        if (snap.exists()) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/setup', { replaceUrl: true });
        }
      } catch (firestoreErr) {
        // Firestore failed (likely rules) — still send to setup so app works
        console.warn('Firestore check failed, routing to setup:', firestoreErr);
        this.router.navigateByUrl('/setup', { replaceUrl: true });
      }

    } catch (authErr: any) {
      console.error('Auth error:', authErr);
      if (authErr?.code !== 'auth/cancelled-popup-request' &&
          authErr?.code !== 'auth/popup-closed-by-user') {
        this.errorMsg = 'Sign-in failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}