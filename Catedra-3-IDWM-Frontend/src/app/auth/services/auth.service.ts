import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../_shared/services/local-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IAuth } from '../interfaces/IAuth';
import { ILoginResponse } from '../interfaces/ILoginResponse';
import { firstValueFrom } from 'rxjs';
import { IRegisterResponse } from '../interfaces/IRegisterResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  localStorageService : LocalStorageService = inject(LocalStorageService);
  token: string = this.localStorageService.getVariable('token') || '';
  baseUrl = 'http://localhost:5174/api/Auth';
  httpClient: HttpClient = inject(HttpClient);
  errors: string[] = [];

  async login(IAuth: IAuth): Promise<ILoginResponse>{
    try {
      const response = await firstValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/login`, IAuth));
      return Promise.resolve(response);
    } catch (error){
      console.log("Error in login service", error);      
      
      if (error instanceof HttpErrorResponse) {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async register(IAuth: IAuth): Promise<IRegisterResponse>{
    try {
      const response = await firstValueFrom(this.httpClient.post<IRegisterResponse>(`${this.baseUrl}/register`, IAuth));
      return Promise.resolve(response);
    } catch (error){
      console.log("Error in register service", error);      
      
      if (error instanceof HttpErrorResponse) {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async logout(): Promise<string>{
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom(
        this.httpClient.post<{ message: string }>(`${this.baseUrl}/logout`, {}, { headers: headers })
      );
      
      this.clearAuthData();
      
      return Promise.resolve(response.message);
    }catch(error){
      console.log("Error in logout service", error);
      
      this.clearAuthData();
      
      if (error instanceof HttpErrorResponse) {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  private clearAuthData(): void {
    this.localStorageService.removeVariable('token');
    this.token = '';
    this.errors = [];
  }
}
