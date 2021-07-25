/// <reference path="../ViewModel/IViewModel.d.ts" />

interface IView<ViewModel extends IViewModel<any>> {
  /**
   * Render target
   */
  readonly target: HTMLElement;

  /**
   * Data grab reference
   */
  readonly data: ViewModel;

  /**
   * Render to the target
   */
  render(): void;
}
