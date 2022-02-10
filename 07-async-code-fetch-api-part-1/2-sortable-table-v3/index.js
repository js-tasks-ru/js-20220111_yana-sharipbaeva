import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {}
  constructor(header = {}, {
    url = '',
    isSortLocally = false,
    sorted = {},
  } = {}) {
    this.headerConfig = header;
    this.url = url;
    this.start = 0;
    this.end = 10;
    this.data = [];
    this.order = 'desc';
    this.sortType = 'title';
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.onScrollEvent = this.onScrollEvent.bind(this);
    this.render();
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.createHeader();
    this.subElements.header.addEventListener('pointerdown', this.onColumnClick.bind(this));
    window.addEventListener('scroll', this.onScrollEvent.bind(this));
    await this.getData();
  }

  sortOnClient (id = this.id, order = this.order) {
    const sortType = this.getSortType();
    if (this.data) {
      const sorted = [...this.data].sort((a, b) => {
        if (sortType === 'string') {
          if (this.order === 'desc') {
            return a[id].localeCompare(b[id], 'ru', {caseFirst: 'upper'});
          } else if (this.order === 'asc') {
            return b[id].localeCompare(a[id], 'ru', {caseFirst: 'upper'});
          }
        } else {
          if (sortType === 'number') {
            if (order === 'desc') {
              return a[id] - b[id];
            } else if (order === 'asc') {
              return b[id] - a[id];
            }
          }
        }
      });
      this.sortedData = sorted;
      this.createBody(sorted);
    }
  }

  sortOnServer (id, order) {
    this.getData(id, order).then(data => {
      this.update(data);
    });
  }

  changeOrder = () => {
    this.order === 'asc' ? this.order = 'desc' : this.order = 'asc';
  }

  async getData(id = this.sortType, order = this.order) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);
    url.searchParams.set('_order', order);
    url.searchParams.set('_sort', id);
    const data = await fetchJson(url.toString());
    this.data = this.isScroling ? [...this.data, ...data] : data;
    this.createBody(this.data);

    return this.data;
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
    if (!data || this.data.length === 0) {
      this.subElements.body.innerHTML = this.createLoadingLine();
    }
    this.update(data);
  }

  update (data) {
    this.data = data;
    this.createBodyMarkup();
  }

  createBodyMarkup = () => {
    this.subElements.body.innerHTML = [...this.data].map((product) => {
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

  onColumnClick (event) {
    this.removeArrow();
    const targetElement = event.target?.closest('.sortable-table__cell');
    this.id = targetElement?.dataset.id;
    this.order = targetElement?.dataset.order;

    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.order);
    } else {
      this.sortOnServer(this.id, this.order);
    }

    this.changeOrder();
    targetElement.append(this.createArrow());
    targetElement.setAttribute('data-order', this.order);
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

  onScrollEvent() {
    const documentElement = document.documentElement;
    const offset = documentElement.scrollTop + window.innerHeight;
    const height = documentElement.offsetHeight;
    if (offset >= height) {
      this.start = this.start + 10;
      this.end = this.end + 10;
      this.isScroling = true;
      this.getData();
    }
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

  createLoadingLine() {
    return `<div data-element="loading" style="display: block" class="loading-line sortable-table__loading-line"></div><div></div><div></div>`;
  }

  removeArrow() {
    const arrowEl = this.element.querySelector('[data-element="arrow"]');
    if (arrowEl) {
      arrowEl.remove();
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.subElements.header.removeEventListener('pointerdown', this.onColumnClick.bind(this));
    this.remove();
  }
}
