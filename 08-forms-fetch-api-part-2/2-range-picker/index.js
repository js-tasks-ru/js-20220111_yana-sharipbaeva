export default class RangePicker {
  subElements = {}
  constructor({from= new Date(), to = new Date()} = {}) {
    this.from = from;
    this.to = to;
    this.render();
    this.selectorToggle = this.selectorToggle.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.showMonths = this.showMonths.bind(this);
    this.startDate = new Date(from);
  }

  selectorOpen = false;

  render() {
    this.formatDate();
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.initEventListeners();
  }

  createSelectorMarkup (from, to) {
    return `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      ${this.createCalendarMarkup(from)}
      ${this.createCalendarMarkup(to)}
   `;
  }

  createDays (date) {
    this.dateStartArray = [];
    const daysInMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    for (let day = 1;  day <= daysInMonth; day++ ) {
      this.dateStartArray = [...this.dateStartArray, new Date(new Date(date).getFullYear(), new Date(date).getMonth(), day)];
    }

    return this.dateStartArray.map((day, index) => {
      let cellStyle;

      if ((new Date(day).getTime() > new Date(this.from).getTime() && new Date(day).getTime() < new Date(this.to).getTime())) {
        cellStyle = "rangepicker__selected-between";
      } else if (new Date(day).getTime() === new Date(this.from).getTime()) {
        cellStyle = "rangepicker__selected-from";
      } else if (new Date(day).getTime() === new Date(this.to).getTime()) {
        cellStyle = "rangepicker__selected-to";
      } else{
        cellStyle = "";
      }

      return `<button data-value="${day.toISOString()}" style="${index === 0 ? `--start-from: ${startDay}` : ''}" type="button" class="rangepicker__cell ${cellStyle}">${day.getDate()}</button>`
    }).join('');
  }

  createCalendarMarkup (date) {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const listOfMonths = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь" ];
    const month = listOfMonths[new Date(date).getMonth()];

    return `<div class="rangepicker__calendar">
              <div class="rangepicker__month-indicator">
                <time datetime="${month}">${month}</time>
              </div>
              <div class="rangepicker__day-of-week">
                  ${daysOfWeek.map(day => `<div>${day}</div>`).join('')}
              </div>
              <div class="rangepicker__date-grid">
                  ${this.createDays(date)}
              </div>
           </div>`;
  }

  formatDate(from = this.from, to = this.to) {
    function dateToPlaceholder(date){
      let  day = new Date(date).getDate();
      let month = new Date(date).getMonth() + 1;

      day < 10 ? day = `0${day}` : day;
      month < 10 ? month = `0${month}` : month;

      const year = new Date(date).getFullYear();

      return `${day}.${month}.${year}`;
    }

    this.formattedFromDate = dateToPlaceholder(from);
    this.formattedToDate = dateToPlaceholder(to);
  }

  dispatchEvent () {
    this.element.dispatchEvent(event);
  }

  updateDates () {
    this.formatDate(this.selectedFrom, this.selectedTo);
    const { from, to } = this.subElements;
    from.innerHTML = this.formattedFromDate;
    to.innerHTML = this.formattedToDate;
  }

  removeCalendar () {
    this.subElements.selector.removeEventListener('click', e => this.onSelectDate(e), true);
    this.subElements.prevButton.removeEventListener('click', () => this.showMonths('prev'), true);
    this.subElements.nextButton.removeEventListener('click', () => this.showMonths('next'), true);
    this.subElements.selector.innerHTML = '';
    this.element.classList.remove('rangepicker_open');
  }

  showMonths(value) {
    let firstMonth, nextMonth;
    const startDate = this.startDate;

    if (value === 'next') {
      firstMonth = new Date(startDate.setMonth( new Date(startDate).getMonth()));
      nextMonth =  new Date(startDate.setMonth( new Date(startDate).getMonth() + 1));
    } else if (value === 'prev') {
      firstMonth = new Date(startDate.setMonth( new Date(startDate).getMonth() - 2));
      nextMonth =  new Date(startDate.setMonth( new Date(startDate).getMonth() + 1));
    }

    this.removeCalendar();
    this.createCalendar(firstMonth, nextMonth);
  }

  clearHighlightedDays () {
    [...this.subElements.selector.querySelectorAll('.rangepicker__cell')].map(item => {
      item.classList.contains('rangepicker__selected-from') ? item.classList.remove('rangepicker__selected-from') : item;
      item.classList.contains('rangepicker__selected-between') ? item.classList.remove('rangepicker__selected-between') : item;
      item.classList.contains('rangepicker__selected-to') ? item.classList.remove('rangepicker__selected-to') : item;
    });
  }

  InitEventOnSelectDay () {
    [...this.subElements.selector.querySelectorAll('.rangepicker__cell')].map(item => item.addEventListener('click', e => {
      this.onSelectDate(e);
    }), true);
  }

  createCalendar(from, to) {
    this.subElements.selector.innerHTML = this.createSelectorMarkup(from, to);
    this.showSelector();
    this.InitEventOnSelectDay();

    this.subElements.prevButton = this.subElements.selector.querySelector('.rangepicker__selector-control-left');
    this.subElements.nextButton = this.subElements.selector.querySelector('.rangepicker__selector-control-right');
    this.subElements.prevButton.addEventListener('click', e => this.showMonths('prev'), true);
    this.subElements.nextButton.addEventListener('click', e => this.showMonths('next'), true);
  }

  selectorToggle() {
    if (window.localStorage.getItem('from')){
      this.from = window.localStorage.getItem('from');
      this.to = window.localStorage.getItem('to');
      this.startDate = new Date(this.from);
    }

    if (!this.selectorOpen) {
      const fromMonth = new Date(this.startDate);
      const nextMonth = new Date(this.startDate.setMonth(new Date(this.startDate).getMonth() + 1));

      this.createCalendar(fromMonth, nextMonth);
      this.subElements.input.closest('.rangepicker ').classList.add('rangepicker_open');

    } else {
      this.removeCalendar();
      this.hideSelector();
    }

    this.selectorOpen = !this.selectorOpen;
  }

  onSelectDate (e) {
    e.target.closest('.rangepicker__cell ').classList.add('rangepicker__selected-from');
    this.clearHighlightedDays();

    if (!this.selectedFrom && !this.selectedTo && e.target.dataset.value) {
      this.selectedFrom = e.target.dataset.value;
      window.localStorage.setItem('from', e.target.dataset.value);

    } else if (this.selectedFrom && !this.selectedTo && e.target.dataset.value) {
      window.localStorage.setItem('to', e.target.dataset.value);

      this.dispatchEvent('date-select');
      this.removeCalendar();
      this.selectedTo = e.target.dataset.value;

      if (new Date(this.selectedFrom).getTime() > new Date(this.selectedTo).getTime()) {
        const selectedFrom = this.selectedTo;
        const selectedTo = this.selectedFrom;
        this.selectedFrom =  selectedFrom;
        this.selectedTo =  selectedTo;
        window.localStorage.setItem('from', selectedFrom);
        window.localStorage.setItem('to', selectedTo);
      }

      this.updateDates();
      this.hideSelector();
      this.selectorOpen = false;
      this.clearDates();
    }
  }

  clearDates() {
    this.selectedFrom = null;
    this.selectedTo = null;
  }

  showSelector () {
    this.subElements.selector.style.display = 'inline-flex';
  }

  hideSelector () {
    this.subElements.selector.style.display = 'none';
  }

  initEventListeners() {
    const { input } = this.subElements;
    input.addEventListener('click', e => this.selectorToggle(), true);
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

  getTemplate() {
    return `<div class="rangepicker">
              <div class="rangepicker__input" data-element="input">
                <span data-element="from">${this.formattedFromDate}</span> -
                <span data-element="to">${this.formattedToDate}</span>
              </div>
              <div class="rangepicker__selector" data-element="selector"></div>
            </div>`;
  }

  dispatchEvent (name) {
    const event = new CustomEvent(name);
    this.element.dispatchEvent(event);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }

}
