import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { AppStatistics } from "../models/app-statistics.model";
import { HttpClient } from "@angular/common/http";
import { apiEndpoints } from "../../../../api/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  readonly appStatistics$: Observable<AppStatistics>;

  constructor(http: HttpClient) {
    this.appStatistics$ = http
      .get<AppStatistics>(apiEndpoints.getAppStatistics())
      .pipe(shareReplay(1));
  }
}
