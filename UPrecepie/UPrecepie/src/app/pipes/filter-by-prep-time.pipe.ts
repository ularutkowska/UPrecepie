import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Pipe({
  name: 'filterByPrepTime',
  standalone: true,
})
export class FilterByPrepTimePipe implements PipeTransform {
  transform(recipes: Recipe[], maxTime: number): Recipe[] {
    if (!recipes || maxTime == null) {
      return recipes;
    }
    return recipes.filter(recipe => recipe.preparation_time <= maxTime);
  }
}
