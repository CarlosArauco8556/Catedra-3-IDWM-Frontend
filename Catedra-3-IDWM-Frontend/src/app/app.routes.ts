import { Routes } from '@angular/router';
import { authGuard } from './_shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent) 
    },
    {
        path: 'register',
        pathMatch: 'full',
        loadComponent: () => import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
    },
    {
        path: 'create-post',
        pathMatch: 'full',
        loadComponent: () => import('./posts/pages/create-post-page/create-post-page.component').then(m => m.CreatePostPageComponent),
        canActivate: [authGuard],
        data: { roles: ['USER'] }
    },
    {
        path: 'get-posts',
        pathMatch: 'full',
        loadComponent: () => import('./posts/pages/get-posts-page/get-posts-page.component').then(m => m.GetPostsPageComponent),
        canActivate: [authGuard],
        data: { roles: ['USER'] }
    },
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
