import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StatisticsComponent } from "./statistics.component";
import { StatisticsService } from "../../services/statistics.service";
import { Subject } from "rxjs";
import { AppStatistics } from "../../models/app-statistics.model";
import { RoundToFivePipe } from "../../../../shared/pipes/round-to-five/round-to-five.pipe";

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
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should display the app statistics", () => {
    const newTestStatistics: AppStatistics = {
      usersCount: 35,
      restaurantsCount: 25,
      reviewsCount: 15,
    };
    testStatistics$.next(newTestStatistics);

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
  });

  it("should round the statistics to the lowest multiple of five", () => {
    const newTestStatistics: AppStatistics = {
      usersCount: 31,
      restaurantsCount: 27,
      reviewsCount: 26,
    };
    testStatistics$.next(newTestStatistics);

    const roundToFivePipe = new RoundToFivePipe();

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
  });

  it("should display loading dots for each statistic when data is not available", () => {
    testStatistics$.next(undefined);
    fixture.detectChanges();

    const loadingDots = nativeElement.querySelectorAll(
      ".statistic-item > .loading-dots",
    );
    expect(loadingDots.length).toBe(3);
  });
});
