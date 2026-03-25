import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {get, getDatabase, ref, set, update, remove, DataSnapshot, push} from 'firebase/database';
import { SECRET_KEYS } from 'src/environments/config-api';

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  db: any;

  constructor() {
    const app = initializeApp(SECRET_KEYS.firebaseConfig);
    this.db = getDatabase(app);
  }

  create(path: string, data: any): Promise<void>{
    return set(ref(this.db, path), data);
  }
  async retrieve(path: string, key: string): Promise<DataSnapshot>{
    return await get(ref(this.db, path+"/"+key));
  }
  update(path: string, key: string, data: any): Promise<void>{
    return update(ref(this.db, path + "/" + key), data);
  }
  delete(path: string, key: string): Promise<void>{
    return remove(ref(this.db, path+"/"+key));
  }

  generateKey(path: string): string {
    const newRef = push(ref(this.db, path));
    return newRef.key as string;
  }

   pushToList(path: string, data: any){
    return push(ref(this.db, path), data).key;
  }

  deleteFromList(path: string, key: string){
    this.delete(path, key);
  }

  async getList(path: string){
    const dblist = await get(ref(this.db, path));
    let locallist: any[] = [];
    dblist.forEach( (item: any) =>{locallist.push(item.val());});
    return locallist;
  }
  reset(){
    this.delete("","");
  }
  getDB(){
    return this.db;
  }

}
