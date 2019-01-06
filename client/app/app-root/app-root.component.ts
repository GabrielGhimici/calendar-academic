import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOutUser() {
    this.http.post('/api/user/logout', {}).subscribe((_) => {
      document.cookie = 'CAToken = ""';
      this.router.navigate(['./login']);
    })
  }
}
