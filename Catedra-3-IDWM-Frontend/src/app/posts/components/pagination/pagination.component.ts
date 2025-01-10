import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GetPostsPageComponent } from '../../pages/get-posts-page/get-posts-page.component';

@Component({
  selector: 'post-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  getPostsPage: GetPostsPageComponent = inject(GetPostsPageComponent);
  currentPage: number = 1;


  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.getPostsPage.IQueryParams.pageNumber = this.currentPage;
      this.getPostsPage.getPosts(this.getPostsPage.textFilterPosts);
    }
  }

  nextPage(){
    if(this.getPostsPage.posts.length === 10){
      this.currentPage++;
      this.getPostsPage.IQueryParams.pageNumber = this.currentPage;
      this.getPostsPage.getPosts(this.getPostsPage.textFilterPosts);
    }else{
      this.getPostsPage.toastService.info('No hay más ventas', 2000);
    }
  }

  async goToPage(page: number){
    this.currentPage = page;
    this.getPostsPage.IQueryParams.pageNumber = this.currentPage;
    this.getPostsPage.getPosts(this.getPostsPage.textFilterPosts);
  }
}
