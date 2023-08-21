import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlogService } from 'src/app/services/blog.service';
import { BlogPost } from 'src/app/models/blogPost.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {


  public formValue!: FormGroup;
  
  public actionButton: string = 'Add';
  public showUpdateButton: boolean = false;
 
  constructor(
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DialogComponent>,

    @Inject(MAT_DIALOG_DATA) public row: BlogPost
  ) {}

 
  ngOnInit(): void {
    if (this.blogService.showUpdateButton) {
      this.showUpdateButton = true;
    }

    this.formValue = this.formBuilder.group({
      title: ['', Validators.required],
      imagePath: ['', Validators.required],
      content: ['', Validators.required],
      status: ['', Validators.required],
      createdAt: ['', Validators.required],
      technology: ['', Validators.required],
    });
    //setting formvalues for updating action
    if (this.row) {
      this.actionButton = 'Update';
      this.formValue.controls['title'].setValue(this.row.title);
      this.formValue.controls['imagePath'].setValue(this.row.imagePath);
      this.formValue.controls['content'].setValue(this.row.content);
      this.formValue.controls['createdAt'].setValue(this.row.createdAt);
      this.formValue.controls['status'].setValue(this.row.status);
      this.formValue.controls['technology'].setValue(this.row.technology);
    }
  }




   
  updateItem() {
    if (this.formValue.invalid) return;

    const fv = this.formValue.value;
    const post: BlogPost = {
      title: fv.title,
      imagePath: fv.imagePath,
      content: fv.content,
      status: fv.status,
      createdAt: fv.createdAt,
      technology: fv.technology,
      id: this.row.id,  
    };

    this.blogService.updateItemApi(post).subscribe((res: any) => {
      this.formValue.reset();
      this.toastr.success('Product Updated', 'Success');
      
    });
  }

  close() {
  
    this.dialogRef.close(this.formValue);
  }
   
  public errorHandling = (control: string, error: string) => {
    return this.formValue.controls[control].hasError(error);
  };


}
