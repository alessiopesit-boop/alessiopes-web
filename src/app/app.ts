import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/nav/nav';
import { Footer } from './shared/footer/footer';
import { CookieBanner } from './shared/cookie-banner/cookie-banner';
import { PageLoader } from './shared/page-loader/page-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, CookieBanner, PageLoader],
  templateUrl: './app.html',
})
export class App {}
