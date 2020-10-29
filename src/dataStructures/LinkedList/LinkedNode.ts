export default class LinkedNode<T> {
  public value?: T = undefined;
  public next?: LinkedNode<T> = undefined;

  constructor(value: T) {
    this.value = value;
  }
}