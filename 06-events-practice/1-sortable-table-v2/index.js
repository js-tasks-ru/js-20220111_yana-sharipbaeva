export default class SortableTable {
  subElements = {};
  constructor(headerConfig = [], {data = [], sorted = {}} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.order = sorted.order;
    this.id = sorted.id;
    this.render();
    this.sortedData = this.data;
  }

  changeOrder = () => {
    this.order === 'asc' ? this.order = 'desc' : this.order = 'asc';
  }

  createArrow () {
    const arrowEl = document.createElement('div');
    arrowEl.innerHTML = `<span data-element="arrow" class="sortable-table__sort-arrow">
                            <span class="sort-arrow"></span>
                        </span>`;

    return arrowEl.firstElementChild;
  }

  getSortType() {
    return this.headerConfig.filter(item => item.id === this.id)[0]?.sortType;
  }

  createHeader () {
    this.headerConfig.map(item => {
      const cellEl = document.createElement('div');

      const cellTemplate = `<div class="sortable-table__cell" data-order="${this.order}" data-id="${item.id}" data-sortable="${item.sortable}">
        <span>${item.title}</span>
      </div>`;

      cellEl.innerHTML = cellTemplate;
      const cell = cellEl.firstElementChild;
      this.subElements.header.append(cell);

      if (item.id === this.id) {
        cell.append(this.createArrow());
      }
    }).join('');
  }

  createBody (data) {
    if (!data) {
      const sortType = this.getSortType();
      this.sort(sortType);
    } else {
      this.sortedData = data;
    }

    this.subElements.body.innerHTML = this.sortedData.map((product) => {
      let productMarkup = `<a href="/products/${product.id}" class="sortable-table__row">`;

      const productRow = this.headerConfig.map((field) => {
        if (field.id === 'images') {
          return field.template(product.images);
        }

        return `<div class="sortable-table__cell">${product[field.id]}</div>`;
      }).join('');

      productMarkup += productRow;
      productMarkup += `</a>`;

      return productMarkup;
    }).join('');
  }

  getTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row"></div>
          <div data-element="body" class="sortable-table__body"></div>
        </div>
      </div>
    `;
  }

  removeArrow() {
    const arrowEl = this.element.querySelector('[data-element="arrow"]');
    if (arrowEl) {
      arrowEl.remove();
    }
  }

  onColumnClick(event) {
    this.removeArrow();
    const targetElement = event.target?.closest('.sortable-table__cell');
    this.id = targetElement?.dataset.id;
    this.order = targetElement?.dataset.order;
    this.sort(this.getSortType());
    this.changeOrder();
    targetElement.append(this.createArrow());
    targetElement.setAttribute('data-order', this.order);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements.header = this.element.querySelector('[data-element="header"]');
    this.subElements.body = this.element.querySelector('[data-element="body"]');
    this.createHeader();
    this.createBody();

    this.subElements.header.addEventListener('pointerdown', this.onColumnClick.bind(this));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.subElements.header.removeEventListener('pointerdown', this.onColumnClick.bind(this));
    this.remove();
  }

  sort(sortType) {
    const sorted = [...this.data].sort((a, b) => {
      if (sortType === 'string') {
        if (this.order === 'desc') {
          return a[this.id].localeCompare(b[this.id], 'ru', {caseFirst: 'upper'});
        } else if (this.order === 'asc') {
          return b[this.id].localeCompare(a[this.id], 'ru', {caseFirst: 'upper'});
        }
      } else {
        if (sortType === 'number') {
          if (this.order === 'desc') {
            return a[this.id] - b[this.id];
          } else if (this.order === 'asc') {
            return b[this.id] - a[this.id];
          }
        }
      }
    });
    this.sortedData = sorted;
    this.createBody(sorted);
  }
}


