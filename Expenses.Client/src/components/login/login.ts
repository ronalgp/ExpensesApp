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
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return (
      ((control?.touched || control?.dirty) && control.hasError(errorName)) ||
      false
    );
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const login = this.loginForm.value;
      this.authService.login(login).subscribe({
        next: () => {
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Login failed. Please try again.';
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      });
    }
  }
}
