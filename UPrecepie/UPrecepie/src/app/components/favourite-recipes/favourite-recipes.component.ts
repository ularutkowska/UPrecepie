import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { UserService } from '../../services/user.service';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favourite-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favourite-recipes.component.html',
  styleUrls: ['./favourite-recipes.component.scss'],
})
export class FavouriteRecipesComponent implements OnInit {
  favouriteRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.updateFavourites();

    this.recipeService.userChange$.subscribe(() => {
      this.updateFavourites();
    });
  }

  updateFavourites(): void {
    const userId = this.userService.getLoggedInUser()?.id;
    if (!userId) {
      this.favouriteRecipes = [];
      return;
    }
  
    this.recipeService.getFavouriteRecipes(userId).subscribe({
      next: (recipes) => {
        this.favouriteRecipes = recipes;
      },
      error: (error) => {
        console.error('Error fetching favourite recipes:', error);
        this.favouriteRecipes = [];
      }
    });
  }
  
}
