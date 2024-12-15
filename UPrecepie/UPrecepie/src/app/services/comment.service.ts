import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments'; 

  constructor(private http: HttpClient) {}

  getCommentsByRecipeId(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?recipeId=${recipeId}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${comment.id}`, comment);
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
  
    getNextCommentId(): Observable<string> {
    return new Observable((observer) => {
      this.http.get<Comment[]>(this.apiUrl).subscribe(
        (comments) => {
          const nextId =
            comments.length > 0
              ? (Math.max(...comments.map((c) => parseInt(c.id, 10) || 0)) + 1).toString()
              : '1';
          observer.next(nextId);
          observer.complete();
        },
        (error) => {
          console.error('Error fetching comments:', error);
          observer.error(error);
        }
      );
    });
  }
}
