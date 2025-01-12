import { Component, input, output, viewChild } from "@angular/core";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { AppConfig } from "../../../../../config/config-constants";
import { MenuItem } from "../../../../shared/models/menu-item.model";
import { MenuForm, MenuFormConfig } from "../menu-form-config";
import { MenuService } from "../../../../shared/services/menu/menu.service";

@Component({
  selector: "dhub-user-menu-item",
  standalone: true,
  imports: [
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
    CurrencyPipe,
  ],
  templateUrl: "./user-menu-item.component.html",
  styleUrl: "./user-menu-item.component.css",
})
export class UserMenuItemComponent {
  restaurantId = input.required<number>();
  menuItemModel = input.required<MenuItem>();

  updateItemDialog = viewChild.required(FormDialogComponent);
  updateSuccessDialog = viewChild.required<MessageDialogComponent>(
    "updateSuccessDialog",
  );

  itemUpdated = output<MenuItem>();

  private readonly loadingUpdateSubject$ = new BehaviorSubject(false);
  readonly loadingUpdate$ = this.loadingUpdateSubject$.asObservable();

  deleteItemDialog =
    viewChild.required<MessageDialogComponent>("deleteItemDialog");
  deleteSuccessDialog = viewChild.required<MessageDialogComponent>(
    "deleteSuccessDialog",
  );

  itemDeleted = output<MenuItem>();

  private readonly loadingDeleteSubject$ = new BehaviorSubject(false);
  readonly loadingDelete$ = this.loadingDeleteSubject$.asObservable();

  readonly MenuFormConfig = MenuFormConfig;

  constructor(private readonly menuService: MenuService) {}

  showUpdateItemDialog() {
    const initialValue: MenuForm = {
      name: this.menuItemModel().name,
      description: this.menuItemModel().description,
      price: this.menuItemModel().price,
    };

    this.updateItemDialog().showModal(initialValue);
  }

  showDeleteItemDialog() {
    this.deleteItemDialog().showModal();
  }

  updateItem(menuForm: MenuForm) {
    const { name, description, price } = menuForm;

    this.loadingUpdateSubject$.next(true);

    this.menuService
      .updateMenu(
        this.restaurantId(),
        this.menuItemModel().id,
        name,
        description,
        price,
      )
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((item) => {
        this.itemUpdated.emit(item);

        this.updateItemDialog().closeDialog();
        this.loadingUpdateSubject$.next(false);
        this.updateSuccessDialog().showModal();
      });
  }

  deleteItem() {
    this.loadingDeleteSubject$.next(true);

    this.menuService
      .deleteMenu(this.restaurantId(), this.menuItemModel().id)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe(() => {
        this.itemDeleted.emit(this.menuItemModel());

        this.deleteItemDialog().closeDialog();
        this.loadingDeleteSubject$.next(false);
        this.deleteSuccessDialog().showModal();
      });
  }
}
