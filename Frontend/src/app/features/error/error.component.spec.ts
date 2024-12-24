import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorComponent } from "./error.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorCode } from "./models/ErrorCodes.model";
import { RoutePaths } from "../../app.routes";

describe("ErrorComponent", () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  let routeParamMap: Map<string, string>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routeParamMap = new Map<string, string>();
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: routeParamMap,
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize errorCode from ActivatedRoute", () => {
    const errorCode = ErrorCode.NotFound;
    routeParamMap.set("errorCode", errorCode.toString());

    component.ngOnInit();

    expect(component.errorCode).toBe(errorCode);
  });

  it("should set errorCode to null if an invalid errorCode is passed", () => {
    const errorCode = "blaBla";
    routeParamMap.set("errorCode", errorCode.toString());

    component.ngOnInit();

    expect(component.errorCode).toBeNull();
  });

  it("should redirect to 'Not Found' error page if an invalid errorCode is passed", () => {
    const errorCode = "blaBla";
    routeParamMap.set("errorCode", errorCode.toString());

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledOnceWith([
      RoutePaths.Error,
      ErrorCode.NotFound,
    ]);

    expect(component.errorCode).toBeNull();
  });
});
