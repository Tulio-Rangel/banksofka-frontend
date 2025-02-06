import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API with correct data', () => {
    const mockResponse = { token: 'fake-jwt-token', id: 1, email: 'test@example.com', name: 'password123' };
    service.login('test@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush(mockResponse);
  });

  it('should call register API with correct user data', () => {
    const mockUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    service.register(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush({});
  });

  it('should include Authorization header in authenticated requests', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt-token');
    service.getUserAccounts(1).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/users/1/accounts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
    req.flush([]);
  });

  it('should call getTransactionsHistory with correct account ID', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt-token');
    service.getTransactionsHistory('12345').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/accounts/12345/transactions');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call createDeposit with correct parameters', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt-token');
    service.createDeposit('12345', 1000).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/accounts/12345/deposit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(1000);
    req.flush({});
  });

  it('should call createWithdrawal with correct parameters', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt-token');
    service.createWithdrawal('12345', 500).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/accounts/12345/withdrawal');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(500);
    req.flush({});
  });
});
