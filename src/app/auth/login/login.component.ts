import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;  // Add this line

  constructor(private apiService: ApiService, private router: Router) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido';
      return;
    }

    this.isLoading = true;  // Add this line
    this.errorMessage = '';  // Clear any previous error messages

    setTimeout(() => {  // Add this timeout
      this.apiService.login(this.email, this.password).subscribe(
        (response: AuthResponse) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          this.isLoading = false;  // Add this line
          this.router.navigate(['/welcome']);
        },
        (error) => {
          this.isLoading = false;  // Add this line
          this.errorMessage = 'Credenciales inválidas. Por favor, verifique sus datos';
        }
      );
    }, 2000);  // 2 second delay
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
