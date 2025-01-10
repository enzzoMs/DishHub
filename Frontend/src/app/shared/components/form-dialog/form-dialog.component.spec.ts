import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormConfig, FormDialogComponent } from "./form-dialog.component";

describe("FormDialogComponent", () => {
  interface TestForm extends Record<string, unknown> {
    field: string;
  }

  let component: FormDialogComponent<TestForm>;
  let fixture: ComponentFixture<FormDialogComponent<TestForm>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDialogComponent<TestForm>);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("header", "");

    const testFormConfig: FormConfig<TestForm> = {
      fields: [{ name: "field", label: "Field", type: "text" }],
      formInitialValue: { field: "" },
    };
    fixture.componentRef.setInput("formConfig", testFormConfig);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should open dialog when 'showModal' is called", () => {
    component.showModal();
    fixture.detectChanges();

    expect(component.dialog().nativeElement.open).toBeTrue();
  });

  it("should close dialog when 'closeDialog' is called", () => {
    component.showModal();
    fixture.detectChanges();

    component.closeDialog();
    fixture.detectChanges();

    expect(component.dialog().nativeElement.open).toBeFalse();
  });

  it("should reset form when 'showModal' is called", () => {
    component.formGroup.setValue({ field: "" });

    component.showModal();
    component.closeDialog();

    expect(component.formGroup.value).toEqual({ field: null });
  });

  it("should disable form when loading", () => {
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();

    expect(component.formGroup.disabled).toBeTrue();

    fixture.componentRef.setInput("loading", false);
    fixture.detectChanges();

    expect(component.formGroup.disabled).toBeFalse();
  });

  it("should emmit event when form is submitted", () => {
    const testForm: TestForm = { field: "" };
    component.formGroup.setValue(testForm);

    let submittedForm: TestForm | undefined;
    component.formSubmitted.subscribe((authForm) => {
      submittedForm = authForm;
    });

    component.submitForm();

    expect(submittedForm).toEqual(testForm);
  });
});
