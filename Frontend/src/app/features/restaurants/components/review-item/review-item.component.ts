import { Component, computed, input } from "@angular/core";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { Review } from "../../../../shared/models/review.model";

@Component({
  selector: "dhub-review-item",
  standalone: true,
  imports: [EnumeratePipe],
  templateUrl: "./review-item.component.html",
  styleUrl: "./review-item.component.css",
})
export class ReviewItemComponent {
  reviewModel = input.required<Review>();
  reviewDate = computed(() => {
    const date = this.reviewModel().creationDate;
    const dayDate = date.getDate().toString().padStart(2, "0");
    const monthDate = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${dayDate}-${monthDate}-${date.getFullYear()}`;
  });
}
