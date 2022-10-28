import Card from './card';

export default class CardManager {
  constructor() {
    this.container = null;
    this.actualElement = null;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.finalMouseUp = this.finalMouseUp.bind(this);

    this.eventCardMove = this.eventCardMove.bind(this);
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
      this.eventCardMove(newcard.id);
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
      this.eventCardMove(newcard.id);
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
  // подписаться на захват карточки и определение ее в чужую колонку
  // если попала в чужую и отпустили событие запихивание этой карточки в новую колонку(та же функц)
  eventCardMove(id) {
    this.actualElement = document.querySelector(`.data-id_${id}`);
    console.log(this.actualElement);

    this.actualElement.classList.add('dragged');

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mouseover', this.onMouseOver);
  }

  onMouseOver(e) {
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }
  //

  onMouseUp(e) {
    const { target } = e;

    const targetColumn = target.closest('.column-item');
    // мы внутри колонки
    if (targetColumn !== null) {
      const targetCards = targetColumn.querySelector('.cards');// место для карточек
      let mouseUpItem;

      // мы внутри контейнера для карточек
      if (target.closest('.cards') !== null) {
        const parent = target.closest('.card_content');
        // попали внутрь какой то карточки
        if (parent !== null) {
          mouseUpItem = parent;
          targetCards.insertBefore(this.actualElement, mouseUpItem);// ставим перед этой карточкой
          this.finalMouseUp();
          return;
        }
        // пустая обрасть в cards
        mouseUpItem = targetCards.querySelector('.card_content');
        if (mouseUpItem !== null) { // есть ли карточки в колонке
          // если есть
          targetCards.insertBefore(this.actualElement, mouseUpItem);// ставим перед этой карточкой
          this.finalMouseUp();
          return;
        }
        // если карточек в колонке нет
        targetCards.insertAdjacentElement('beforeEnd', this.actualElement);// ставим карточку внутрь
        this.finalMouseUp();
        return;
      }

      // мы внутри контейнера с заголовком
      if (target.closest('.column_title') !== null) {
        // поставить первой в контейнер с карточками
        targetCards.insertAdjacentElement('beforeBegin', this.actualElement);// ставим карточку внутрь
        this.finalMouseUp();
        return;
      }

      // мы внутри контейнера контроль
      if (target.closest('.card_control') !== null) {
        // поставить последней в контейнер с карточками
        targetCards.insertAdjacentElement('beforeEnd', this.actualElement);// ставим карточку внутрь
        this.finalMouseUp();
        return;
      }

      // мы не попали ни в один контейнер в колонке
      mouseUpItem = targetCards.querySelector('.card_content');
      if (mouseUpItem !== null) { // есть ли карточки в колонке
        // если есть
        targetCards.insertBefore(this.actualElement, mouseUpItem);// ставим перед этой карточкой
        this.finalMouseUp();
        return;
      }
      // если карточек в колонке нет
      targetCards.insertAdjacentElement('beforeEnd', this.actualElement);// ставим карточку внутрь
      this.finalMouseUp();
      return;
    }
    // мы не внутри колонки
    this.finalMouseUp();
  }

  finalMouseUp() {
    this.actualElement.classList.remove('dragged');
    this.actualElement = undefined;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseOver);
  }
}
