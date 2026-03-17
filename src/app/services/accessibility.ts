import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root' // This makes it available everywhere in the app
})
export class AccessibilityService {

  constructor() { }

  async speak(text: string, lang: string = 'en-US') {
    try {
      await TextToSpeech.speak({
        text: text,
        lang: lang,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient'
      });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }
}
