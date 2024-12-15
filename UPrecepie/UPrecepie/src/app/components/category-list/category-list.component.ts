import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../models/category.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string | null = null; 
  @Output() categorySelected = new EventEmitter<string>(); 

  ngOnInit(): void {}

  selectCategory(categoryName: string): void {
    this.categorySelected.emit(categoryName); 
  }
}
