import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout(): void {
    this.userService.logout();
  }
}
