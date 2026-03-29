import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default: redirect to login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login (your page)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },

  // Setup (your page — lives at src/app/setup.page.ts, NOT inside /pages/)
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup.page').then(m => m.SetupPage)
  },

  // Home (teammate's page)
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },

  // Calendar (your page — CHANGED from loadChildren module to standalone component)
  // Make sure calendar.page.ts uses "standalone: true" (the file I gave you does)
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage)
  },

  // Add-task — leave this for your teammate, or add when ready
  // {
  //   path: 'add-task',
  //   loadComponent: () => import('./pages/add-task/add-task.page').then(m => m.AddTaskPage)
  // },
];