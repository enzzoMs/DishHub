import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantReviewsAndMenuComponent } from './restaurant-reviews-and-menu.component';

describe('RestaurantReviewsAndMenuComponent', () => {
  let component: RestaurantReviewsAndMenuComponent;
  let fixture: ComponentFixture<RestaurantReviewsAndMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantReviewsAndMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantReviewsAndMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
