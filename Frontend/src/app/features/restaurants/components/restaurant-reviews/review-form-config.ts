import { Validators } from "@angular/forms";
import {
  RESTAURANT_MAX_SCORE,
  RESTAURANT_MIN_SCORE,
} from "../../../../shared/models/restaurant.model";
import { AppConfig } from "../../../../../config/config-constants";
import { FormConfig } from "../../../../shared/components/form-dialog/form-dialog.component";

export interface ReviewForm extends Record<string, unknown> {
  comment: string;
  rating: number;
}

export const ReviewFormConfig: FormConfig<ReviewForm> = {
  fields: [
    {
      name: "comment",
      label: "Comment",
      type: "text",
      placeholder: "e.g. Excellent restaurant!",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.LONG_FIELD_MAX_LENGTH),
          errorMessage: `Comment must be at most ${AppConfig.LONG_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
    {
      name: "rating",
      label: "Rating",
      type: "number",
      placeholder: "e.g. 5",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "max",
          validatorFn: Validators.max(RESTAURANT_MAX_SCORE),
          errorMessage: `Rating must be less than ${RESTAURANT_MAX_SCORE}.`,
        },
        {
          name: "min",
          validatorFn: Validators.min(RESTAURANT_MIN_SCORE),
          errorMessage: `Rating must be more than ${RESTAURANT_MIN_SCORE}.`,
        },
      ],
    },
  ],
  formInitialValue: { comment: "", rating: 1 },
};
