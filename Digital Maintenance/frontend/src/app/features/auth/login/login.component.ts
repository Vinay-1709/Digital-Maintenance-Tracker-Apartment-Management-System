import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    error = '';
    returnUrl: string = '/';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.redirectUser();
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.redirectUser();
                },
                error: error => {
                    this.error = error.error?.errors?.[0]?.message || 'Login failed';
                    this.loading = false;
                }
            });
    }

    redirectUser() {
        const user = this.authService.currentUserValue;
        if (this.returnUrl && this.returnUrl !== '/') {
            this.router.navigate([this.returnUrl]);
            return;
        }

        if (user?.role === 'resident') {
            this.router.navigate(['/maintenance/history']);
        } else if (user?.role === 'technician') {
            this.router.navigate(['/technician/dashboard']);
        } else if (user?.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
        }
    }
}
