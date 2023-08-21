
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { BlogService } from 'src/app/services/blog.service';
import { ConfirmDialogModel, ConfirmdialogComponent } from '../../partials/confirmdialog/confirmdialog.component';
import { FullContentDialogComponent } from '../../partials/full-content-dialog/full-content-dialog.component';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showUpdateButton: boolean = false;

  
  displayedColumns: string[] = ['id', 'title', 'imagePath', 'content', 'creadetAt', 'status', 'technology','action'];

  dataSource!: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  
  private dialogformvalue: any = {}
  

  
  constructor( public dialog: MatDialog, private userService: UserService, private toastr: ToastrService,private blogService:BlogService) {
    
    
   }

  ngOnInit(): void {
   
    this.getItem()
    
  }

 
getItem() {
  this.blogService.getAllBlogPosts()
    .subscribe((res: any) => {
      
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
}
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  editItem(row: any) {
    console.log("bool çalışıyor")
    this.blogService.showUpdateButton = true;
    this.dialog.open(DialogComponent, { width: '50%', data: row }).afterClosed().subscribe((resp: string) => {
     
     this.showUpdateButton=true;
      this.dialogformvalue = resp
       
      this.getItem()
    })
  }

  deleteItem(id: number) {
    console.log(6)
     
    const message = `Are you sure to delete this item?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.blogService.deleteItemApi(id).subscribe(res =>
          
          this.getItem()
        )
      }
    });
  
  }

  openFullContentDialog(row: any) {
    this.dialog.open(FullContentDialogComponent, {
      width: '80%',
      data: { content: row.content }
    });
  }
 
 
  canExit(): boolean {
    if (this.dialogformvalue.touched && this.dialogformvalue.pristine || this.dialogformvalue.touched && this.dialogformvalue.invalid) {
      this.toastr.error('Unsaved Changes', 'Error')
      if (confirm("There are some unsaved changes")) {
        return true
      }
      return false
    }
    return true
  }
}
