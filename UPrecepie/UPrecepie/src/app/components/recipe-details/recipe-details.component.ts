import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Rating } from '../../models/rating.model';
import { RatingsComponent } from '../ratings/ratings.component';
import { CommentListComponent } from '../comment-list/comment-list.component';


@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RatingsComponent, CommentListComponent],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | undefined;
  comments: Comment[] = [];
  commentContent: string = '';
  categories: Category[] = [];
  isLoggedIn: boolean = false;
  userRating: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.userService.getLoggedInUser(); 
    const recipeId: string = this.route.snapshot.paramMap.get('id') || '';
  
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
  
        if (this.isLoggedIn && recipe.ratings) {
          const userId = this.userService.getLoggedInUser()?.id || '';
          const userRating = recipe.ratings.find(r => r.userId === userId);
          this.userRating = userRating?.rating || null;
        }
  
        this.commentService.getCommentsByRecipeId(recipeId).subscribe({
          next: (comments) => {
            this.comments = comments;
          },
          error: (error) => console.error('Error fetching comments:', error),
        });
      },
      error: (error) => console.error('Error fetching recipe:', error),
    });
  }
  
  rateRecipe(rating: number): void {
    if (!this.isLoggedIn) {
      alert('You need to log in to rate this recipe.');
      return;
    }
  
    if (this.recipe) {
      const userId = this.userService.getLoggedInUser()?.id;
      if (!userId) {
        console.error('User not logged in');
        return;
      }
  
      const updatedRatings: Rating[] = [
        ...this.recipe.ratings.filter((r) => r.userId !== userId),
        { userId, rating },
      ];
      const averageRating =
        updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;
  
      this.recipeService.addRating(this.recipe.id, updatedRatings).subscribe({
        next: (updatedRecipe) => {
          this.recipe!.ratings = updatedRatings;
          this.recipe!.rating = updatedRecipe.rating;
          alert('Thank you for your rating!');
        },
        error: (error) => console.error('Error adding rating:', error),
      });
    } else {
      console.error('Recipe is undefined');
    }
  }

  toggleFavourite(recipeId: string): void {
    this.userService.toggleFavourite(recipeId).subscribe({
      next: () => {
        alert('Favourites updated!');
      },
      error: (error) => {
        console.error('Error toggling favourite:', error);
      },
    });
  }
  
  isFavourite(recipeId: string): boolean {
    return this.userService.isFavourite(recipeId);
  }
  
  getCategoryName(categoryName: string): string {
    return categoryName || 'Unknown Category';
  }

  isOwner(): boolean {
    const loggedInUser = this.userService.getLoggedInUser();
    return loggedInUser?.submitted_recipes.includes(this.recipe?.id || '') || false;
  }
  
  deleteRecipe(): void {
    if (this.recipe) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        const loggedInUser = this.userService.getLoggedInUser();
        if (!loggedInUser) {
          alert('You need to log in to delete a recipe.');
          return;
        }
  
        this.recipeService.deleteRecipe(this.recipe.id).subscribe({
          next: () => {
            const updatedUser = {
              ...loggedInUser,
              submitted_recipes: loggedInUser.submitted_recipes.filter((id) => id !== this.recipe!.id),
            };
  
            this.userService.updateUser(updatedUser).subscribe({
              next: () => {
                alert('Recipe deleted successfully!');
                this.router.navigate(['/recipes']);
              },
              error: (error) => {
                console.error('Error updating user submitted_recipes:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete the recipe.');
          },
        });
      }
    }
  }
  
  onCommentInput(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    this.commentContent = inputElement.value;
  }

  addComment(): void {
    if (!this.isLoggedIn) {
      alert('You need to log in to add a comment.');
      return;
    }
  
    if (this.recipe && this.commentContent.trim()) {
      this.commentService.getNextCommentId().subscribe({
        next: (nextId) => {
          const comment: Comment = {
            id: nextId,
            recipeId: this.recipe?.id || '',
            userId: this.userService.getLoggedInUser()?.id || '0',
            content: this.commentContent.trim(),
            date: new Date(),
          };
  
          this.commentService.addComment(comment).subscribe({
            next: (response) => {
              this.comments.push(response);
              this.commentContent = '';
            },
            error: (error) => {
              console.error('Error adding comment:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error fetching next comment ID:', error);
        },
      });
    }
  }
  
  editComment(updatedComment: Comment): void {
    this.commentService.updateComment(updatedComment).subscribe({
      next: (response) => {
        const index = this.comments.findIndex((c) => c.id === response.id);
        if (index !== -1) {
          this.comments[index] = response;
          console.log(`Comment with ID ${response.id} updated successfully.`);
        }
      },
      error: (error) => {
        console.error('Error editing comment:', error);
      },
    });
  }
  
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== commentId);
        console.log(`Comment with ID ${commentId} deleted successfully.`);
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      },
    });
  }
  
}
