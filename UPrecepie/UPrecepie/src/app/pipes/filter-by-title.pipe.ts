import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Pipe({
  name: 'filterByTitle',
  standalone: true
})
export class FilterByTitlePipe implements PipeTransform {
  transform(recipes: Recipe[], keyword: string | null): Recipe[] {
    if (!recipes || !keyword || !keyword.trim()) {
      return recipes;
    }
    const lowerCaseKeyword = keyword.trim().toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(lowerCaseKeyword)
    );
  }
}
