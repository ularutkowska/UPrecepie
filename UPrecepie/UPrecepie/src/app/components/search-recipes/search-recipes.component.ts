import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { RouterModule } from '@angular/router';
import { FilterByRatingPipe } from '../../pipes/filter-by-rating.pipe';
import { FilterByPrepTimePipe } from '../../pipes/filter-by-prep-time.pipe';
import { FilterByTitlePipe } from '../../pipes/filter-by-title.pipe';



@Component({
  selector: 'app-search-recipes',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, RouterModule, FilterByRatingPipe, FilterByPrepTimePipe, FilterByTitlePipe
  ],
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.scss']
})
export class SearchRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchForm: FormGroup;
  minRating: number | null = null;
  maxTime: number | null = null;
  Infinity = Infinity;

  constructor(private recipeService: RecipeService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: [''],
      maxTime: [''],
      minRating: ['']
    });
  }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = [...this.recipes];
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
      }
    });
  }

  onSearch(): void {
    const { maxTime, minRating } = this.searchForm.value;
    this.minRating = minRating ?? 0;
    this.maxTime = maxTime ?? Infinity;
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.filteredRecipes = [...this.recipes];
    this.minRating = null;
    this.maxTime = null;
  }
}
