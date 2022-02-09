import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  subElements = {};
  constructor({url = '',
    range= {
    from: new Date(),
    to: new Date()
  }, label = '', link = '', value = 0, data= {}, formatHeading} = {}) {
    this.url = url;
    this.label = label;
    this.link = link;
    this.value =  value;
    this.range = range;
    this.data = data;
    this.chartHeight = 50;
    this.formatHeading = formatHeading;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements.body = this.element.querySelector('[data-element="body"]');

    if (Object.keys(this.data).length === 0) {
      this.element.classList.add('column-chart_loading');
    }
  }

  async update(startDate = this.range.from, endDate = this.range.to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('from', startDate.toISOString());
    url.searchParams.set('to', endDate.toISOString());
    this.data = await fetchJson(url.toString());

    const template = `${this.createChart()}`;
    this.element.classList.remove('column-chart_loading');
    this.subElements.body.innerHTML = template;
    return this.data;
  }

  getTemplate() {
    return `
        <div class="column-chart column-chart_loading" style="--chart-height: 50">
           <div class="column-chart__title">Total ${this.label}
            ${this.createLink()}
            </div>
            <div class="column-chart__container">
              <div data-element="header" class="column-chart__header">${this.checkFormatHeading()}</div>
              <div data-element="body" class="column-chart__chart">${this.createChart()}</div>
            </div>
        </div>
      `;
  }

  createChart() {
    const data = Object.values({...this.data});
    if (data.length !== 0) {
      return [...data].map(item => `
        <div style="--value: ${this.getValue(item)}" data-tooltip="${this.getTooltip(item)}%"></div>`).join('');
    } else {
      this.update();
    }

  }

  createLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  height = (item) => {
    const data = Object.values({...this.data});
    return item * this.chartHeight / Math.max(...data);
  }

  getValue (item) {
    return Math.floor(this.height(item));
  }

  getTooltip (item) {
    return Math.round(this.height(item) * 2);
  }

  checkFormatHeading () {
    return this.formatHeading ? this.formatHeading(this.value) : this.value;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
