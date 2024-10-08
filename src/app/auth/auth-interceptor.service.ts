import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${adminToken}`
        }
      });
    }
    return next.handle(request);
  }
}
