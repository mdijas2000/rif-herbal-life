import { Component } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';
  loading = false;
  showPassword = false;
  router = inject(Router);
  auth = inject(AuthService);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMsg = '';
    this.loading = true;

    this.auth.login({ username: this.username, password: this.password })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          console.log('SUCCESS', res);

          // Redirect based on role
          if (this.auth.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/products']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMsg = err?.error?.message || 'Invalid username or password';
        }
      });
  }
}

//     this.http.post('http://localhost:8080/api/auth/login', {
//       username: this.username,
//       password: this.password
//     }).subscribe({
//       next: (res: any) => {
//         console.log('SUCCESS', res);

//         // store token
//         localStorage.setItem('token', res.token);
//         localStorage.setItem('username', res.username);
//         localStorage.setItem('role', res.role);
//         console.log("Redirecting to home page...");
//         this.router.navigate(['/products']);
//       },
//       error: () => {
//         this.errorMsg = 'Invalid username or password';
//       }
//     });
//   }
// }
