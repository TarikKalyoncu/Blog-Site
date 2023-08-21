import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmdialogComponent {
  public title: string;
  public message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onConfirm(): void {
   
    this.dialogRef.close(true);
  }

  onDismiss(): void {
 
    this.dialogRef.close(false);
  }
}

 
export class ConfirmDialogModel {

  constructor(public title: string, public message: string) {
  }
}
