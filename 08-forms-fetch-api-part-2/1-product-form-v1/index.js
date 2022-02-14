import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  subElements = {}
  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    price: 100,
    discount: 0,
    images: []
  };
  formData = {};
  uploadedImage = {};
  categories = [];

  constructor (productId) {
    this.productId = productId;
  }

  createMarkup() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  async render () {
    if (this.productId) {
      const formData = await this.getData();
      this.formData = formData[0];
    } else{
      this.formData = this.defaultFormData;
    }

    this.categories = await this.getCategories();

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.setFormData();
    this.initEventListeners();

    return this.element;
  }

  async getData() {
    const url = new URL('api/rest/products', BACKEND_URL);
    url.searchParams.set('id', this.productId);
    const formData = fetchJson(url.toString());
    return formData;
  }

  async getCategories() {
    const url = new URL('api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    const categories = await fetchJson(url.toString());
    this.categories = categories;

    return this.categories;
  }

  createSubcategories() {
    const selectStart = `<select class="form-control" id="subcategory" value="" name="subcategory">`;
    const selectEnd = `</select>`;

     const options = [...this.categories].map(item => {
        return item.subcategories && item.subcategories.map(subItem => {
          const selOption = this.defaultFormData.subcategory === subItem.id ? 'selected' : '';
            return `<option ${selOption} value="${subItem.id}">${item.title} &gt; ${subItem.title}</option>`;
        })
      }).flat().join('');

     return selectStart + options + selectEnd;
  }

  getTemplate() {
    return `<div class="product-form">
              <form data-element="productForm" class="form-grid">
                <div class="form-group form-group__half_left">
                  <fieldset>
                    <label class="form-label">Название товара</label>
                    <input
                    required=""
                    id="title"
                    value=""
                    class="form-control"
                    placeholder="title"
                    type="text"
                    name="title"
                    class="form-control"
                    placeholder="Название товара">
                  </fieldset>
                </div>

                <div class="form-group form-group__wide">
                  <label class="form-label">Описание</label>
                  <textarea
                   required=""
                   id="description"
                   class="form-control"
                   name="description"
                   data-element="productDescription"
                   placeholder="Описание товара"></textarea>
                </div>
                <div class="form-group form-group__wide" data-element="sortable-list-container">
                  <label class="form-label">Фото</label>
                  <div data-element="imageListContainer">
                      ${this.getImagesList()}
                  </div>
                  <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
               </div>
                <div class="form-group form-group__half_left">
                  <label class="form-label">Категория</label>
                    ${this.createSubcategories()}
                </div>
                <div class="form-group form-group__half_left form-group__two-col">
                  <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input
                      required=""
                      value=""
                      type="number"
                      name="price"
                      class="form-control"
                      placeholder="100"
                      id="price"
                    >
                  </fieldset>
                  <fieldset>
                    <label class="form-label">Скидка ($)</label>
                    <input
                      id="discount"
                      required=""
                      type="number"
                      value=""
                      name="discount"
                      class="form-control"
                      placeholder="0"
                     >
                  </fieldset>
                </div>
                <div class="form-group form-group__part-half">
                  <label class="form-label">Количество</label>
                  <input
                     id="quantity"
                     required=""
                     type="number"
                     value=""
                     class="form-control"
                     name="quantity"
                     placeholder="1"
                   >
                </div>
                <div class="form-group form-group__part-half">
                  <label class="form-label">Статус</label>
                  <select class="form-control" id="status" name="status" value="">
                    <option value="1">Активен</option>
                    <option value="0">Неактивен</option>
                  </select>
                </div>
                <div class="form-buttons">
                  <button type="submit" name="save" class="button-primary-outline">
                    Сохранить товар
                  </button>
                </div>
              </form>
            </div>`;
  }

  getImagesList() {
        const ulStart = `<ul class="sortable-list">`;
        const ulEnd = `</ul>`;
        if (this.formData && this.formData.images) {
          const imagesList = this.formData && this.formData.images.map(item => {
            return `<li class="products-edit__imagelist-item sortable-list__item" style="">
                <input type="hidden" name="url" value="${item.url}">
                <input type="hidden" name="source" value="${item.source}">
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                  <img class="sortable-table__cell-img" alt="${escapeHtml(item.source)}" src="${escapeHtml(item.url)}">
                  <span>${escapeHtml(item.source)}</span>
                </span>
                <button type="button">
                  <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
            </li>`;
          }).join('');
          return ulStart + imagesList + ulEnd;
        } else {
          return '';
        }

  }

  setFormData () {
    const { productForm } = this.subElements;
    const excludedFields = ['images'];
    const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));

    fields.forEach(item => {
      const element = productForm.querySelector(`#${item}`);

      element.value = this.formData[item] || this.defaultFormData[item];
    });
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

  async postImageData(url, data) {
    const response = await fetchJson(url, {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
      },
      body: data,
      referrer: ''
    });

    return response;
  }

  uploadImage() {
    const URL = 'https://api.imgur.com/3/image';
    let el = document.createElement("INPUT");
    el.type = "file";
    el.accept = "image/*";
    el.addEventListener('change', function(e) {
      let formData = new FormData();
      this.uploadedImage.file = e.target.files[0];
      formData.append('image', this.uploadedImage.file);

      if (el.files.length) {
        this.postImageData(URL, formData).then(response =>  {
          this.uploadedImage.data = response.data;
          this.updateImageList(this.uploadedImage.file.name);
        });
      }
    }.bind(this));
    el.click();
  }

  getFormData() {
    const toNums = ['quantity', 'status', 'price', 'discount'];
    let values = {};
    const {productForm} =  this.subElements;


    const getValue = field => productForm.querySelector(`[name=${field}]`);
    for (const key of Object.keys(this.defaultFormData)) {
      const field = getValue(key);
      if (key !== 'images'){
        values[key] = toNums.includes(key) ? parseInt(field.value) : field.value;
      }
    }

    if (this.productId) {
      values.id = this.productId;
    }
    const images = this.subElements['imageListContainer'].querySelectorAll('.sortable-list__item');
    values.images = [...images].map(item => {
      return { url: item.querySelector('[name="url"]').value, source: item.querySelector('[name="source"]').value }
    });



    return values;
  }

  onSubmit = event => {
    event.preventDefault();

    this.save();
  };

  async save() {
    const method = this.productId ? 'PATCH' : 'PUT';
    const url = `${BACKEND_URL}/api/rest/products`;
    const values = this.getFormData();
    const response = await fetchJson(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    this.dispatchEvent(response.id);
  }

  initEventListeners() {
    this.subElements['productForm'].addEventListener('submit', (e) => this.onSubmit(e));
    this.element.querySelector('[name="uploadImage"]').addEventListener('click', this.uploadImage.bind(this));
  }

  updateImageList (name) {
    this.defaultFormData.images = [...this.defaultFormData.images, {url: this.uploadedImage.data.link, source: name}];
    const creatListMarkup = this.getImagesList(this.defaultFormData.images);
    this.subElements['imageListContainer'].innerHTML = creatListMarkup;
  }

  dispatchEvent (id) {
    const event = this.productId
      ? new CustomEvent('product-updated', { detail: id })
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  update () {
    this.createMarkup();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
