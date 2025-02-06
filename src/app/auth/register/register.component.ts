import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { User } from '../../shared/models/user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private readonly apiService: ApiService, private readonly router: Router) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.validateEmail(this.user.email)) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido';
      return;
    }

    this.apiService.register(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error en el registro. Por favor, intente nuevamente';
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
