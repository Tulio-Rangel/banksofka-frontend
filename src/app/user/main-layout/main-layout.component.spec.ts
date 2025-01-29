import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComponent } from './main-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MainLayoutComponent]
    });
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain navigation links', () => {
    const links: DebugElement[] = fixture.debugElement.queryAll(By.css('.nav-link'));
    expect(links.length).toBeGreaterThan(0);
  });

  it('should contain a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull();
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('a.logout-link'));
    logoutButton.triggerEventHandler('click', null);
    expect(component.logout).toHaveBeenCalled();
  });
});
