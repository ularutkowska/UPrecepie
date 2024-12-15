import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { FavouriteRecipesComponent } from './components/favourite-recipes/favourite-recipes.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { SearchRecipesComponent } from './components/search-recipes/search-recipes.component';
import { EditRecipeComponent } from './components/edit-recipe/edit-recipe.component';
import { DeleteRecipeComponent } from './components/delete-recipe/delete-recipe.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },
  { path: 'add-recipe', component: AddRecipeComponent, canActivate: [AuthGuard] },
  { path: 'favourites', component: FavouriteRecipesComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchRecipesComponent },
  { path: 'recipes/edit/:id', component: EditRecipeComponent, canActivate: [AuthGuard] },
  { path: 'recipes/delete/:id', component: DeleteRecipeComponent, canActivate: [AuthGuard] }
];
