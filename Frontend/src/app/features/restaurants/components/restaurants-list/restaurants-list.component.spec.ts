import { TestBed } from "@angular/core/testing";

import { RestaurantsListComponent } from "./restaurants-list.component";
import { Restaurant } from "../../models/restaurant.model";
import { of, Subject } from "rxjs";
import { RestaurantsService } from "../../services/restaurants.service";
import { ActivatedRoute, Router } from "@angular/router";

describe("RestaurantsListComponent", () => {
  let component: RestaurantsListComponent;

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

    const fixture = TestBed.createComponent(RestaurantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch restaurants for the first page on initialization", () => {
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

    component.updateRestaurants();

    expect(restaurantsServiceMock.getRestaurantsForPage).toHaveBeenCalledWith(
      1,
      component.pageSize,
    );
    expect(restaurants!).toEqual(mockPaginatedRestaurants.data);
    expect(component.totalItems).toEqual(mockPaginatedRestaurants.totalItems);
  });

  it("should add query params when page changes", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    component.pageChanged(7);

    expect(router.navigate).toHaveBeenCalledOnceWith([], {
      queryParams: {
        page: 7,
      },
      queryParamsHandling: "replace",
    });
  });

  it("should update restaurants when 'page' query param changes", () => {
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

    expect(restaurants!).toEqual(mockPaginatedRestaurants.data);
  });

  it("should navigate to closest valid page when page number is outside bounds", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const closestValidPage = 3;

    component.pageBoundsCorrection(closestValidPage);

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        page: closestValidPage,
      },
      queryParamsHandling: "replace",
    });
  });

  it("should update the loading status when page changes", () => {
    const loadingStatus: boolean[] = [];

    component.loading$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    const paramsMap = new Map<string, string>();
    paramsMap.set("page", "2");

    queryParamsMock$.next(paramsMap);

    expect(loadingStatus.at(-2)).toBeTrue();
    expect(loadingStatus.at(-1)).toBeFalse();
  });

  it("should update pagination range when page changes", () => {
    const newPage = 2;
    const expectedPageStart = (newPage - 1) * component.pageSize + 1;
    const expectedPageEnd = newPage * component.pageSize;

    const paramsMap = new Map<string, string>();
    paramsMap.set("page", newPage.toString());

    queryParamsMock$.next(paramsMap);

    expect(component.pageStart).toBe(expectedPageStart);
    expect(component.pageEnd).toBe(expectedPageEnd);
  });
});
