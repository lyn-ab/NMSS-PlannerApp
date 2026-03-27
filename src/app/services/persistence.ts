import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, set, onValue, get, push } from 'firebase/database';
import { SECRET_KEYS } from 'src/environments/config-api';


@Injectable({
  providedIn: 'root',
})
export class Persistence {
  private db: any;
  private itemRef : any;

  locallist : any[] | null;
  remotelist: any[];

  constructor() {
    this.remotelist = [];
    let myList : string | null = localStorage.getItem("local");
    this.locallist = myList != null ? JSON.parse(myList) : [];
    const firebaseapp = initializeApp(SECRET_KEYS.firebaseConfig);
    this.db = getDatabase(firebaseapp);
    this.itemRef = ref(this.db, 'items');
    this.listen();
  }

  /*
  // Inside persistence.ts
listen() {
    // CHANGE 'ref(this.db)' TO 'ref(this.db, "tasks")'
    onValue(ref(this.db, 'tasks'), (snapshot) => {
      const data = snapshot.val();

      // This turns that -OojRc... key into an 'id' property
      this.remotelist = data ? Object.keys(data).map(id => ({
        id,
        ...data[id],
        // Ensure these exist so the UI doesn't break
        showMicrosteps: false,
        isGenerating: false
      })) : [];

      console.log("Persistence Service updated remotelist:", this.remotelist);
    });
  }*/
 listen() {
  onValue(ref(this.db, 'tasks'), (snapshot) => {
    const data = snapshot.val();
    this.remotelist = data ? Object.keys(data).map(id => ({id, ...data[id]})) : [];
  });
}

  add(item: any, type: string){
    if(type === 'local'){
      this.locallist?.push(item);
      localStorage.setItem("local", JSON.stringify(this.locallist));
    } else if (type === 'remote'){
      const itemKey = item.s;
      const dataRef = ref(this.db, 'items/' + itemKey);

      set(dataRef, item).then(() => {
        item.id = itemKey;
        this.remotelist.push(item);
        console.log("Added to Firebase:", itemKey);
        alert("Item Added");
      });
    }
  }

  remove(item: any, type: string) {
  if (type === 'remote') {
      const itemKey = item.s;
      const dataRef = ref(this.db, 'items/' + itemKey);

    remove(dataRef).then(() => {
        const index = this.remotelist.findIndex(s => s.s === item.s);
        if (index !== -1) {
          this.remotelist.splice(index, 1);
        }
        console.log("Removed from Firebase:", itemKey);
        alert("Item Removed");
      });
    }
  }

  getLocalList(){
    return this.locallist;
  }

  getRemoteList(){
    return this.remotelist
  }
}
