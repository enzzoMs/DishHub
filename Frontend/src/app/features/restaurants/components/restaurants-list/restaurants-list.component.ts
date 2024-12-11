import { Component, OnInit } from "@angular/core";
import { RestaurantsService } from "../../services/restaurants.service";
import { BehaviorSubject, map, Observable, switchMap, tap } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { AsyncPipe } from "@angular/common";
import { RestaurantItemComponent } from "../restaurant-item/restaurant-item.component";
import { NgxPaginationModule } from "ngx-pagination";
import { ActivatedRoute, Router } from "@angular/router";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { RestaurantFilters } from "../../models/restaurant-filter.model";

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
  private restaurantsUpdater$ = new BehaviorSubject<void>(undefined);

  private loadingSubject$ = new BehaviorSubject(true);
  loading$ = this.loadingSubject$.asObservable();

  private restaurantsFilters: RestaurantFilters = {
    name: null,
    location: null,
    score: { value: null },
  };

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
          this.restaurantsFilters
        ),
      ),
      tap((paginatedRestaurants) => {
        this.totalItems = paginatedRestaurants.totalItems;
        this.updatePaginationRange();
        this.loadingSubject$.next(false);
      }),
      map((paginatedRestaurants) => paginatedRestaurants.data),
    );

    this.updatePaginationRange();

    activatedRoute.queryParamMap.subscribe((paramMap) => {
      const pageNumberParam = parseInt(paramMap.get("page")!, 10);
      this.currentPage = isNaN(pageNumberParam) ? 1 : pageNumberParam;

      this.restaurantsFilters.name = paramMap.get("name");
      this.restaurantsFilters.location = paramMap.get("location");

      const scoreParam = parseInt(paramMap.get("score")!, 10);
      this.restaurantsFilters.score = {
        value: isNaN(scoreParam) ? null : scoreParam,
      };

      window.scrollTo(0, 0);

      this.loadingSubject$.next(true);
      this.updateRestaurants();
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
      queryParamsHandling: "merge",
    });
  }

  pageBoundsCorrection(closestValidPage: number) {
    this.pageChanged(closestValidPage);
  }

  updateRestaurants() {
    this.restaurantsUpdater$.next();
  }

  private updatePaginationRange() {
    const newPageStart = (this.currentPage - 1) * this.pageSize + 1;
    this.pageStart = newPageStart > this.totalItems ? this.totalItems : newPageStart;

    const newPageEnd = this.currentPage * this.pageSize;
    this.pageEnd = newPageEnd > this.totalItems ? this.totalItems : newPageEnd;
  }
}
