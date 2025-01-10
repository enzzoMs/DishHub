import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { RestaurantMenuComponent } from "./restaurant-menu.component";
import { of } from "rxjs";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import {
  MenuItem,
  MenuItemCategory,
} from "../../../../shared/models/menu-item.model";
import { AppConfig } from "../../../../../config/config-constants";

describe("RestaurantMenuComponent", () => {
  let component: RestaurantMenuComponent;
  let fixture: ComponentFixture<RestaurantMenuComponent>;

  let restaurantServiceMock: jasmine.SpyObj<RestaurantsService>;

  beforeEach(async () => {
    restaurantServiceMock = jasmine.createSpyObj<RestaurantsService>(
      "RestaurantService",
      ["getRestaurantMenu"],
    );
    restaurantServiceMock.getRestaurantMenu.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RestaurantMenuComponent],
      providers: [
        { provide: RestaurantsService, useValue: restaurantServiceMock },
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
        name: "Item1",
        description: "",
        category: MenuItemCategory.Appetizers,
        price: 1,
      },
      {
        name: "Item2",
        description: "",
        category: MenuItemCategory.Appetizers,
        price: 2,
      },
    ];

    restaurantServiceMock.getRestaurantMenu.and.returnValue(of(testMenu));

    let menuItems: MenuItem[] | undefined;
    component.menuItems$.subscribe((currentMenuItems) => {
      menuItems = currentMenuItems;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);

    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantServiceMock.getRestaurantMenu).toHaveBeenCalledWith(
      newRestaurantId,
    );
    expect(menuItems).toEqual(testMenu);
  }));

  it("should filter menu items by selected category when category changes", fakeAsync(() => {
    const testMenu: MenuItem[] = [
      {
        name: "Item1",
        description: "",
        category: MenuItemCategory.Pasta,
        price: 1,
      },
      {
        name: "Item2",
        description: "",
        category: MenuItemCategory.Appetizers,
        price: 2,
      },
    ];

    restaurantServiceMock.getRestaurantMenu.and.returnValue(of(testMenu));

    let menuItems: MenuItem[] | undefined;
    component.menuItems$.subscribe((currentMenuItems) => {
      menuItems = currentMenuItems;
    });

    const newRestaurantId = 10;
    const testSelectedCategory = MenuItemCategory.Appetizers;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    component.selectedCategory = testSelectedCategory;
    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(menuItems).toEqual(
      testMenu.filter((item) => item.category === testSelectedCategory),
    );
  }));
});
