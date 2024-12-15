import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { Recipe } from '../../models/recipe.model';
import { UserService } from '../../services/user.service';
import { TimeValidator } from '../../validators/time.validator';


@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit {
  recipeForm: FormGroup; 
  recipes: Recipe[] = []; 
  categories: Category[] = []; 

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService
  ) {
    this.recipeForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        ingredients: ['', [Validators.required, Validators.pattern(/.+/)]], 
        instructions: ['', Validators.required],
        preparation_time: [0, [Validators.required, TimeValidator()]],
        categoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.recipeService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const loggedInUser = this.userService.getLoggedInUser();
      if (!loggedInUser) {
        alert('You need to log in to add a recipe.');
        return;
      }
  
      const newRecipe: Recipe = {
        ...this.recipeForm.value,
        ingredients: this.recipeForm.value.ingredients.split(',').map((item: string) => item.trim()),
        instructions: this.recipeForm.value.instructions.split(',').map((item: string) => item.trim()),
        rating: 0,
        ratings: [],
        comments: [],
      };
  
      this.recipeService.addRecipe(newRecipe).subscribe({
        next: (createdRecipe) => {
          const updatedUser = {
            ...loggedInUser,
            submitted_recipes: [...loggedInUser.submitted_recipes, createdRecipe.id],
          };
      
          this.userService.updateUser(updatedUser).subscribe({
            next: () => {
              alert('Recipe added successfully and linked to your profile!');
              this.recipeForm.reset();
              this.userService.refreshLoggedInUser();
            },
            error: (error) => {
              console.error('Error updating user submitted_recipes:', error);
              alert('Recipe was added, but failed to update your profile.');
            },
          });
        },
        error: (error) => {
          console.error('Error adding recipe:', error);
          alert('An error occurred while adding the recipe.');
        },
      });
      
    }
  }
}
