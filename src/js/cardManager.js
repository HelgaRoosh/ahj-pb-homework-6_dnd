import Card from './card';

export default class CardManager {
  constructor() {
    this.container = null;
    this.actualElement = null;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.finalMouseUp = this.finalMouseUp.bind(this);

    this.eventCardMove = this.eventCardMove.bind(this);

    this.actualElementClone = null;

    this.deleteClone = this.deleteClone.bind(this);
  }
  // здесь взаимодействие с кнопками в колонке и между колонок

  bindToDOM(container) {
    this.container = container;

    //  поlписываемся на событие нажатия +add another card
    this.eventListenerAdd('todo');
    this.eventListenerAdd('progress');
    this.eventListenerAdd('done');
  }

  // событие нажатия на +add anoter card
  eventListenerAdd(col) { // col = todo progress done
    const element = this.container.querySelector(`.an_card_add_${col}`);

    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCard(col);
    });
  }

  addCard(col) { // метод запихивания карточки в определенную колонку
    const add = this.container.querySelector(`.an_card_add_${col}`);
    add.classList.add('hidden');

    const addbtn = this.container.querySelector(`.card_add_${col}`);// скрыть +add и показать кнопку
    addbtn.classList.remove('hidden');

    // событие при нажатии+создать карту взять ее айди,положить колумн,показать кнопку добавить
    const newcard = new Card(col);
    newcard.createCard(col);

    this.eventListenerAddButton(col, newcard);
    //
  }

  // событие нажатия на зеленую add card
  eventListenerAddButton(col, newcard) {
    const element = this.container.querySelector(`.card_add_${col}`);
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCardButon(col, newcard);
    });
  }

  addCardButon(col, newcard) { // скрыть кнопку и показать +add anoter card
    const add = this.container.querySelector(`.an_card_add_${col}`);
    add.classList.remove('hidden');

    const addbtn = this.container.querySelector(`.card_add_${col}`);
    addbtn.classList.add('hidden');

    newcard.saveCard();// сохранить карточку если не пустая

    // newcard это объект, надо присвоить саму карточку в разметке
    const { card } = newcard;

    card.addEventListener('mouseover', (e) => { // событие наведения на карточку
      e.preventDefault();
      this.showClose(card, newcard);
    });

    card.addEventListener('mouseout', (e) => { // событие ушли с карточки
      e.preventDefault();
      this.hiddenClose(card);
    });

    card.addEventListener('mousedown', (e) => { // событие пертаскивания карточки
      e.preventDefault();
      this.actualElement = document.querySelector(`.data-id_${newcard.id}`);
      this.eventCardMove(e);
    });
  }

  showClose(card, newcard) { // показать крестик
    const close = card.querySelector('.card_delete');
    close.classList.remove('hidden');

    close.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close, newcard);
    });
  }

  closeClick(card, close, newcard) { // клик по крестику-> удалить карточку
    card.remove();
    // отписываемся от всех событий на карточке и крестике
    card.removeEventListener('mouseover', (e) => { // событие наведения на карточку
      e.preventDefault();
      this.showClose(card);
    });

    card.removeEventListener('mouseout', (e) => { // событие ушли с карточки
      e.preventDefault();
      this.hiddenClose(card);
    });

    card.removeEventListener('mousedown', (e) => { // событие пертаскивания карточки
      e.preventDefault();
      this.actualElement = document.querySelector(`.data-id_${newcard.id}`);
      this.eventCardMove(e);
    });

    close.removeEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  hiddenClose(card) { // скрыть крестик
    const close = card.querySelector('.card_delete');
    close.classList.add('hidden');

    close.removeEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  // событие перетаскивания карточки
  eventCardMove(e) {
    // this.actualElement = document.querySelector(`.data-id_${id}`);
    // Метод getBoundingClientRect() возвращает объект DOMRect,
    // который содержит размеры элемента и его положение относительно видимой области просмотра.
    // Если из координат курсора мыши (e.clientX и e.clientY) вычесть положение элемента,
    // то можно получить внутреннее положение курсора и клика.
    const elemPosition = this.actualElement.getBoundingClientRect();
    this.cursorX = e.clientX - elemPosition.left;
    this.cursorY = e.clientY - elemPosition.top;

    this.actualElement.classList.add('dragged');// делаем карточку перетаскиваемой
    document.body.style.cursor = 'grabbing';// изменить курсор,в css браузер подменяет его

    // document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mouseover', this.onMouseOver);
  }

  /* cloneMap() {
    if (this.actualElementClone !== null) {
      this.deleteClone();
    }
    return `<div class="card_content card_clone">
    <textarea class="card_clone_input" type="text" placeholder="put the card here"></textarea>
    </div>`;
  } */

  onMouseOver(e) {
    // this.actualElement.style.top = `${e.clientY}px`;
    // this.actualElement.style.left = `${e.clientX}px`;
    this.actualElement.style.left = `${e.pageX - this.cursorX}px`;
    this.actualElement.style.top = `${e.pageY - this.cursorY}px`;

    // const { target } = e;
    this.actualElementClone = this.actualElement.cloneNode(true);// копия карточки
    // Эту копию затем можно вставить на страницу с помощью методов
    // prepend, append, appendChild, insertBefore или insertAdjacentElement.
    this.actualElementClone.querySelector('.card_input').className = 'card_clone_input';// стилизуем копию
    this.actualElementClone.className = 'card_clone';

    const newPlace = document.elementFromPoint(e.clientX, e.clientY);
    // возвращает самый глубоко вложенный элемент в окне, находящийся по координатам
    if (newPlace.closest('.card_content')) {
      newPlace.closest('.cards').insertBefore(this.actualElementClone, newPlace.closest('.card_content'));
      // родитель.insertBefore(элемент, перед кем вставить)
    } else if (newPlace.closest('.column-item')) {
      newPlace.closest('.column-item').querySelector('.cards').appendChild(this.actualElementClone);
      // добавляет узел в конец списка дочерних элементов указанного родительского узла
    }

    if (document.querySelector('.card_clone') !== null) {
      this.actualElementClone.addEventListener('mouseout', this.deleteClone);
      document.documentElement.addEventListener('mouseup', this.onMouseUp);
    }

    /* const targetColumn = target.closest('.column-item');
    // мы внутри колонки
    if (targetColumn !== null) {
      const targetCards = targetColumn.querySelector('.cards');// место для карточек
      let mouseUpItem;

      // мы внутри контейнера для карточек
      if (target.closest('.cards') !== null) {
        mouseUpItem = targetCards.querySelector('.card_content');
        console.log(mouseUpItem);
        if (mouseUpItem !== null) { // есть ли карточки в колонке

          // почему то запускается даже когда карточек нет и дает ошибку:
          // Failed to execute 'insertAdjacentHTML' on 'Element': The element has no parent.

          // если есть
          mouseUpItem.insertAdjacentHTML('beforeBegin', this.cloneMap());
          // ставим перед этой карточкой
          this.actualElementClone = targetColumn.querySelector('.card_clone');
          this.actualElementClone.addEventListener('mouseout', this.deleteClone);
          document.documentElement.addEventListener('mouseup', this.onMouseUp);
        }
        // если карточек в колонке нет
        targetCards.insertAdjacentHTML('beforeEnd', this.cloneMap());// ставим карточку внутрь
        this.actualElementClone = targetColumn.querySelector('.card_clone');
        this.actualElementClone.addEventListener('mouseout', this.deleteClone);
        document.documentElement.addEventListener('mouseup', this.onMouseUp);
      }

      // мы внутри контейнера с заголовком
      if (target.closest('.column_title') !== null) {
        // поставить первой в контейнер с карточками
        targetCards.insertAdjacentHTML('afterBegin', this.cloneMap());// ставим карточку внутрь
        this.actualElementClone = targetColumn.querySelector('.card_clone');
        this.actualElementClone.addEventListener('mouseout', this.deleteClone);
        document.documentElement.addEventListener('mouseup', this.onMouseUp);
      }

      // мы внутри контейнера контроль
      if (target.closest('.card_control') !== null) {
        // поставить последней в контейнер с карточками
        targetCards.insertAdjacentHTML('beforeEnd', this.cloneMap());// ставим карточку внутрь
        this.actualElementClone = targetColumn.querySelector('.card_clone');
        this.actualElementClone.addEventListener('mouseout', this.deleteClone);
        document.documentElement.addEventListener('mouseup', this.onMouseUp);
      }

      // мы не попали ни в один контейнер в колонке
      mouseUpItem = targetCards.querySelector('.card_content');
      if (mouseUpItem !== null) { // есть ли карточки в колонке
        // если есть
        mouseUpItem.insertAdjacentHTML('afterBegin', this.cloneMap());// ставим перед этой карточкой

        this.actualElementClone = targetColumn.querySelector('.card_clone');
        this.actualElementClone.addEventListener('mouseout', this.deleteClone);
        document.documentElement.addEventListener('mouseup', this.onMouseUp);
      }
      // если карточек в колонке нет
      targetCards.insertAdjacentHTML('beforeEnd', this.cloneMap());// ставим карточку внутрь
      this.actualElementClone = targetColumn.querySelector('.card_clone');// выводит в консоль
      // но потом говорит, что addEventListener от null
      this.actualElementClone.addEventListener('mouseout', this.deleteClone);
      document.documentElement.addEventListener('mouseup', this.onMouseUp);
    } */
  }
  //

  deleteClone() {
    this.actualElementClone.removeEventListener('mouseout', this.deleteClone);
    this.actualElementClone.remove();
    this.actualElementClone = null;
  }

  onMouseUp(e) {
    const place = document.elementFromPoint(e.clientX, e.clientY);
    if (place.closest('.card_clone') !== null) {
      place.closest('.cards').insertBefore(this.actualElement, this.actualElementClone);
      this.deleteClone();
      this.finalMouseUp();
    }
    /* const { target } = e;
    if (target.closest('.card_clone') !== null) {
      // this.putCard();
      const targetCards = this.container.querySelector('.cards');
      targetCards.insertBefore(this.actualElement, this.actualElementClone);
      this.deleteClone();
      this.finalMouseUp();
    } */
    // мы не внутри
    this.finalMouseUp();
  }

  finalMouseUp() {
    this.actualElement.classList.remove('dragged');
    this.actualElement = undefined;

    document.body.style.cursor = 'auto';
    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseOver);
  }
}
