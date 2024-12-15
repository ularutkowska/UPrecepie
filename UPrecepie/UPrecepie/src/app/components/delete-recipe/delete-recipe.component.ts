import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-delete-recipe',
  standalone: true,
  templateUrl: './delete-recipe.component.html',
  styleUrls: ['./delete-recipe.component.scss'],
})
export class DeleteRecipeComponent {
  recipeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
  }

  deleteRecipe(): void {
    if (this.recipeId) {
      const loggedInUser = this.userService.getLoggedInUser();
      if (!loggedInUser) {
        alert('You need to log in to delete a recipe.');
        return;
      }
  
      this.recipeService.deleteRecipe(this.recipeId).subscribe({
        next: () => {
          const updatedUser = {
            ...loggedInUser,
            submitted_recipes: loggedInUser.submitted_recipes.filter((id) => id !== this.recipeId),
          };
  
          this.userService.updateUser(updatedUser).subscribe({
            next: () => {
              alert('Recipe deleted successfully!');
              this.router.navigate(['/recipes']);
            },
            error: (error) => {
              console.error('Error updating user submitted_recipes:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          alert('Failed to delete the recipe.');
        }
      });
    }
  }
  
}
