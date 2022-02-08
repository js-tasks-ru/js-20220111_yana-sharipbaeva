export default class NotificationMessage {
  constructor(message = '', {type = 'success', duration = 1000 } = {}) {
    this.duration = duration;
    this.type = type;
    this.message = message;
    this.render();
  }

  static isActive;

  getTemplate() {
    return `<div class="notification ${this.type}" style="--value: ${this.duration / 1000 + 's'}">
                <div class="timer"></div>
                <div class="inner-wrapper">
                  <div class="notification-header">${this.type}</div>
                  <div class="notification-body">
                    ${this.message}
                  </div>
                </div>
    `;
  }
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  show (target = document.body) {
    if (NotificationMessage.isActive) {
      NotificationMessage.isActive.remove();
    }

    target.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.isActive = this;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
