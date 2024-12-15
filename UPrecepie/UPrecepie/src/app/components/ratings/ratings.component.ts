import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ratings.component.html', 
  styleUrls: ['./ratings.component.scss'], 
})
export class RatingsComponent {
  @Input() averageRating: number | null = null; 
  @Input() userRating: number | null = null; 
  @Output() ratingChange = new EventEmitter<number>(); 

  rate(rating: number): void {
    this.userRating = rating;
    this.ratingChange.emit(rating);
  }
}
