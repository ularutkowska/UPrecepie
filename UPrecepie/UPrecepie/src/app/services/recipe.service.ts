import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
import { Rating } from '../models/rating.model';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000';
  private currentUserId: string | null = "1"; // Zmieniono na string
  private userChange = new BehaviorSubject<string | null>(this.currentUserId);

  constructor(private http: HttpClient) {}

  get userChange$(): Observable<string | null> {
    return this.userChange.asObservable();
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.userChange.next(userId);
    console.log('User logged in:', userId);
  }

  logout(): void {
    this.currentUserId = null;
    this.userChange.next(null);
  }

  private getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${this.currentUserId}`);
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe);
  }

  deleteRecipe(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipes/${recipeId}`);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/recipes/${recipe.id}`, recipe);
  }  
  

  addRating(recipeId: string, ratings: Rating[]): Observable<Recipe> {
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  
    return this.http.patch<Recipe>(`${this.apiUrl}/recipes/${recipeId}`, {
      ratings,
      rating: averageRating, 
    });
  }
  
  

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getFavouriteRecipes(userId: string): Observable<Recipe[]> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
      switchMap((user) => {
        const favouriteIds = user.favourite_list;
        return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
          map((recipes: Recipe[]) => recipes.filter((recipe) => favouriteIds.includes(recipe.id)))
        );
      })
    );
  }
  
  
  
}
