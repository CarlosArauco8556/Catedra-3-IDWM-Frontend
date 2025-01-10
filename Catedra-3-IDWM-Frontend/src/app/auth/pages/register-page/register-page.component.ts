import { Component, inject } from '@angular/core';
import { LocalStorageService } from '../../../_shared/services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../../_shared/components/navbar/navbar.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAuth } from '../../interfaces/IAuth';
import { ToastService } from '../../../_shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register-page',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NavbarComponent],
  providers: [AuthService, LocalStorageService],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private authService: AuthService = inject(AuthService);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private toastService: ToastService = inject(ToastService);
  IAuth: IAuth = { email: '', password: '' };
  forms!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[0-9])[a-zA-Z0-9]+$')])]
    });
  }

  async onSubmit() {
    console.log('Formulario válido:', this.forms.valid);
    if (this.forms.invalid) {
      console.log('Formulario inválido.');
    }

    try {
      if (this.forms.invalid){
        this.toastService.error('Por favor, complete los campos correctamente.');
        return;
      }
      
      this.IAuth.email = this.forms.value.email;
      this.IAuth.password = this.forms.value.password;

      const response = await this.authService.register(this.IAuth);

      if (response) {
        this.authService.errors = [];
        console.log('usuario:', response);
        this.toastService.success('Usuario registrado correctamente.');
        this.router.navigate(['/login']);
      } else {
        console.log('Error al registrar el usuario', this.authService.errors);
        const lastError = this.authService.errors[this.authService.errors.length - 1];
        this.toastService.error(lastError || 'Error al registrar el usuario.');
        this.forms.get('password')?.reset();
      }
    } catch (error) {
      console.log('Error al registrar el usuario', this.authService.errors);
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.error.message
          this.toastService.error(errorMessage || 'Error al registrar el usuario');
        }
      this.forms.get('password')?.reset();
    }
  }

  get EmailErrors() {
    const email = this.forms.get('email');
    if (email?.invalid && email?.touched) {
      if (email.hasError('required')) {
        return 'El correo es obligatorio.';
      }
      if (email.hasError('email')) {
        return 'El correo debe ser válido.';
      }
    }
    return null;
  }

  get PasswordErrors() {
    const password = this.forms.get('password');
    if (password?.invalid && password?.touched) {
      if (password.hasError('required')) {
        return 'La contraseña es obligatoria.';
      }
      if (password.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
      if (password.hasError('pattern')) {
        return 'La contraseña debe ser alfanumérica y contener al menos un número.';
      }
    }
    return null;
  }
}
