import { Component, OnInit } from "@angular/core";
import { RestaurantsService } from "../../services/restaurants.service";
import { BehaviorSubject, map, Observable, switchMap, timer, zip } from "rxjs";
import { Restaurant } from "../../models/restaurant.model";
import { AsyncPipe } from "@angular/common";
import { RestaurantItemComponent } from "../restaurant-item/restaurant-item.component";
import { NgxPaginationModule } from "ngx-pagination";
import { ActivatedRoute, Router } from "@angular/router";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { RestaurantFilters } from "../../models/restaurant-filters.model";

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
  pageStartIndex = 0;
  pageEndIndex = 0;

  readonly pageSize = 4;
  currentPage = 1;

  readonly restaurants$: Observable<Restaurant[]>;
  private restaurantsUpdater$ = new BehaviorSubject<void>(undefined);

  private loadingSubject$ = new BehaviorSubject(true);
  loading$ = this.loadingSubject$.asObservable();

  private readonly minLoadingTimeMs = 800;

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
        zip(
          timer(this.minLoadingTimeMs),
          restaurantService.getRestaurantsForPage(
            this.currentPage,
            this.pageSize,
            this.restaurantsFilters,
          ),
        ),
      ),
      map((updateResult) => {
        const paginatedRestaurants = updateResult[1];

        this.totalItems = paginatedRestaurants.totalItems;
        this.updatePaginationRange();
        this.loadingSubject$.next(false);

        return paginatedRestaurants.data;
      }),
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
    if (this.totalItems === 0) {
      this.pageStartIndex = 0;
      this.pageEndIndex = 0;
      return;
    }

    const newPageStartIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.pageStartIndex =
      newPageStartIndex > this.totalItems ? this.totalItems : newPageStartIndex;

    const newPageEndIndex = this.currentPage * this.pageSize;
    this.pageEndIndex =
      newPageEndIndex > this.totalItems ? this.totalItems : newPageEndIndex;
  }
}
