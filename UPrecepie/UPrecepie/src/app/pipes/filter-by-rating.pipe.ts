import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Pipe({
  name: 'filterByRating',
  standalone: true,
})
export class FilterByRatingPipe implements PipeTransform {
  transform(recipes: Recipe[], minRating: number): Recipe[] {
    if (!recipes || minRating == null) {
      return recipes;
    }
    return recipes.filter(recipe => recipe.rating >= minRating);
  }
}
