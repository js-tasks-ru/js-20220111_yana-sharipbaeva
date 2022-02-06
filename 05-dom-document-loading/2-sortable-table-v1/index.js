export default class SortableTable {
  subElements = {};
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  createHeaderCells() {
    return this.headerConfig.map(item => {
      return `
         <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
            <span>${item.title}</span>
        </div>
      `;
    }).join('');
  }

  createHeader () {
    this.subElements.header.innerHTML = `<div data-element="header" class="sortable-table__header sortable-table__row">
       ${this.createHeaderCells()}
      </div>`;
  }

  createBody (data) {
    if (!data) {
      data = [...this.data];
    }

    this.subElements.body.innerHTML = data.map((product) => {
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

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements.header = this.element.querySelector('[data-element="header"]');
    this.subElements.body = this.element.querySelector('[data-element="body"]');
    this.createHeader();
    this.createBody();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(fieldValue, param = 'asc') {
    const sortType = [...this.headerConfig].filter(item => (item.id === fieldValue))[0].sortType;
    const sorted = [...this.data].sort((a, b) => {
      if (sortType === 'string'){
        if (param === 'asc') {
          return a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
        } else if (param === 'desc') {
          return b[fieldValue].localeCompare(a[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
        }
      } else {
        if (sortType === 'number') {
          if (param === 'asc') {
            return a[fieldValue] - b[fieldValue];
          } else if (param === 'desc') {
            return b[fieldValue] - a[fieldValue];
          }
        }
      }

    }, param);

    this.createBody(sorted);
  }
}

