import { Component } from "@angular/core";
import { RestaurantsFilterComponent } from "./components/restaurants-filter/restaurants-filter.component";
import { RestaurantsListComponent } from "./components/restaurants-list/restaurants-list.component";

@Component({
  selector: "dhub-restaurants",
  standalone: true,
  imports: [RestaurantsFilterComponent, RestaurantsListComponent],
  templateUrl: "./restaurants.component.html",
  styleUrl: "./restaurants.component.css",
})
export class RestaurantsComponent {}
