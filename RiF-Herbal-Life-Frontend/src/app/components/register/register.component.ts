import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    address: '',
    city: '',
    pincode: '',
    role: 'ROLE_USER'
  };
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private auth: AuthService, private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Check if username contains spaces
    if (this.user.username.includes(' ')) {
      this.errorMessage = 'Username cannot contain spaces';
      return;
    }

    // Clear error message before attempting registration
    this.errorMessage = '';

    this.auth.register(this.user).subscribe({
      next: () => {
        // After registration, redirect to login or potentially directly login
        // For now, redirect to login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Username might be taken.';
        console.error(err);
      }
    });
  }
}
