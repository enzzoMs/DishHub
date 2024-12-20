import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorCode } from "./models/ErrorCodes.model";
import { RoutePaths } from "../../app.routes";

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

    if (errorCodeParam != null) {
      const errorCodeNum = Number(errorCodeParam);

      this.errorCode = isNaN(errorCodeNum) ? null : errorCodeNum;
    }

    this.redirectToNotFound();
  }

  redirectToNotFound() {
    this.router.navigate([RoutePaths.Error, ErrorCode.NotFound]);
  }
}
