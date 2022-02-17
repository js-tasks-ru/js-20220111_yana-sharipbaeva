export default class SortableList {
  constructor ({ items = [] } = {}) {
    this.items = items;
    this.render();
  }

  render() {
    this.element = this.getTemplate();
  }

  initEventListeners () {}

  getTemplate() {
    const ul = document.createElement('ul');
    ul.classList.add('sortable-list');
    this.items.map(item => {
      item.classList.add('sortable-list__item');
      ul.append(item);
    });
    return ul;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
