import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XsfrHttpInterceptor implements HttpInterceptor {
  constructor(private tokenService: HttpXsrfTokenExtractor) {}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lcUrl = req.url.toLowerCase();
    const token = this.tokenService.getToken();

    if (lcUrl.startsWith('http://') || lcUrl.startsWith('https://')) {
      return next.handle(req);
    }

    if (token !== null && !req.headers.has('Authorization')) {
      req = req.clone({headers: req.headers.set('Authorization', token)});
    }
    return next.handle(req);
  }
}
