export class Task {
  title: string;
  type: string;
  icon: string;
  locationName: string;
  duedate: string;
  userNotes?: string  ;
  showMicrosteps?: boolean;
  microsteps?: string[];
  isGenerating?: boolean;

  constructor(title: string, type: string, icon: string, locationName: string, duedate: Date, userNotes?: string) {
    this.title = title;
    this.type = type;
    this.icon = icon;
    this.locationName = locationName;
    this.duedate =  duedate.toISOString();
    this.userNotes = userNotes || '';
    this.showMicrosteps = false;
    this.microsteps = [];
    this.isGenerating = false;
  }
}
