import { Component, effect, input } from "@angular/core";
import {
  combineLatestWith,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  timer,
} from "rxjs";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { AsyncPipe } from "@angular/common";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { NgSelectComponent } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import {
  MenuItem,
  MenuItemCategory,
} from "../../../../shared/models/menu-item.model";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { AppConfig } from "../../../../../config/config-constants";

@Component({
  selector: "dhub-restaurant-menu",
  standalone: true,
  imports: [
    MenuItemComponent,
    AsyncPipe,
    EnumeratePipe,
    NgSelectComponent,
    FormsModule,
  ],
  templateUrl: "./restaurant-menu.component.html",
  styleUrl: "./restaurant-menu.component.css",
})
export class RestaurantMenuComponent {
  restaurantId = input<number>();

  readonly menuCategories = [
    MenuItemCategory.Appetizers,
    MenuItemCategory.MainCourse,
    MenuItemCategory.Pasta,
    MenuItemCategory.Beverages,
    MenuItemCategory.Desserts,
  ];

  private _selectedCategory: MenuItemCategory = this.menuCategories[0];

  readonly menuItems$: Observable<MenuItem[]>;
  private readonly menuItemsUpdater$ = new Subject<void>();
  private allMenuItems: MenuItem[] | undefined;

  readonly numOfLoadingSkeletons = 3;

  constructor(restaurantsService: RestaurantsService) {
    this.menuItems$ = this.menuItemsUpdater$.asObservable().pipe(
      switchMap(() => {
        if (this.allMenuItems) {
          return of(this.allMenuItems);
        }
        return restaurantsService.getRestaurantMenu(this.restaurantId()!).pipe(
          combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
          map((loadingResult) => loadingResult[0]),
        );
      }),
      tap((menuItems) => {
        this.allMenuItems = menuItems;
      }),
      map((menuItems) =>
        menuItems.filter(
          (menuItem) => menuItem.category === this._selectedCategory,
        ),
      ),
    );

    effect(() => {
      if (this.restaurantId()) {
        this.allMenuItems = undefined;
        this.menuItemsUpdater$.next();
      }
    });
  }

  get selectedCategory(): MenuItemCategory {
    return this._selectedCategory;
  }

  set selectedCategory(value: MenuItemCategory) {
    this._selectedCategory = value;
    this.menuItemsUpdater$.next();
  }
}
