import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RestaurantProfileComponent } from "../restaurant-profile/restaurant-profile.component";
import { BehaviorSubject, Observable } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { RestaurantsService } from "../../services/restaurants.service";
import { AsyncPipe } from "@angular/common";
import { TabItemComponent } from "../../../../shared/components/tab-item/tab-item.component";
import { TabPanelComponent } from "../../../../shared/components/tab-panel/tab-panel.component";
import { RestaurantReviewsComponent } from "../restaurant-reviews/restaurant-reviews.component";
import { RestaurantMenuComponent } from "../restaurant-menu/restaurant-menu.component";

@Component({
  selector: "dhub-restaurant-details",
  standalone: true,
  imports: [
    RouterLink,
    RestaurantProfileComponent,
    AsyncPipe,
    TabItemComponent,
    TabPanelComponent,
    RestaurantReviewsComponent,
    RestaurantMenuComponent,
  ],
  templateUrl: "./restaurant-details.component.html",
  styleUrl: "./restaurant-details.component.css",
})
export class RestaurantDetailsComponent implements OnInit {
  restaurantModel$: Observable<Restaurant> | undefined;

  private readonly reviewCountSubject$ = new BehaviorSubject(0);
  readonly reviewCount$ = this.reviewCountSubject$.asObservable();

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

  updateReviewCount(newReviewCount: number) {
    this.reviewCountSubject$.next(newReviewCount);
  }
}
