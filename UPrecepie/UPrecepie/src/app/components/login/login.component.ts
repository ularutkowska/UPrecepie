import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.userService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            this.errorMessage = null;
            this.router.navigate(['/recipes']);
          } else {
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Server error. Please try again later.';
          console.error('Login error:', error);
        }
      });
    }
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
