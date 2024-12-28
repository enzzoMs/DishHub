import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {ErrorCode, getErrorCode} from "./models/error-codes.model";
import { RoutePath } from "../../app.routes";

@Component({
  selector: "dhub-error",
  standalone: true,
  imports: [],
  templateUrl: "./error.component.html",
  styleUrl: "./error.component.css",
})
export class ErrorComponent implements OnInit {
  errorCode: ErrorCode | null = null;

  readonly ErrorCode = ErrorCode;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    const errorCodeParam =
      this.activatedRoute.snapshot.paramMap.get("errorCode");

    if (errorCodeParam) {
      const errorCodeNum = Number(errorCodeParam);
      this.errorCode = getErrorCode(errorCodeNum);

      if (this.errorCode !== null) {
        return;
      }
    }

    this.redirectToDefaultError();
  }

  redirectToDefaultError() {
    this.router.navigate([RoutePath.Error]);
  }
}
