import { Validators } from "@angular/forms";
import { FormConfig } from "../../../shared/components/form-dialog/form-dialog.component";
import { AppConfig } from "../../../../config/config-constants";

export interface MenuForm extends Record<string, unknown> {
  name: string;
  description: string;
  price: number;
}

export const MenuFormConfig: FormConfig<MenuForm> = {
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. Spaghetti Bolognese",
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
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "e.g. An Italian dish",
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
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "e.g. 14.99",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "min",
          validatorFn: Validators.min(0),
          errorMessage: "Price must be a positive number.",
        },
      ],
    },
  ],
  formInitialValue: {
    name: "",
    description: "",
    price: 0,
  },
};
