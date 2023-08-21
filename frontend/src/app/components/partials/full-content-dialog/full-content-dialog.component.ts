import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-full-content-dialog',
  templateUrl: './full-content-dialog.component.html',
  styleUrls: ['./full-content-dialog.component.css']
})
export class FullContentDialogComponent {
  @Input() content: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.content = data.content;
  }
}
