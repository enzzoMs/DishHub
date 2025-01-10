import { Validators } from "@angular/forms";
import { FormConfig } from "../../../shared/components/form-dialog/form-dialog.component";
import { AppConfig } from "../../../../config/config-constants";

export interface RestaurantForm extends Record<string, unknown> {
  name: string;
  description: string;
  location: string;
}

export const RestaurantFormConfig: FormConfig<RestaurantForm> = {
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. La Tavola Italiana",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.SHORT_FIELD_MAX_LENGTH),
          errorMessage: `Name must be at most ${AppConfig.SHORT_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "e.g. Pasta Lane",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.SHORT_FIELD_MAX_LENGTH),
          errorMessage: `Location must be at most ${AppConfig.SHORT_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "e.g. An italian restaurant",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.LONG_FIELD_MAX_LENGTH),
          errorMessage: `Description must be at most ${AppConfig.LONG_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
  ],
  formInitialValue: { name: "", location: "", description: "" },
};
