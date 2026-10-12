import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      name: ['', Validators.required],

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

    // Clear old messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate form
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    this.isLoading = true;


    this.authService
      .register(this.registerForm.value)
      .subscribe({

        next: (response) => {

          console.log('Register successful');

          this.isLoading = false;

          this.successMessage = 'Account created successfully!';

          // بعد التسجيل نروح للـ Login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);

        },


        error: (error) => {

          console.log('Register error');

          this.isLoading = false;

          // لو الباك رجع رسالة خطأ
          if (error.error?.message) {

            this.errorMessage = error.error.message;

          } else {

            this.errorMessage =
              'Something went wrong. Please try again.';

          }

        }

      });

  }

}