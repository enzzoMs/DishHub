import { Component } from "@angular/core";
import { HeroComponent } from "./hero/hero.component";
import { FeaturesComponent } from "./features/features.component";

@Component({
  selector: "dhub-home",
  standalone: true,
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}
