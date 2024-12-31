import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthForm, AuthFormComponent } from "./auth-form.component";
import { AppConfig } from "../../../../../config/config-constants";

describe("AuthFormComponent", () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should be invalid when form is empty", () => {
    component.authForm.setValue({ name: "", password: "" });
    expect(component.authForm.invalid).toBeTrue();
  });

  it("should be invalid when password is shorter than allowed", () => {
    let password = "";
    for (let i = 1; i < AppConfig.MIN_PASSWORD_LENGTH; i++) {
      password = password + i;
    }

    component.authForm.setValue({ name: "Jane", password: password });
    expect(component.authForm.invalid).toBeTrue();
  });

  it("should be invalid when user name contains special character", () => {
    let password = "";
    for (let i = 1; i <= AppConfig.MIN_PASSWORD_LENGTH; i++) {
      password = password + i;
    }

    const userName = "Jane@--!éá";

    component.authForm.setValue({ name: userName, password: password });
    expect(component.authForm.invalid).toBeTrue();
  });

  it("should reset form when 'resetForm' is called", () => {
    component.authForm.setValue({ name: "Jane", password: "123456" });

    component.resetForm();

    expect(component.authForm.value).toEqual({ name: null, password: null });
  });

  it("should disable form when loading", () => {
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();

    expect(component.authForm.disabled).toBeTrue();

    fixture.componentRef.setInput("loading", false);
    fixture.detectChanges();

    expect(component.authForm.disabled).toBeFalse();
  });

  it("should emmit event when form is submitted", () => {
    const testAuthForm = { name: "Jane", password: "123456" };
    component.authForm.setValue(testAuthForm);

    let submittedForm: AuthForm | undefined;
    component.formSubmitted.subscribe((authForm) => {
      submittedForm = authForm;
    });

    component.submitForm();

    expect(submittedForm).toEqual(testAuthForm);
  });
});
