import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }


  onSubmit() {

    this.errorMessage = '';
    this.successMessage = '';

    // Check form
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;


    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (response) => {

          console.log('Login successful');

          this.isLoading = false;

          // Save JWT Token
          this.authService.setLoggedIn(response.token);

          this.successMessage = 'Login successful!';

          // Go to Home
          setTimeout(() => {

            this.router.navigate(['/admin-dashboard']);

          }, 1000);

        },


        error: (error) => {

          console.log('Login error');

          this.isLoading = false;

          if (error.error?.message) {

            this.errorMessage = error.error.message;

          } else {

            this.errorMessage =
              'Invalid email or password';

          }

        }

      });

  }

}
