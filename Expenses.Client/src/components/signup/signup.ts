import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  hasError(controlName: string, errorName: string) : boolean{
    const control = this.signupForm.get(controlName);
    return (control?.touched || control?.dirty) && control.hasError(errorName) || false;
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { passwordsMismatch: true };
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.signupForm.valid) {
      const signUp = this.signupForm.value;
      this.authService.register(signUp).subscribe({
        next: () => {
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      });
    }
  }
}
