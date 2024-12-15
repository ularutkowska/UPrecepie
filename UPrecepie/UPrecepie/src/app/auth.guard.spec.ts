import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    
    mockUserService = jasmine.createSpyObj('UserService', ['getLoggedInUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule], 
      providers: [
        AuthGuard,
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard); 
  });

  it('should allow activation if user is logged in', () => {
    
    const result = guard.canActivate();

    expect(result).toBeTrue(); 
    expect(mockRouter.navigate).not.toHaveBeenCalled(); 
  });

  it('should block activation and redirect if user is not logged in', () => {
    
    mockUserService.getLoggedInUser.and.returnValue(null);

    const result = guard.canActivate();

    expect(result).toBeFalse(); // Powinien zablokować dostęp
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
