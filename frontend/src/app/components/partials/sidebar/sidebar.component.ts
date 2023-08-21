import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  selectedCategory: string | null = null;
  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  @Output() categorySelected = new EventEmitter<string>();

  
}
