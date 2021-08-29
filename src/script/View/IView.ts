export default interface IView {
  /**
   * Render html to the target
   */
  render(): void;

  /**
   * Data in Model hash changed
   */
  notifyPropertyChanged(): void;
}
