import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { SECRET_KEYS } from 'src/environments/config-api';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, doc, getDoc, collection,
  addDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

interface Task {
  id: string; title: string; time?: string;
  note?: string; category: string; date: string; done: boolean;
}
const app = initializeApp(SECRET_KEYS.firebaseConfig);
interface DayPill { label: string; num: number; date: Date; }

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CalendarPage implements OnInit {


  today        = new Date();
  currentMonth = new Date();
  selectedDate = new Date();
  weekDays: DayPill[] = [];

  allTasks: Task[]            = [];
  tasksForSelectedDay: Task[] = [];

  showAddModal = false;
  modalError   = '';
  newTask      = this.emptyTask();

  taskCategories = [
    { label: 'Medication',  value: 'medication'  },
    { label: 'Appointment', value: 'appointment' },
    { label: 'Exercise',    value: 'exercise'    },
    { label: 'Other',       value: 'other'       }
  ];

  userTriggers: string[] = [];

  constructor(public router: Router) {}

  get currentMonthLabel() {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  get selectedDateLabel() {
    if (this.isToday(this.selectedDate)) return 'Today';
    return this.selectedDate.toLocaleDateString('default', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  async ngOnInit() {
    this.buildWeekDays();
    await this.loadUserTriggers();
    await this.loadTasks();
  }

  goTo(path: string) { this.router.navigateByUrl(path); }

  buildWeekDays() {
    const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const base = new Date(this.currentMonth);
    base.setDate(1);
    this.weekDays = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      this.weekDays.push({ label: labels[d.getDay()], num: d.getDate(), date: d });
    }
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildWeekDays();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildWeekDays();
  }

  selectDay(date: Date) { this.selectedDate = date; this.updateDayTasks(); }

  isToday(date: Date)       { return this.toKey(date) === this.toKey(this.today); }
  isSelectedDay(date: Date) { return this.toKey(date) === this.toKey(this.selectedDate); }
  hasTasksOnDay(date: Date) { return this.allTasks.some(t => t.date === this.toKey(date)); }
  toKey(date: Date)         { return date.toISOString().slice(0, 10); }

  categoryLabel(value: string) {
    return this.taskCategories.find(c => c.value === value)?.label ?? value;
  }

  async loadTasks() {

    const user = getAuth(app).currentUser;
    if (!user) return;
    const snap = await getDocs(collection(getFirestore(app), 'users', user.uid, 'tasks'));
    this.allTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
    this.updateDayTasks();
  }

  updateDayTasks() {
    const key = this.toKey(this.selectedDate);
    this.tasksForSelectedDay = this.allTasks
      .filter(t => t.date === key)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  async loadUserTriggers() {
    const user = getAuth(app).currentUser;
    if (!user) return;
    const snap = await getDoc(doc(getFirestore(app), 'users', user.uid));
    if (snap.exists()) this.userTriggers = snap.data()['triggers'] || [];
  }

  openAddTask() { this.newTask = this.emptyTask(); this.modalError = ''; this.showAddModal = true; }
  closeModal()  { this.showAddModal = false; }
  emptyTask()   { return { title: '', time: '', note: '', category: 'other' }; }

  async saveTask() {
    this.modalError = '';
    if (!this.newTask.title.trim()) { this.modalError = 'Please enter a task title.'; return; }
    const user = getAuth(app).currentUser;
    if (!user) return;
    const data = {
      title: this.newTask.title.trim(), time: this.newTask.time || '',
      note: this.newTask.note || '', category: this.newTask.category,
      date: this.toKey(this.selectedDate), done: false
    };
    const ref = await addDoc(collection(getFirestore(app), 'users', user.uid, 'tasks'), data);
    this.allTasks.push({ id: ref.id, ...data });
    this.updateDayTasks();
    this.closeModal();
  }

  async toggleTaskDone(task: Task) {
    task.done = !task.done;
    const user = getAuth(app).currentUser;
    if (!user) return;
    await updateDoc(doc(getFirestore(app), 'users', user.uid, 'tasks', task.id), { done: task.done });
  }

  async deleteTask(task: Task) {
    const user = getAuth(app).currentUser;
    if (!user) return;
    await deleteDoc(doc(getFirestore(app), 'users', user.uid, 'tasks', task.id));
    this.allTasks = this.allTasks.filter(t => t.id !== task.id);
    this.updateDayTasks();
  }

  trackById(_: number, task: Task) { return task.id; }
}
