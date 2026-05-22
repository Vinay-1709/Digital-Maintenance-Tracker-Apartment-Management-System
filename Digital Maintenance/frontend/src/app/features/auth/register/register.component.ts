import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.redirectUser();
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      contact_info: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.redirectUser();
        },
        error: error => {
          this.error = error.error?.errors?.[0]?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }

  redirectUser() {
    const user = this.authService.currentUserValue;
    if (user?.role === 'resident') {
      this.router.navigate(['/maintenance/history']);
    } else if (user?.role === 'technician') {
      this.router.navigate(['/technician/dashboard']);
    } else if (user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
