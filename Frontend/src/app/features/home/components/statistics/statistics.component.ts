import { Component } from "@angular/core";
import { combineLatestWith, map, Observable, timer } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { AppStatistics } from "../../models/app-statistics.model";
import { StatisticsService } from "../../services/statistics.service";
import { RoundToFivePipe } from "../../../../shared/pipes/round-to-five/round-to-five.pipe";
import { AppConfig } from "../../../../../config/config-constants";

@Component({
  selector: "dhub-statistics",
  standalone: true,
  imports: [AsyncPipe, RoundToFivePipe],
  templateUrl: "./statistics.component.html",
  styleUrl: "./statistics.component.css",
})
export class StatisticsComponent {
  readonly appStatistics$: Observable<AppStatistics>;

  constructor(readonly statisticsService: StatisticsService) {
    this.appStatistics$ = statisticsService.appStatistics$.pipe(
      combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
      map((loadingResult) => loadingResult[0]),
    );
  }
}
