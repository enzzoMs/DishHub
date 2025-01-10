import {
  Component, effect,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from "@angular/forms";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validators?: {
    name: string;
    validatorFn: ValidatorFn;
    errorMessage?: string;
  }[];
}

export interface FormConfig<T extends Record<string, unknown>> {
  fields: FormFieldConfig[];
  submitButtonText?: string;
  formInitialValue: T;
}

@Component({
  selector: "dhub-form-dialog",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./form-dialog.component.html",
  styleUrl: "./form-dialog.component.css",
})
export class FormDialogComponent<T extends Record<string, unknown>>
  implements OnInit
{
  header = input.required<string>();
  loading = input(false);

  formConfig = input.required<FormConfig<T>>();

  formSubmitted = output<T>();

  dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");

  formGroup!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    effect(() => {
      if (this.loading()) {
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    });
  }

  ngOnInit() {
    this.initializedFormGroup();
  }

  private initializedFormGroup() {
    const formControls: Record<string, FormControl<unknown>> = {};

    for (const field of this.formConfig().fields) {
      formControls[field.name] = new FormControl(
        field.name,
        field.validators?.map((validator) => validator.validatorFn) ?? [],
      );
    }

    this.formGroup = this.formBuilder.group(formControls);
    this.formGroup.setValue(this.formConfig().formInitialValue);
  }

  closeDialog() {
    this.dialog().nativeElement.close();
  }

  showModal(initialValue?: T) {
    if (initialValue !== undefined) {
      this.formGroup.setValue(initialValue);
    } else if (!this.loading()) {
      this.formGroup.reset();
    }
    this.dialog().nativeElement.showModal();
  }

  submitForm() {
    this.formSubmitted.emit(this.formGroup.value as T);
  }
}
