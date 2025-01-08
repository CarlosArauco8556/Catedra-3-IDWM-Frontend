import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setVariable(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getVariable(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  
  removeVariable(key: string): void {
    localStorage.removeItem(key);
  }
}
