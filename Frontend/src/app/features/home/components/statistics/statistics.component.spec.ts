import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import { StatisticsComponent } from "./statistics.component";
import { StatisticsService } from "../../services/statistics.service";
import { Subject } from "rxjs";
import { AppStatistics } from "../../models/app-statistics.model";
import { RoundToFivePipe } from "../../../../shared/pipes/round-to-five/round-to-five.pipe";
import {AppConfig} from "../../../../../config/config-constants";
import {By} from "@angular/platform-browser";

describe("StatisticsComponent", () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let nativeElement: HTMLElement;

  const testStatistics$ = new Subject<AppStatistics | undefined>();

  beforeEach(async () => {
    const statisticsServiceSpy: jasmine.SpyObj<StatisticsService> = jasmine.createSpyObj(
      "statisticsServiceSpy",
      [],
      { appStatistics$: testStatistics$ },
    );

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should display the app statistics", fakeAsync(() => {
    const newTestStatistics: AppStatistics = {
      usersCount: 35,
      restaurantsCount: 25,
      reviewsCount: 15,
    };

    fixture.detectChanges();

    testStatistics$.next(newTestStatistics);

    tick(AppConfig.MIN_LOADING_TIME_MS);

    fixture.detectChanges();

    const statisticsSpans =
      nativeElement.querySelectorAll<HTMLSpanElement>(".statistic-count");

    expect(statisticsSpans[0].innerText).toBe(
      `${newTestStatistics.usersCount}+`,
    );
    expect(statisticsSpans[1].innerText).toBe(
      `${newTestStatistics.restaurantsCount}+`,
    );
    expect(statisticsSpans[2].innerText).toBe(
      `${newTestStatistics.reviewsCount}+`,
    );
  }));

  it("should round the statistics to the lowest multiple of five", fakeAsync(() => {
    const newTestStatistics: AppStatistics = {
      usersCount: 31,
      restaurantsCount: 27,
      reviewsCount: 26,
    };

    const roundToFivePipe = new RoundToFivePipe();

    fixture.detectChanges();

    testStatistics$.next(newTestStatistics);

    tick(AppConfig.MIN_LOADING_TIME_MS);

    fixture.detectChanges();

    const statisticsSpans =
      nativeElement.querySelectorAll<HTMLSpanElement>(".statistic-count");

    expect(statisticsSpans[0].innerText).toBe(
      `${roundToFivePipe.transform(newTestStatistics.usersCount)}+`,
    );
    expect(statisticsSpans[1].innerText).toBe(
      `${roundToFivePipe.transform(newTestStatistics.restaurantsCount)}+`,
    );
    expect(statisticsSpans[2].innerText).toBe(
      `${roundToFivePipe.transform(newTestStatistics.reviewsCount)}+`,
    );
  }));

  it("should display loading dots for each statistic when data is not available", () => {
    testStatistics$.next(undefined);
    fixture.detectChanges();

    const loadingDots = nativeElement.querySelectorAll(
      ".statistic-item > .loading-dots",
    );
    expect(loadingDots.length).toBe(3);
  });
});
