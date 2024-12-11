import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantMenuComponent } from "./restaurant-menu.component";
import { RestaurantsService } from "../../services/restaurants.service";
import { of } from "rxjs";
import { MenuItem, MenuItemCategory } from "../../models/menu-item.model";

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

  it("should fetch all menu items when restaurant id changes", () => {
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

    expect(restaurantServiceMock.getRestaurantMenu).toHaveBeenCalledWith(
      newRestaurantId,
    );
    expect(menuItems).toEqual(testMenu);
  });

  it("should filter menu items by selected category when category changes", () => {
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

    expect(menuItems).toEqual(
      testMenu.filter((item) => item.category === testSelectedCategory),
    );
  });
});
