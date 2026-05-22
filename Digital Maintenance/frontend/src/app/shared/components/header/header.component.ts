import { Component } from '@angular/core';
import { AuthService, User } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentUser$: Observable<User | null>;

    constructor(private authService: AuthService, private router: Router) {
        this.currentUser$ = this.authService.currentUser;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
