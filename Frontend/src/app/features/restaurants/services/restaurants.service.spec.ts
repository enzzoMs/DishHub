import { TestBed } from "@angular/core/testing";

import { RestaurantsService } from "./restaurants.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { Restaurant } from "../models/restaurant.model";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { firstValueFrom } from "rxjs";
import { RestaurantFilters } from "../models/restaurant-filters.model";
import { Review } from "../models/review.model";
import { MenuItem, MenuItemCategory } from "../models/menu-item.model";
import {
  API_PAGINATION_HEADER,
  PaginationMetadata,
} from "../../../../api/pagination-metadata.model";

describe("RestaurantsService", () => {
  let service: RestaurantsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RestaurantsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch restaurant by id", async () => {
    const testRestaurant: Restaurant = {
      id: 0,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    const restaurantPromise = firstValueFrom(
      service.getRestaurantById(testRestaurant.id),
    );

    const request = httpTesting.expectOne({
      method: "GET",
      url: apiEndpoints.getRestaurantById(testRestaurant.id),
    });

    request.flush(testRestaurant);

    expect(await restaurantPromise).toEqual(testRestaurant);
  });

  it("should fetch restaurants with pagination and filters", async () => {
    const testRestaurants: Restaurant[] = [
      {
        id: 0,
        name: "Restaurant",
        description: "",
        location: "Pasta Lane",
        score: 4,
      },
    ];
    const testFilters: RestaurantFilters = {
      name: "Restaurant",
      location: null,
      score: { value: 4 },
    };

    const page = 1;
    const pageSize = 3;

    const paginationMetadata: PaginationMetadata = {
      pageIndex: page,
      pageSize: pageSize,
      totalItems: testRestaurants.length,
      previousPageUrl: null,
      nextPageUrl: null,
    };

    const restaurantsPromise = firstValueFrom(
      service.getRestaurantsForPage(page, pageSize, testFilters),
    );

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url:
        `${apiEndpoints.getRestaurants()}?page=${page}&pageSize=${pageSize}&` +
        `name=${testFilters.name}&score=${testFilters.score.value}`,
    });

    testRequest.flush(testRestaurants, {
      headers: {
        [API_PAGINATION_HEADER]: JSON.stringify(paginationMetadata),
      },
    });

    const paginatedRestaurants = await restaurantsPromise;
    expect(paginatedRestaurants.data).toEqual(testRestaurants);
    expect(paginatedRestaurants.totalItems).toEqual(testRestaurants.length);
    expect(paginatedRestaurants.pageNumber).toEqual(page);
  });

  it("should fetch restaurants reviews with pagination", async () => {
    const testReviews: Review[] = [
      {
        userName: "",
        comment: "",
        rating: 5,
        date: new Date(),
      },
    ];

    const page = 1;
    const pageSize = 3;
    const testRestaurantId = 0;

    const paginationMetadata: PaginationMetadata = {
      pageIndex: page,
      pageSize: pageSize,
      totalItems: testReviews.length,
      previousPageUrl: null,
      nextPageUrl: null,
    };

    const reviewsPromise = firstValueFrom(
      service.getRestaurantReviews(testRestaurantId, page, pageSize),
    );

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url: `${apiEndpoints.getRestaurantReviews(testRestaurantId)}?page=${page}&pageSize=${pageSize}`,
    });

    testRequest.flush(testReviews, {
      headers: {
        [API_PAGINATION_HEADER]: JSON.stringify(paginationMetadata),
      },
    });

    const paginatedReviews = await reviewsPromise;
    expect(paginatedReviews.data).toEqual(testReviews);
    expect(paginatedReviews.totalItems).toEqual(testReviews.length);
    expect(paginatedReviews.pageNumber).toEqual(page);
  });

  it("should fetch restaurant menu", async () => {
    const testMenuItems: MenuItem[] = [
      {
        name: "Burger",
        category: MenuItemCategory.MainCourse,
        description: "",
        price: 5,
      },
      {
        name: "Pizza",
        category: MenuItemCategory.MainCourse,
        description: "",
        price: 8,
      },
    ];

    const testRestaurantId = 0;

    const menuPromise = firstValueFrom(
      service.getRestaurantMenu(testRestaurantId),
    );

    const request = httpTesting.expectOne({
      method: "GET",
      url: apiEndpoints.getRestaurantMenu(testRestaurantId),
    });

    request.flush(testMenuItems);

    expect(await menuPromise).toEqual(testMenuItems);
  });
});
