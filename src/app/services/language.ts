import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Language {
  private readonly langKey = 'app_language';
  private currentLanguage: string;

  constructor() {
    this.currentLanguage = localStorage.getItem(this.langKey) || 'en';
  }

  getLanguage() {
    return this.currentLanguage;
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    localStorage.setItem(this.langKey, lang);
  }


}
