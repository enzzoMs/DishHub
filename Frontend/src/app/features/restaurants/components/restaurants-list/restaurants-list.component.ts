import { Component, OnInit } from "@angular/core";
import { RestaurantsService } from "../../services/restaurants.service";
import { BehaviorSubject, map, Observable, switchMap, tap } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { AsyncPipe } from "@angular/common";
import { RestaurantItemComponent } from "../restaurant-item/restaurant-item.component";
import { NgxPaginationModule } from "ngx-pagination";
import { ActivatedRoute, Router } from "@angular/router";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";

@Component({
  selector: "dhub-restaurants-list",
  standalone: true,
  imports: [
    AsyncPipe,
    RestaurantItemComponent,
    NgxPaginationModule,
    EnumeratePipe,
  ],
  templateUrl: "./restaurants-list.component.html",
  styleUrl: "./restaurants-list.component.css",
})
export class RestaurantsListComponent implements OnInit {
  totalItems = 0;
  pageStart = 0;
  pageEnd = 0;

  readonly pageSize = 4;
  currentPage = 1;

  readonly restaurants$: Observable<Restaurant[]>;
  private restaurantsUpdater$ = new BehaviorSubject<null>(null);

  private loadingSubject$ = new BehaviorSubject(true);
  loading$ = this.loadingSubject$.asObservable();

  constructor(
    restaurantService: RestaurantsService,
    activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.restaurants$ = this.restaurantsUpdater$.asObservable().pipe(
      switchMap(() =>
        restaurantService.getRestaurantsForPage(
          this.currentPage,
          this.pageSize,
        ),
      ),
      tap((paginatedRestaurants) => {
        this.totalItems = paginatedRestaurants.totalItems;
        this.loadingSubject$.next(false);
      }),
      map((paginatedRestaurants) => paginatedRestaurants.data)
    );

    this.updatePaginationRange();

    activatedRoute.queryParamMap.subscribe((paramMap) => {
      if (paramMap.has("page")) {
        this.currentPage = parseInt(paramMap.get("page")!, 10);

        this.updatePaginationRange();
        window.scrollTo(0, 0);

        this.loadingSubject$.next(true);
        this.updateRestaurants();
      }
    });
  }

  ngOnInit() {
    this.updateRestaurants();
  }

  pageChanged(pageNumber: number) {
    this.router.navigate([], {
      queryParams: {
        page: pageNumber,
      },
      queryParamsHandling: "replace",
    });
  }

  pageBoundsCorrection(closestValidPage: number) {
    this.pageChanged(closestValidPage);
  }

  updateRestaurants() {
    this.restaurantsUpdater$.next(null);
  }

  private updatePaginationRange() {
    this.pageStart = (this.currentPage - 1) * this.pageSize + 1;
    this.pageEnd = this.currentPage * this.pageSize;
  }
}
