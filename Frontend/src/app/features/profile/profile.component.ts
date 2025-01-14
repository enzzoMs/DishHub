import { Component, viewChild } from "@angular/core";
import { TabPanelComponent } from "../../shared/components/tab-panel/tab-panel.component";
import { TabItemComponent } from "../../shared/components/tab-item/tab-item.component";
import { UserRestaurantsComponent } from "./components/user-restaurants/user-restaurants.component";
import { UserReviewsComponent } from "./components/user-reviews/user-reviews.component";
import { AsyncPipe } from "@angular/common";
import { FormDialogComponent } from "../../shared/components/form-dialog/form-dialog.component";
import { MessageDialogComponent } from "../../shared/components/message-dialog/message-dialog.component";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { AppConfig } from "../../../config/config-constants";
import { AuthForm, AuthFormConfig } from "../auth/components/auth-form-config";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";

@Component({
  selector: "dhub-profile",
  standalone: true,
  imports: [
    TabPanelComponent,
    TabItemComponent,
    UserRestaurantsComponent,
    UserReviewsComponent,
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  updateUserDialog = viewChild.required(FormDialogComponent);
  updateSuccessDialog = viewChild.required<MessageDialogComponent>(
    "updateSuccessDialog",
  );

  private readonly loadingUpdateSubject$ = new BehaviorSubject(false);
  readonly loadingUpdate$ = this.loadingUpdateSubject$.asObservable();

  deleteUserDialog =
    viewChild.required<MessageDialogComponent>("deleteUserDialog");

  private readonly loadingDeleteSubject$ = new BehaviorSubject(false);
  readonly loadingDelete$ = this.loadingDeleteSubject$.asObservable();

  readonly AuthFormConfig = AuthFormConfig;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  showUpdateUserDialog() {
    const initialValue: AuthForm = {
      name: this.userService.getCurrentLoggedInUser()!.userName,
      password: "",
    };

    this.updateUserDialog().showModal(initialValue);
  }

  showDeleteItemDialog() {
    this.deleteUserDialog().showModal();
  }

  updateUser(authForm: AuthForm) {
    const { name, password } = authForm;

    this.loadingUpdateSubject$.next(true);

    this.userService
      .updateUser(name, password)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe(() => {
        this.updateUserDialog().closeDialog();
        this.loadingUpdateSubject$.next(false);
        this.updateSuccessDialog().showModal();
      });
  }

  deleteUser() {
    this.loadingDeleteSubject$.next(true);

    this.userService
      .deleteUser()
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe(() => {
        this.deleteUserDialog().closeDialog();
        this.loadingDeleteSubject$.next(false);

        this.userService.logout();
        this.router.navigate(["/"]);
      });
  }
}
