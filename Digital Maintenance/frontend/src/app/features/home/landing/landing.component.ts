import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.currentUser.pipe(map(user => !!user));
  }

  navigateToDashboard() {
    const user = this.authService.currentUserValue;
    if (!user) return;

    if (user.role === 'resident') {
      this.router.navigate(['/maintenance/history']);
    } else if (user.role === 'technician') {
      this.router.navigate(['/technician/dashboard']);
    } else if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
