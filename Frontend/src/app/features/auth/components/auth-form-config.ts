import { Validators } from "@angular/forms";
import { FormConfig } from "../../../shared/components/form-dialog/form-dialog.component";
import { AppConfig } from "../../../../config/config-constants";

export interface AuthForm extends Record<string, unknown> {
  name: string;
  password: string;
}

export const AuthFormConfig: FormConfig<AuthForm> = {
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. Jane Doe",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "pattern",
          validatorFn: Validators.pattern(AppConfig.USERNAME_ALLOWED_PATTERN),
          errorMessage: "Name can only contain letters and numbers.",
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.SHORT_FIELD_MAX_LENGTH),
          errorMessage: `Name must be at most ${AppConfig.SHORT_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validators: [
        {
          name: "required",
          validatorFn: Validators.required,
        },
        {
          name: "minlength",
          validatorFn: Validators.minLength(AppConfig.MIN_PASSWORD_LENGTH),
          errorMessage: `Password must be at least ${AppConfig.MIN_PASSWORD_LENGTH} characters.`,
        },
        {
          name: "maxlength",
          validatorFn: Validators.maxLength(AppConfig.SHORT_FIELD_MAX_LENGTH),
          errorMessage: `Password must be at most ${AppConfig.SHORT_FIELD_MAX_LENGTH} characters.`,
        },
      ],
    },
  ],
  formInitialValue: { name: "", password: "" },
};
