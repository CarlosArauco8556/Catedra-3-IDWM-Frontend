import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../_shared/components/navbar/navbar.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../_shared/services/toast.service';
import { IGetPosts } from '../../interfaces/IGetPosts';
import { IQueryParams } from '../../interfaces/IQueryParams';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'get-posts-page',
  imports: [HttpClientModule, CommonModule, NavbarComponent, PaginationComponent, PostCardComponent],
  providers: [PostService],
  templateUrl: './get-posts-page.component.html',
  styleUrl: './get-posts-page.component.css'
})
export class GetPostsPageComponent {
  postService: PostService = inject(PostService);
  toastService: ToastService = inject(ToastService);
  IQueryParams: IQueryParams = { textFilter: '', isDescendingDate: null, pageNumber: 1, pageSize: 10 };
  posts: IGetPosts[] = [];
  textFilterPosts: string = '';
  errors: string[] = [];

  ngOnInit() {
    this.getPosts('');
  }

  async getPosts(input : string) {
    this.errors = [];
    try{
      this.IQueryParams.textFilter = input;
      const productsObtained = await this.postService.getPosts(this.IQueryParams);
      if(productsObtained){
        this.posts = productsObtained; 
        console.log(this.posts); 
        if (this.posts.length === 0){ 
          this.toastService.warning('No se encontraron posts', 2000); 
        }
      }else{
        this.posts = [];
        this.errors = this.postService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al obtener los posts');
      }
    }catch(error: any){
      this.posts = [];
      if(error instanceof HttpErrorResponse) 
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al obtener posts';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al obtener posts'); 
      }
      console.log('Error in get posts page', error);
    }
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    switch (value) {
      case 'true':
        this.IQueryParams.isDescendingDate = true;
        this.getPosts(this.textFilterPosts);
        break;
      case 'false':
        this.IQueryParams.isDescendingDate = false;
        this.getPosts(this.textFilterPosts);
        break;
      case 'null':
        this.IQueryParams.isDescendingDate = null;
        this.getPosts(this.textFilterPosts);
        break;
      default:
      break;
    }
  }
}
