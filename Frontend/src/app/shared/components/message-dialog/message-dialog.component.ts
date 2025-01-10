import { Component, ElementRef, input, output, viewChild } from "@angular/core";

@Component({
  selector: "dhub-message-dialog",
  standalone: true,
  imports: [],
  templateUrl: "./message-dialog.component.html",
})
export class MessageDialogComponent {
  header = input<string>();
  message = input.required<string, string>({
    transform: this.transformNewLineToHtml,
  });

  confirmMessage = input<string>();
  cancelMessage = input<string>();

  loading = input(false);

  confirmClicked = output<void>();

  dialog = viewChild.required<ElementRef<HTMLDialogElement>>("messageDialog");

  closeDialog() {
    this.dialog().nativeElement.close();
  }

  showModal() {
    this.dialog().nativeElement.showModal();
  }

  onConfirm() {
    this.confirmClicked.emit();
  }

  onCancel() {
    this.closeDialog();
  }

  private transformNewLineToHtml(value: string | undefined): string {
    return value?.replace("\n", "<br>") ?? "";
  }

  protected readonly onfocus = onfocus;
}
