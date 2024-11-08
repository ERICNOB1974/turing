import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="position: fixed; top: 0; width: 100%; z-index: 1000;">
    </div>
    <div style="margin-top: 70px;">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['../styles.css']
})
export class AppComponent {
  constructor(private router: Router) {}
}