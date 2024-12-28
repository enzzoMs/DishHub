import { TestBed } from "@angular/core/testing";

import { StatisticsService } from "./statistics.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { AppStatistics } from "../models/app-statistics.model";

describe("StatisticsService", () => {
  let service: StatisticsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StatisticsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch the app statistics", async () => {
    const testStatistics: AppStatistics = {
      usersCount: 1,
      restaurantsCount: 10,
      reviewsCount: 100,
    };

    const statisticsPromise = firstValueFrom(service.appStatistics$);

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url: apiEndpoints.getAppStatistics(),
    });

    testRequest.flush(testStatistics);

    expect(await statisticsPromise).toEqual(testStatistics);
  });
});
