import { Component, effect, input, output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AppConfig } from "../../../../../config/config-constants";

export interface AuthForm {
  name: string;
  password: string;
}

@Component({
  selector: "dhub-auth-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./auth-form.component.html",
  styleUrl: "./auth-form.component.css",
})
export class AuthFormComponent {
  loading = input(false);
  formSubmitted = output<AuthForm>();

  protected readonly AppConfig = AppConfig;

  readonly authForm: FormGroup<{
    name: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(formBuilder: FormBuilder) {
    effect(() => {
      if (this.loading()) {
        this.authForm.disable();
      } else {
        this.authForm.enable();
      }
    });

    this.authForm = formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern(AppConfig.USERNAME_ALLOWED_PATTERN),
          Validators.maxLength(AppConfig.MAX_FIELD_LENGTH),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(AppConfig.MIN_PASSWORD_LENGTH),
          Validators.maxLength(AppConfig.MAX_FIELD_LENGTH),
        ],
      ],
    });
  }

  get nameControl() {
    return this.authForm.controls.name;
  }

  get passwordControl() {
    return this.authForm.controls.password;
  }

  submitForm() {
    const { name, password } = this.authForm.value;

    this.formSubmitted.emit({ name: name!, password: password! });
  }

  resetForm() {
    this.authForm.reset();
  }
}
