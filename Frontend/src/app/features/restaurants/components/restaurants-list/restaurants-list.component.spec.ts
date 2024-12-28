import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { RestaurantsListComponent } from "./restaurants-list.component";
import { Restaurant } from "../../models/restaurant.model";
import { of, Subject } from "rxjs";
import { RestaurantsService } from "../../services/restaurants.service";
import { ActivatedRoute, Router } from "@angular/router";
import {AppConfig} from "../../../../../config/config-constants";

describe("RestaurantsListComponent", () => {
  let component: RestaurantsListComponent;
  let fixture: ComponentFixture<RestaurantsListComponent>;

  const queryParamsMock$ = new Subject<Map<string, string>>();

  let restaurantsServiceMock: jasmine.SpyObj<RestaurantsService>;

  beforeEach(async () => {
    restaurantsServiceMock = jasmine.createSpyObj<RestaurantsService>(
      "restaurantService",
      ["getRestaurantsForPage"],
    );
    restaurantsServiceMock.getRestaurantsForPage.and.returnValue(
      of({
        totalItems: 0,
        pageNumber: 1,
        data: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [RestaurantsListComponent],
      providers: [
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamsMock$,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantsListComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch restaurants for the first page on initialization", fakeAsync(() => {
    const mockPaginatedRestaurants = {
      totalItems: 10,
      pageNumber: 1,
      data: [
        { id: 1, name: "", description: "", location: "", score: 0 },
        { id: 2, name: "", description: "", location: "", score: 0 },
      ],
    };
    restaurantsServiceMock.getRestaurantsForPage.and.returnValue(
      of(mockPaginatedRestaurants),
    );

    let restaurants: Restaurant[] | undefined = undefined;

    component.restaurants$.subscribe((currentRestaurants) => {
      restaurants = currentRestaurants;
    });

    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantsServiceMock.getRestaurantsForPage).toHaveBeenCalledWith(
      1,
      component.pageSize,
      jasmine.any(Object),
    );
    expect(restaurants!).toEqual(mockPaginatedRestaurants.data);
    expect(component.totalItems).toEqual(mockPaginatedRestaurants.totalItems);
  }));

  it("should add query params when page changes", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    component.pageChanged(7);

    expect(router.navigate).toHaveBeenCalledOnceWith([], {
      queryParams: {
        page: 7,
      },
      queryParamsHandling: "merge",
    });
  });

  it("should update restaurants when 'page' query param changes", fakeAsync(() => {
    const mockPaginatedRestaurants = {
      totalItems: 10,
      pageNumber: 2,
      data: [
        { id: 3, name: "", description: "", location: "", score: 0 },
        { id: 4, name: "", description: "", location: "", score: 0 },
      ],
    };
    restaurantsServiceMock.getRestaurantsForPage.and.returnValue(
      of(mockPaginatedRestaurants),
    );

    let restaurants: Restaurant[] | undefined = undefined;

    component.restaurants$.subscribe((currentRestaurants) => {
      restaurants = currentRestaurants;
    });

    const paramsMap = new Map<string, string>();
    paramsMap.set("page", "2");

    queryParamsMock$.next(paramsMap);

    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurants!).toEqual(mockPaginatedRestaurants.data);
  }));

  it("should update restaurant filters when query params change", fakeAsync(() => {
    const nameFilter = "Luna Bistro";
    const locationFilter = "Pasta Lane";
    const scoreFilter = 4;

    const paramsMap = new Map<string, string>();
    paramsMap.set("name", nameFilter);
    paramsMap.set("location", locationFilter);
    paramsMap.set("score", scoreFilter.toString());

    queryParamsMock$.next(paramsMap);

    fixture.detectChanges();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantsServiceMock.getRestaurantsForPage).toHaveBeenCalledWith(
      jasmine.anything(),
      jasmine.anything(),
      {
        name: nameFilter,
        location: locationFilter,
        score: { value: scoreFilter },
      },
    );
  }));

  it("should navigate to closest valid page when page number is outside bounds", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const closestValidPage = 3;

    component.pageBoundsCorrection(closestValidPage);

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        page: closestValidPage,
      },
      queryParamsHandling: "merge",
    });
  });

  it("should update the loading status when page changes", fakeAsync(() => {
    const loadingStatus: boolean[] = [];

    component.loading$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    const paramsMap = new Map<string, string>();
    paramsMap.set("page", "2");

    queryParamsMock$.next(paramsMap);

    fixture.detectChanges();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-2)).toBeTrue();
    expect(loadingStatus.at(-1)).toBeFalse();
  }));

  it("should update pagination range when page changes", fakeAsync(() => {
    const totalItems = 10;
    const mockPaginatedRestaurants = {
      totalItems: totalItems,
      pageNumber: 1,
      data: [],
    };
    restaurantsServiceMock.getRestaurantsForPage.and.returnValue(
      of(mockPaginatedRestaurants),
    );

    const newPage = 2;

    let expectedPageStart = (newPage - 1) * component.pageSize + 1;
    expectedPageStart =
      expectedPageStart > totalItems ? totalItems : expectedPageStart;

    let expectedPageEnd = newPage * component.pageSize;
    expectedPageEnd =
      expectedPageEnd > totalItems ? totalItems : expectedPageEnd;

    const paramsMap = new Map<string, string>();
    paramsMap.set("page", newPage.toString());

    queryParamsMock$.next(paramsMap);

    fixture.detectChanges();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(component.pageStartIndex).toBe(expectedPageStart);
    expect(component.pageEndIndex).toBe(expectedPageEnd);
  }));
});
