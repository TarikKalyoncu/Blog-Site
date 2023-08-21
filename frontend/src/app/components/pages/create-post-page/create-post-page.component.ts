import { Component } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BlogPost, Status, Technology } from 'src/app/models/blogPost.model';
import { UploadAdapter } from 'src/app/services/UploadAdapter.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as Editor from '../../../../app/ckCustomBuild/build/ckeditor';
@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.css'],
})
export class CreatePostPageComponent {
  selectedImagePath: string | undefined;
  recaptchaResponse!: string;
  isFileUploaded = false;
  siteKey: string | undefined;
  constructor(private userService: UserService,
    private toastr: ToastrService,  private router: Router,) {
    this.siteKey = '6Lc4cZwnAAAAABKS4VTIF2OoKsKCUYC5eqcxQUSD';
  }

  editorConfig = {
    
    toolbar: {
      items: [
        'AutoImage',
        'Autoformat',
        'Autosave',
        'BlockQuote',
        'Bold',
        'Highlight',
        'CodeBlock',
        'FontBackgroundColor',
        'Essentials',
        'FontColor',
        'FontFamily',
        'FontSize',
        'Heading',
        'Image',
        'ImageCaption',
        'ImageInsert',
        'ImageResize',
        'ImageStyle',
        'ImageToolbar',
        'ImageUpload',
        'Indent',
        'Italic',
        'Link',
        'List',
        'MediaEmbed',
        'Paragraph',
        'Table',
        'TableToolbar',
        'TextTransformation',
        'Underline'
      ]
    },
    
    language: 'tr',
    licenseKey: ''
  };
  























  
  ngOnInit(): void {}
  public Editor: any = Editor;

  title = new FormControl('', [Validators.required, Validators.minLength(25)]);
  department = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  recaptcha = new FormControl('', [Validators.required]);

  
  
  
  getErrorMessagetitle() {
    if (this.title.hasError('required')) {
      return 'Devam etmek için Başlık girmelisiniz';
    }
    if (this.title.hasError('minlength')) {
      return 'Başlık en az 25 karakter uzunluğunda olmalıdır';
    }
    return;
  }
  getErrorMessagedept() {
    if (this.department.hasError('required')) {
      return 'Devam etmek için departman seçmelisiniz';
    }
    return;
  }
  getErrorMessageckeditor() {
    if (this.content.hasError('required')) {
      return 'Devam etmek için içerik girmelisiniz';
    }
    return;
  }
  resolved(captchaResponse: string) {
    
  }

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) {
      return;
    }
  
    const file: File | null = inputElement.files?.[0] || null;
    if (!file) {
      console.error('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    this.userService.uploadBlogImage(formData).subscribe(
      (response) => {
        this.selectedImagePath = response.modifiedFileName;
        console.log('File uploaded successfully. Modified filename:', response.modifiedFileName);
        this.isFileUploaded = true; // Set the flag to indicate that the file has been uploaded
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  
    // Optionally, you can reset the input element
    inputElement.value = '';
  }
  
  onReady(eventData: { plugins: { get: (arg0: string) => { (): any; new(): any; createUploadAdapter: (loader: any) => UploadAdapter; }; }; }) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: { file: Blob; }) {
      return new UploadAdapter(loader);
    };
  }
  

  submitButtonClicked() {
    if (!this.content.valid) {
      this.checkCkEditor = true;
      this.title.markAllAsTouched();
      this.content.markAllAsTouched();
      this.department.markAllAsTouched();
      return;
    }

    const newBlogPost: BlogPost = {
      id: 0,
      title: this.title.value || '',
      imagePath: this.selectedImagePath || '',
      content: this.content.value || '',
      technology: this.department.value as Technology,
      status: Status.Inactive,
    };
    console.log(this.content)

    this.userService.createBlogPost(newBlogPost).subscribe(
      (createdPost) => {
        this.toastr.success('Blog gönderisi başarıyla oluşturuldu', 'Başarılı');
        this.router.navigate(['/blog', 'angular']);
        this.toastr.info('Blog yazınızın yayınlanmadan önce inceleniyor...', 'Bilgi');

      },
      (error) => {
        this.toastr.error('Blog yazısı oluşturulurken hata oluştu', 'Hata');
        // Oluşturulurken hata oluştu
      }
    );
  }
  handleRecaptchaResponse(response: string |any) {
    
  }
  checkCkEditor: any = false;
}
