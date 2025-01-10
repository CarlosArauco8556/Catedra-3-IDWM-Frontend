import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../_shared/services/local-storage.service';
import { firstValueFrom } from 'rxjs';
import { IQueryParams } from '../interfaces/IQueryParams';
import { IGetPosts } from '../interfaces/IGetPosts';
import { ICreatePost } from '../interfaces/ICreatePost';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  localStorageService : LocalStorageService = inject(LocalStorageService);
  token = this.localStorageService.getVariable('token') || '';
  baseUrl = 'http://localhost:5174/api/Post';
  httpClient: HttpClient = inject(HttpClient);
  errors: string[] = [];

  async getPosts(IQueryParams: IQueryParams): Promise<IGetPosts[]> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      let params = new HttpParams() 
        if(IQueryParams.textFilter) params = params.set('textFilter', IQueryParams.textFilter); 
        if(IQueryParams.isDescendingDate) params = params.set('isDescendingDate', IQueryParams.isDescendingDate.toString());
        if(IQueryParams.pageNumber) params = params.set('pageNumber', IQueryParams.pageNumber.toString()); 
        if(IQueryParams.pageSize) params = params.set('pageSize', IQueryParams.pageSize.toString()); 
      
      const response = await firstValueFrom( this.httpClient.get<IGetPosts[]>(this.baseUrl, {params: params, headers: headers }))
      return Promise.resolve(response); 
    } catch (error) { 
      console.log('Error en getPosts service', error);
      if(error instanceof HttpErrorResponse) 
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage); 
        }
        return Promise.reject(error); 
    }
  }

  async createPost(ICreatePost: ICreatePost): Promise<IGetPosts> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      const formData = new FormData(); 
      formData.append('title', ICreatePost.title);
      formData.append('publicationDate', ICreatePost.publicationDate.toString());
      if(ICreatePost.image) formData.append('image', ICreatePost.image, ICreatePost.image.name); 

      const response = await firstValueFrom( this.httpClient.post<IGetPosts>(this.baseUrl, formData, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en createPost service', error);
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage); 
      }
      return Promise.reject(error);
    }
  }  
}
