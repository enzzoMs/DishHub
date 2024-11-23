import { Component } from '@angular/core';
import {RestaurantsFilterComponent} from "./components/restaurants-filter/restaurants-filter.component";

@Component({
  selector: "dhub-restaurants",
  standalone: true,
  imports: [RestaurantsFilterComponent],
  templateUrl: "./restaurants.component.html",
  styleUrl: "./restaurants.component.css",
})
export class RestaurantsComponent {}
