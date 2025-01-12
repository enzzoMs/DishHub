import { TestBed } from "@angular/core/testing";

import { MenuService } from "./menu.service";
import { MenuItem } from "../../models/menu-item.model";
import { firstValueFrom } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";

describe("MenuService", () => {
  let service: MenuService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MenuService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch restaurant menu", async () => {
    const testMenuItems: MenuItem[] = [
      {
        id: 0,
        name: "Burger",
        description: "",
        price: 5,
      },
      {
        id: 1,
        name: "Pizza",
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
