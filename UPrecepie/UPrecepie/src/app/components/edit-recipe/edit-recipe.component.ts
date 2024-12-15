import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { Category } from '../../models/category.model';
import { TimeValidator } from '../../validators/time.validator';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  recipeId: string | null = null;
  categories: Category[] = []; // Dodano właściwość `categories`

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
      instructions: ['', Validators.required],
      preparation_time: [0, [Validators.required, TimeValidator()]],
      categoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.recipeService.getRecipeById(this.recipeId).subscribe({
        next: (recipe) => {
          this.recipeForm.patchValue({
            ...recipe,
            ingredients: recipe.ingredients.join(', '), 
            instructions: recipe.instructions.join(', '), 
            categoryName: recipe.categoryName, 
          });
        },
        error: (error) => {
          console.error('Error fetching recipe:', error);
          alert('Could not fetch recipe details.');
        }
      });
    }
  
    this.recipeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories; 
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid && this.recipeId) {
      const updatedRecipe: Recipe = {
        ...this.recipeForm.value,
        id: this.recipeId,
        ingredients: this.recipeForm.value.ingredients.split(',').map((item: string) => item.trim()),
        instructions: this.recipeForm.value.instructions.split(',').map((item: string) => item.trim()),
        categoryName: this.recipeForm.value.categoryName 
      };
  
      this.recipeService.updateRecipe(updatedRecipe).subscribe(
        () => {
          alert('Recipe updated successfully!');
          this.router.navigate(['/recipes', this.recipeId]);
        },
        (error) => {
          console.error('Error updating recipe:', error);
          alert('Failed to update the recipe.');
        }
      );
    }
  }
  
  cancel(): void {
    this.router.navigate(['/recipes', this.recipeId]);
  }
  
}
