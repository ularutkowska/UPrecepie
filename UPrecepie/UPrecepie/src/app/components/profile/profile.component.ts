import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userRecipes: Recipe[] = [];
  profileForm: FormGroup;
  passwordForm: FormGroup;
  editMode: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private recipeService: RecipeService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.userService.getLoggedInUser();

    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        surname: this.user.surname,
        email: this.user.email,
      });

      this.recipeService.getRecipes().subscribe((recipes) => {
        this.userRecipes = recipes.filter((recipe) =>
          this.user?.submitted_recipes.includes(recipe.id)
        );
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.user) {
      const updatedUser = {
        ...this.user,
        name: this.profileForm.value.name,
        surname: this.profileForm.value.surname,
      };
  
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = response;
          this.userService.setLoggedInUser(response);
          this.toggleEditMode();
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('An error occurred while updating the profile.');
        },
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid && this.user) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
  
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
      }
  
      if (currentPassword !== this.user.password) {
        alert('Current password is incorrect.');
        return;
      }
  
      const updatedUser = {
        ...this.user,
        password: newPassword,
      };
  
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = response;
          alert('Password changed successfully!');
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Error changing password:', error);
          alert('An error occurred while changing the password.');
        }
      });
    }
  }
  
  
}
