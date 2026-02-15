import { Component } from '@angular/core';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './core/components/nav-menu/nav-menu.component';

import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [TopBarComponent, RouterOutlet, NavMenuComponent, ToastComponent]
})
export class AppComponent {
  title = 'docX';
}
