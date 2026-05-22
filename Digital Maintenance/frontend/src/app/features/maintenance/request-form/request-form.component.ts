import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../../core/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
    requestForm!: FormGroup;
    loading = false;
    error = '';
    selectedFile: File | null = null;
    fileName = '';
    categories: string[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private requestService: RequestService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.requestForm = this.formBuilder.group({
            category: ['', Validators.required],
            description: ['', Validators.required],
            address: ['', Validators.required]
        });

        this.loadCategories();
    }

    loadCategories() {
        this.requestService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.error('Error loading categories:', err);
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.fileName = file.name;
        } else {
            this.selectedFile = null;
            this.fileName = '';
        }
    }

    onSubmit() {
        if (this.requestForm.invalid) {
            return;
        }

        this.loading = true;
        const formData = new FormData();
        formData.append('category', this.requestForm.get('category')!.value);
        formData.append('description', this.requestForm.get('description')!.value);
        formData.append('address', this.requestForm.get('address')!.value);

        if (this.selectedFile) {
            formData.append('media', this.selectedFile);
        }

        this.requestService.createRequest(formData).subscribe({
            next: () => {
                this.snackBar.open('Request submitted successfully', 'Close', { duration: 3000 });
                this.router.navigate(['/maintenance/history']);
            },
            error: error => {
                this.error = error.error?.errors?.[0]?.message || 'Submission failed';
                this.loading = false;
            }
        });
    }
}
