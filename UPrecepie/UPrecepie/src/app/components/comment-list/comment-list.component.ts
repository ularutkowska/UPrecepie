import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Input() isLoggedIn: boolean = false;
  @Output() commentEdited = new EventEmitter<Comment>();
  @Output() commentDeleted = new EventEmitter<string>();
  
  constructor(private userService: UserService) {}

  isOwner(comment: Comment): boolean {
    const loggedInUser = this.userService.getLoggedInUser();
    return loggedInUser?.id === comment.userId;
  }

  editComment(comment: Comment): void {
    const newContent = prompt('Edit your comment:', comment.content);
    if (newContent && newContent.trim() !== comment.content) {
      const updatedComment = { ...comment, content: newContent.trim() };
      this.commentEdited.emit(updatedComment);
    }
  }
  
  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentDeleted.emit(commentId);
    }
  }
  
}
