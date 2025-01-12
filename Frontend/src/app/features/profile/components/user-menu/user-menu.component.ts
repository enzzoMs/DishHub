import { Component, input, viewChild } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { AppConfig } from "../../../../../config/config-constants";
import { MenuItem } from "../../../../shared/models/menu-item.model";
import { MenuForm, MenuFormConfig } from "../menu-form-config";
import { MenuService } from "../../../../shared/services/menu/menu.service";
import { UserMenuItemComponent } from "../user-menu-item/user-menu-item.component";

@Component({
  selector: "dhub-user-menu",
  standalone: true,
  imports: [
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
    UserMenuItemComponent,
  ],
  templateUrl: "./user-menu.component.html",
  styleUrl: "./user-menu.component.css",
})
export class UserMenuComponent {
  restaurantId = input.required<number>();
  restaurantMenu = input.required<MenuItem[]>();

  createMenuDialog = viewChild.required(FormDialogComponent);

  creationSuccessDialog = viewChild.required(MessageDialogComponent);

  private readonly loadingMenuCreationSubject$ = new BehaviorSubject(false);
  readonly loadingMenuCreation$ =
    this.loadingMenuCreationSubject$.asObservable();

  readonly numOfLoadingSkeletons = 3;

  readonly MenuFormConfig = MenuFormConfig;

  constructor(private readonly menuService: MenuService) {}

  showCreateMenuItemDialog() {
    this.createMenuDialog().showModal();
  }

  itemUpdated(updatedItem: MenuItem) {
    const existingItem = this.restaurantMenu().find(
      (item) => item.id === updatedItem.id,
    );

    if (!existingItem) {
      return;
    }

    existingItem.name = updatedItem.name;
    existingItem.description = updatedItem.description;
    existingItem.price = updatedItem.price;
  }

  itemDeleted(deletedItem: MenuItem) {
    const deletedItemIndex = this.restaurantMenu().findIndex(
      (item) => item.id === deletedItem.id,
    );

    if (deletedItemIndex !== undefined && deletedItemIndex >= 0) {
      this.restaurantMenu().splice(deletedItemIndex, 1);
    }
  }

  createMenuItem(menuForm: MenuForm) {
    const { name, description, price } = menuForm;

    this.loadingMenuCreationSubject$.next(true);

    this.menuService
      .createMenu(this.restaurantId()!, name, description, price)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((item) => {
        this.restaurantMenu()?.splice(0, 0, item);

        this.createMenuDialog().closeDialog();
        this.loadingMenuCreationSubject$.next(false);
        this.creationSuccessDialog().showModal();
      });
  }
}
