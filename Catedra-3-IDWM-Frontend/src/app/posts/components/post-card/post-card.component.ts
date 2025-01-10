import { Component, Input } from '@angular/core';
import { IGetPosts } from '../../interfaces/IGetPosts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'post-card',
  imports: [DatePipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() post: IGetPosts;

  constructor() { 
    this.post = {
      title: '',
      publicationDate: new Date(),
      imageUrl: '',
    }
  }
}
