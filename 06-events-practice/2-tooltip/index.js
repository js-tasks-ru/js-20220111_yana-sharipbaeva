class Tooltip {
  constructor() {
    if (!Tooltip._instance) {
      Tooltip._instance = this;
      this.render();
      this.addTooltip = this.addTooltip.bind(this);
    }
    return Tooltip._instance;
  }

  getTemplate() {
    return `<div class="tooltip"></div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  addTooltip(event) {
    if (event.target.dataset.tooltip) {
      this.element.innerHTML = event.target.dataset.tooltip;
      document.body.append(this.element);
      document.removeEventListener('pointerout', (e) => this.remove(e));
    }
  }

  initialize () {
    document.addEventListener('pointerover', (e) => this.addTooltip(e));
    document.addEventListener('pointerout', (e) => this.remove(e));
  }

  remove() {
    this.element.remove();
    document.removeEventListener('pointerover', (e) => this.addTooltip(e));
  }

  destroy() {
    this.remove();
  }
}

export default Tooltip;
