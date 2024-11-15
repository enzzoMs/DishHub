import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { RoundToFivePipe } from "../../pipes/round-to-five.pipe";
import { AppStatistics } from "../../models/app-statistics.model";
import { StatisticsService } from "../../services/statistics.service";

@Component({
  selector: "dhub-statistics",
  standalone: true,
  imports: [AsyncPipe, RoundToFivePipe],
  templateUrl: "./statistics.component.html",
  styleUrl: "./statistics.component.css",
})
export class StatisticsComponent {
  readonly appStatistics$: Observable<AppStatistics>;

  constructor( readonly statisticsService: StatisticsService) {
    this.appStatistics$ = statisticsService.appStatistics$;
  }
}
