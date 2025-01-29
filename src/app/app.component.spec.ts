import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
    declarations: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should contain app-global-notifications', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-global-notifications')).toBeTruthy();
  });
});
