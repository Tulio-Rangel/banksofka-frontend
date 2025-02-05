import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { WelcomeComponent } from 'src/app/user/welcome/welcome.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: 'welcome', component: WelcomeComponent }]), FormsModule],
      declarations: [LoginComponent],
      providers: [ApiService]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should validate email correctly', () => {
    expect(component.validateEmail('test@example.com')).toBe(true);
    expect(component.validateEmail('invalid-email')).toBe(false);
  });

  it('should display email error message when email is invalid', () => {
    const loginForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.email = 'invalid-email';
    component.password = 'validpassword';
    fixture.detectChanges();
    component.onSubmit(loginForm);
    expect(component.errorMessage).toBe('Por favor, ingrese un correo electrónico válido');
  });

  it('should call apiService.login() when form is valid', fakeAsync(() => {
    const loginForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.email = 'test@example.com';
    component.password = 'validpassword';
    spyOn(apiService, 'login').and.callFake(() => of({ token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 }));
    component.onSubmit(loginForm);
    tick(2000);
    fixture.detectChanges();
    expect(apiService.login).toHaveBeenCalledWith('test@example.com', 'validpassword');
    expect(component.errorMessage).toBe('');
  }));

  it('should display error message when login fails', fakeAsync(() => {
    const loginForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    spyOn(apiService, 'login').and.callFake(() => throwError({ error: 'Invalid credentials' }));
    component.onSubmit(loginForm);
    tick(2000);
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Credenciales inválidas. Por favor, verifique sus datos');
  }));

});
