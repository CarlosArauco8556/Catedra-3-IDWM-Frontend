import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'navbar',
  imports: [HttpClientModule, CommonModule],
  providers: [AuthService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);
  toastService: ToastService = inject(ToastService)
  postIconIsHovered = false;
  auhtIconIsHovered = false;
  menuOpenPosts = false;
  menuOpenAuth = false;
  errors: string[] = [];

  constructor(private router: Router){}
  
  toggleMenuPosts(): void{
    this.menuOpenPosts = !this.menuOpenPosts;
    this.menuOpenAuth = false;
  }
  toggleMenuAuth(): void {
    this.menuOpenAuth = !this.menuOpenAuth;
    this.menuOpenPosts = false;
  }

  goToPage(page: string){
    switch(page){
      case 'Login':
        this.router.navigate(['/login'])
        break;
      case 'Register':
        this.router.navigate(['/register'])
        break;
      case 'GetPosts':
        this.router.navigate(['/get-posts'])
        break;
      case 'CreatePost':
        this.router.navigate(['/create-post'])
        break;
    }
  }

  async logOut(){
    try {
      const response = await this.authService.logout();
      if(response){
        this.toastService.success("Cierre de sesión exitoso");
        this.router.navigate(['/home']);
      }else{
        this.errors = this.authService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || "No se pudo cerrar sesión");
      }
    }catch (error: any){
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'No se pudo cerrar sesión';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'No se pudo cerrar sesión');
      }
      console.log('Error in logout', error);
    }
  }
}
