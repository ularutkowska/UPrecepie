import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedInUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}
  get loggedInUser$(): Observable<User | null> {
    return this.loggedInUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<User | null> {
    return new Observable((observer) => {
      this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).subscribe(
        (users) => {
          if (users.length > 0) {
            const user = users[0];
            this.loggedInUserSubject.next(user);
            observer.next(user);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        (error) => {
          console.error('Login error:', error);
          observer.error(error);
        }
      );
    });
  }

  logout(): void {
    this.loggedInUserSubject.next(null);
  }

  getLoggedInUser(): User | null {
    return this.loggedInUserSubject.getValue(); 
  }

  setLoggedInUser(user: User): void {
    this.loggedInUserSubject.next(user);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user);
  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  toggleFavourite(recipeId: string): Observable<User> {
    const loggedInUser = this.loggedInUserSubject.getValue();
    if (!loggedInUser) {
      throw new Error('User not logged in');
    }
  
    const index = loggedInUser.favourite_list.indexOf(recipeId);
    if (index > -1) {
      loggedInUser.favourite_list.splice(index, 1);
    } else {
      loggedInUser.favourite_list.push(recipeId);
    }
  
    return this.http.patch<User>(`${this.apiUrl}/${loggedInUser.id}`, {
      favourite_list: loggedInUser.favourite_list,
    }).pipe(
      tap((updatedUser) => this.loggedInUserSubject.next(updatedUser))
    );
  }
  
  refreshLoggedInUser(): void {
    const currentUser = this.getLoggedInUser();
    if (currentUser) { 
      this.getUserById(currentUser.id).subscribe({
        next: (updatedUser) => {
          if (updatedUser) {
            this.setLoggedInUser(updatedUser);
          }
        },
        error: (error) => {
          console.error('Error refreshing user data:', error);
        },
      });
    } else {
      console.warn('No logged-in user to refresh.');
    }
  }
  
  
  isFavourite(recipeId: string): boolean {
    const loggedInUser = this.loggedInUserSubject.getValue();
    return loggedInUser?.favourite_list.includes(recipeId) || false;
  }
  
  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${user.id}`, user);
  }
  
  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<void> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.patch<void>(url, {
      currentPassword,
      newPassword
    });
  }

  register(newUser: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, newUser);
  }
  
  
}
