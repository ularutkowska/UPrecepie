import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryListComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = []; 
  filteredRecipes: Recipe[] = [];
  categories: Category[] = [];
  selectedCategoryName: string | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = data;
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
      },
    });
  
    this.recipeService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  onCategorySelected(categoryName: string): void {
    this.selectedCategoryName = categoryName;
  
    this.filteredRecipes = this.recipes.filter(
      (recipe) => recipe.categoryName === categoryName
    );
  }

  applyFilter(): void {
    if (this.selectedCategoryName) {
      this.filteredRecipes = this.recipes.filter(
        (recipe) => recipe.categoryName === this.selectedCategoryName
      );
    } else {
      this.filteredRecipes = [...this.recipes];
    }
  }
}
