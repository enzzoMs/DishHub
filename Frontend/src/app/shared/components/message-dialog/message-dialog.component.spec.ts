import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageDialogComponent } from "./message-dialog.component";

describe("MessageDialogComponent", () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDialogComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("message", "");
    fixture.componentRef.setInput("header", "");

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show dialog when 'showModal' is called", () => {
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

  it("should display message", () => {
    const testMessage = "Message";
    fixture.componentRef.setInput("message", testMessage);

    fixture.detectChanges();

    const paragraphElement = (
      fixture.nativeElement as HTMLElement
    ).querySelector("p") as HTMLParagraphElement;

    expect(paragraphElement.innerText).toEqual(testMessage);
  });

  it("should display header", () => {
    const testHeader = "Header";
    fixture.componentRef.setInput("header", testHeader);

    fixture.detectChanges();

    const headerElement = (fixture.nativeElement as HTMLElement).querySelector(
      "h1",
    ) as HTMLHeadingElement;

    expect(headerElement.innerText).toEqual(testHeader);
  });
});
