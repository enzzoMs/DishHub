import { Component, effect, input } from "@angular/core";
import {
  combineLatestWith,
  map,
  Observable,
  Subject,
  switchMap,
  timer,
} from "rxjs";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { AsyncPipe } from "@angular/common";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { FormsModule } from "@angular/forms";
import { MenuItem } from "../../../../shared/models/menu-item.model";
import { AppConfig } from "../../../../../config/config-constants";
import { MenuService } from "../../../../shared/services/menu/menu.service";

@Component({
  selector: "dhub-restaurant-menu",
  standalone: true,
  imports: [MenuItemComponent, AsyncPipe, EnumeratePipe, FormsModule],
  templateUrl: "./restaurant-menu.component.html",
  styleUrl: "./restaurant-menu.component.css",
})
export class RestaurantMenuComponent {
  restaurantId = input<number>();

  readonly menuItems$: Observable<MenuItem[]>;
  private readonly menuItemsUpdater$ = new Subject<void>();

  readonly numOfLoadingSkeletons = 3;

  constructor(menuService: MenuService) {
    this.menuItems$ = this.menuItemsUpdater$.asObservable().pipe(
      switchMap(() =>
        menuService.getRestaurantMenu(this.restaurantId()!).pipe(
          combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
          map((loadingResult) => loadingResult[0]),
        ),
      ),
    );

    effect(() => {
      if (this.restaurantId() !== undefined) {
        this.menuItemsUpdater$.next();
      }
    });
  }
}
