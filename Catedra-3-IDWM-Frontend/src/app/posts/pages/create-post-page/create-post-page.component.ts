import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../_shared/components/navbar/navbar.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from '../../../_shared/services/toast.service';
import { ICreatePost } from '../../interfaces/ICreatePost';

@Component({
  selector: 'create-post-page',
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  providers: [PostService],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.css'
})
export class CreatePostPageComponent {
  postService: PostService = inject(PostService);
  toastService: ToastService = inject(ToastService);
  ICreatePost: ICreatePost = { title: '', publicationDate: new Date(), image: null}
  forms: FormGroup = new FormGroup({});
  errors: string[] = [];
  imagePreview: string | null = null;
  selectedImage: File | null = null;

  constructor(private FormBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.FormBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      publicationDate: [ new Date(),
        [Validators.required]],
      image: ['', [Validators.required, this.validateImage]]
    });
  }

  private validateImage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !(control.value instanceof File)) return null; 
  
      const file = control.value as File;
      const validMimeTypes = ['image/png', 'image/jpeg'];
      const validExtensions = ['.png', '.jpg', '.jpeg']; 
      const maxSize = 5 * 1024 * 1024;
  
      const errors: ValidationErrors = {}; 
  
      if (!validMimeTypes.includes(file.type)) { 
        errors['invalidImageFormat'] = true;
      }
  
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExtension) {
        errors['invalidImageFormat'] = true; 
      }
  
      if (file.size > maxSize) { 
        errors['imageTooLarge'] = true; 
      }
  
      return Object.keys(errors).length > 0 ? errors : null; 
    };
  }

  protected getFieldError(fieldName: keyof ICreatePost): string { 
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      invalidImageFormat: 'Solo se permiten archivos .png, .jpeg y .jpg.',
      imageTooLarge: 'La imagen no debe pesar más de 10MB'
    };

    const firstError = Object.keys(control.errors)[0]; 
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.png', '.jpg', '.jpeg']; 
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext)); 
  
      if (!hasValidExtension) {
        this.forms.get('image')?.setErrors({ invalidImageFormat: true });
        this.forms.get('image')?.markAsTouched();
        return;
      }
  
      this.selectedImage = file; 
      this.forms.get('image')?.setValue(file);
      this.forms.get('image')?.markAsTouched();
      this.forms.get('image')?.updateValueAndValidity();
  
      
      const reader = new FileReader(); 
      reader.onload = (e: any) => { 
        this.imagePreview = e.target.result; 
      };
      reader.readAsDataURL(file); 
    }
  }
    
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.forms.get('image')?.setValue(null);
    this.forms.get('image')?.reset();
    this.forms.get('image')?.markAsPristine();
    this.forms.get('image')?.markAsUntouched();
    this.forms.get('image')?.updateValueAndValidity();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async createPost() {
    this.errors = []; 
    if(this.forms.invalid) {
      this.toastService.error('Por favor, complete correctamente el formulario'); 
      return;
    }  
    try {    
      this.ICreatePost.title = this.forms.value.title;
      this.ICreatePost.publicationDate = this.forms.value.publicationDate; 
 
      if (this.selectedImage) { 
        this.ICreatePost.image = this.selectedImage; 
      }

      const response = await this.postService.createPost(this.ICreatePost);
      if (response) { 
        this.forms.reset();
        console.log('Post Creado:', response);
        this.toastService.success('Post creado correctamente'); 
        this.removeImage() 
      } else {
        console.log("Error in createPost page ",this.errors);
        this.errors = this.postService.errors; 
        const lastError = this.errors[this.errors.length - 1]; 
        this.toastService.error(lastError || 'Ocurrio un error desconocido');
      }
    } catch (error: any) {
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado');
      }
      console.log('Error en createPost page', error);
    }
  }
}
