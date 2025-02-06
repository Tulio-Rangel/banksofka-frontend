import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ApiService } from 'src/app/shared/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: 'login', component: LoginComponent }]), FormsModule],
      declarations: [RegisterComponent],
      providers: [ApiService]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.user).toEqual({ name: '', email: '', password: '' })
  });

  it('should validate email correctly', () => {
    expect(component.validateEmail('test@example.com')).toBe(true);
    expect(component.validateEmail('invalid-email')).toBe(false);
  });

  it('should display email error message when email is invalid', () => {
    const loginForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.user.email = 'invalid-email';
    component.user.password = 'validpassword';
    fixture.detectChanges();
    component.onSubmit(loginForm);
    expect(component.errorMessage).toBe('Por favor, ingrese un correo electrónico válido');
  });

  it('should display password error message when password is invalid', () => {
    const loginForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.user.email = 'test@example.com';
    component.user.password = '123';
    fixture.detectChanges();
    component.onSubmit(loginForm);
    expect(component.errorMessage).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('should call apiService.register() when form is valid', () => {
    const registerForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.user.name = 'test-user';
    component.user.email = 'test@example.com';
    component.user.password = 'validpassword';
    spyOn(apiService, 'register').and.callFake(() => of({}));
    component.onSubmit(registerForm);
    fixture.detectChanges();
    expect(apiService.register).toHaveBeenCalledWith(component.user);
    expect(component.errorMessage).toBe('');
  });

  it('should display error message when login fails', () => {
    const registerForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.user.name = 'test-user';
    component.user.email = 'test@example.com';
    component.user.password = 'wrongpassword';
    spyOn(apiService, 'register').and.callFake(() => throwError(() => ({ error: 'Invalid data' })));
    component.onSubmit(registerForm);
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Error en el registro. Por favor, intente nuevamente');
  });
});
