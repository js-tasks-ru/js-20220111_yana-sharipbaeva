export default class NotificationMessage {
  constructor(message = '', {type = 'success', duration = 1000 } = {}) {
    this.duration = duration;
    this.type = type;
    this.message = message;
    this.render();
  }

  static isActive = false;

  getTemplate() {
    return `<div class="notification ${this.type} style="--value: ${this.duration / 1000 + 's'}">
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

  show (target) {
    if (!NotificationMessage.isActive) {
      if (target) {
        target.append(this.element);

      } else {
        document.body.append(this.element);
      }
      NotificationMessage.isActive = true;
    }

    setTimeout(function() {
      this.remove();
      NotificationMessage.isActive = false;
    }.bind(this), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
