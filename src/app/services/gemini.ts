import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SECRET_KEYS } from 'src/environments/config-api';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI(SECRET_KEYS.geminiApiKey);
  private model = this.genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
  });

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error: ", error);
      throw error;}
  }

  async checkModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${SECRET_KEYS.geminiApiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Your available models:', data);
  }
}
