export default class ColumnChart {
  constructor(settings) {
    this.settings = settings || {};
    this.data = settings?.data || [] ;
    this.link = settings?.link || '';
    this.label = settings?.label || '';
    this.value = settings?.value || 0;
    this.formatHeading = settings?.formatHeading ?  settings.formatHeading(this.value) : this.value;
    this.chartHeight = 50;
    this.render();
  }

  getTemplate() {
    return `<div class="column-chart">
                <div class="column-chart__title">Total ${this.label}
                ${this.createLink()}
                </div>
                  <div class="column-chart__container ">
                      <div data-element="header" class="column-chart__header">${this.formatHeading}</div>
                      <div data-element="body" class="column-chart__chart">${this.createChart()}</div>
                  </div>
             </div>
            `;
  }
  createChart() {
    return [...this.data].map(item => `
        <div style="--value: ${this.getValue(item)}" data-tooltip="${this.getTooltip(item)}%"></div>`).join('');
  }

  checkFormatHeading () {
    return this.formatHeading ? this.formatHeading(this.value) : this.value;
  }

  createLink() {
    let el;
    this.link ? el = `<a href="${this.link}" class="column-chart__link">View all</a>` : el = '';
    return el;
  }

  height = (item) => {
    return item * this.chartHeight / Math.max(...this.data);
  }

  getValue (item) {
    return Math.floor(this.height(item));
  }

  getTooltip (item) {
    return Math.round(this.height(item) * 2);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    if (Object.keys(this.settings).length === 0 && this.data.length === 0) {
      this.element.classList.add('column-chart_loading');
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(newData) {
    this.data = newData;
    const el = `${this.createChart()}`;
    this.element.querySelector('.column-chart__chart').innerHTML = el;
  }
};
