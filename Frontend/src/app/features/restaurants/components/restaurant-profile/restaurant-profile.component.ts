import { Component, OnInit } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { Observable } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { ActivatedRoute } from "@angular/router";
import { RestaurantsService } from "../../services/restaurants.service";

@Component({
  selector: "dhub-restaurant-profile",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./restaurant-profile.component.html",
  styleUrl: "./restaurant-profile.component.css",
})
export class RestaurantProfileComponent implements OnInit {
  restaurantModel$: Observable<Restaurant> | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly restaurantService: RestaurantsService,
  ) {}

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    const restaurantId = parseInt(routeParams.get("id")!, 10);

    this.restaurantModel$ =
      this.restaurantService.getRestaurantById(restaurantId);
  }
}
