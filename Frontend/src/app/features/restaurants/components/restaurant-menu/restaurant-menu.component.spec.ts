import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { RestaurantMenuComponent } from "./restaurant-menu.component";
import { of } from "rxjs";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { MenuItem } from "../../../../shared/models/menu-item.model";
import { AppConfig } from "../../../../../config/config-constants";
import { MenuService } from "../../../../shared/services/menu/menu.service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("RestaurantMenuComponent", () => {
  let component: RestaurantMenuComponent;
  let fixture: ComponentFixture<RestaurantMenuComponent>;

  let menuServiceMock: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    menuServiceMock = jasmine.createSpyObj<MenuService>("menuService", [
      "getRestaurantMenu",
    ]);
    menuServiceMock.getRestaurantMenu.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RestaurantMenuComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MenuService, useValue: menuServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantMenuComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch all menu items when restaurant id changes", fakeAsync(() => {
    const testMenu: MenuItem[] = [
      {
        id: 0,
        name: "Item1",
        description: "",
        price: 1,
      },
      {
        id: 1,
        name: "Item2",
        description: "",
        price: 2,
      },
    ];

    menuServiceMock.getRestaurantMenu.and.returnValue(of(testMenu));

    let menuItems: MenuItem[] | undefined;
    component.menuItems$.subscribe((currentMenuItems) => {
      menuItems = currentMenuItems;
    });

    const restaurantId = 10;

    fixture.componentRef.setInput("restaurantId", restaurantId);
    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(menuServiceMock.getRestaurantMenu).toHaveBeenCalledWith(
      restaurantId,
    );
    expect(menuItems).toEqual(testMenu);
  }));
});
