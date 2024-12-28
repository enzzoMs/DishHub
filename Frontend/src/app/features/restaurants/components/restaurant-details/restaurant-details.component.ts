import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { RestaurantProfileComponent } from "../restaurant-profile/restaurant-profile.component";
import { BehaviorSubject, Observable } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { RestaurantsService } from "../../services/restaurants.service";
import { AsyncPipe } from "@angular/common";
import { TabItemComponent } from "../../../../shared/components/tab-item/tab-item.component";
import { TabPanelComponent } from "../../../../shared/components/tab-panel/tab-panel.component";
import { RestaurantReviewsComponent } from "../restaurant-reviews/restaurant-reviews.component";
import { RestaurantMenuComponent } from "../restaurant-menu/restaurant-menu.component";
import { RoutePath } from "../../../../app.routes";
import { ErrorCode } from "../../../error/models/error-codes.model";

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
    private readonly router: Router,
    private readonly restaurantService: RestaurantsService,
  ) {}

  ngOnInit() {
    const restaurantIdParam = this.activatedRoute.snapshot.paramMap.get("id");
    const restaurantId = Number(restaurantIdParam);

    if (restaurantIdParam == null || isNaN(restaurantId)) {
      this.redirectToNotFound();
      return;
    }

    this.restaurantModel$ =
      this.restaurantService.getRestaurantById(restaurantId);
  }

  updateReviewCount(newReviewCount: number) {
    this.reviewCountSubject$.next(newReviewCount);
  }

  redirectToNotFound() {
    this.router.navigate([RoutePath.Error, ErrorCode.NotFound]);
  }
}
