class Tooltip {
  constructor() {
    this.render();
    this.addTooltip = this.addTooltip.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    if (!Tooltip._instance) {
      Tooltip._instance = this;
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

  onMouseMove(e) {
    const shift = 10;
    this.element.style.left = e.clientX + shift + 'px';
    this.element.style.top = e.clientY + + shift + 'px';
  }

  addTooltip(event) {
    if (event.target.dataset.tooltip) {
      this.element.innerHTML = event.target.dataset.tooltip;
      document.body.append(this.element);
      document.body.addEventListener('mousemove', (e ) => this.onMouseMove(e));
    }
  }

  initialize () {
    document.addEventListener('pointerover', (e) => this.addTooltip(e));
    document.addEventListener('pointerout', (e) => this.remove(e));
  }

  remove() {
    this.element.remove();
    document.removeEventListener('pointerover', (e) => this.addTooltip(e));
    document.removeEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('pointerout', (e) => this.remove(e));
  }

  destroy() {
    this.remove();
  }
}

export default Tooltip;
