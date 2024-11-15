import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { AppStatistics } from "../models/app-statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  readonly appStatistics$: Observable<AppStatistics> =
    // TODO: Replace with HTTP call
    new Observable<AppStatistics>((subscriber) => {
      setTimeout(() => {
        subscriber.next({
          usersCount: 31,
          restaurantsCount: 27,
          reviewsCount: 26,
        });
        subscriber.complete();
      }, 400);
    }).pipe(shareReplay(1));
}
