import { Component } from "@angular/core";
import { LoginButtonComponent } from "../../../auth/components/login-button/login-button.component";

@Component({
  selector: "dhub-hero",
  standalone: true,
  imports: [LoginButtonComponent],
  templateUrl: "./hero.component.html",
  styleUrl: "./hero.component.css",
})
export class HeroComponent {}
