import Card from './card';

export default class CardManager {
  constructor() {
    this.container = null;

    this.actualElement = null;
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
      this.showClose(card);
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

  showClose(card) { // показать крестик
    const close = card.querySelector('.card_delete');
    close.classList.remove('hidden');

    close.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  closeClick(card, close) { // клик по крестику-> удалить карточку
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
      this.eventCardMove(card);
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

    this.actualElement.classList.add('dragged');

    console.log(this.actualElement);// +
    console.log('this.actualElement2');// +

    document.documentElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.documentElement.addEventListener('mouseover', this.onMouseOver.bind(this));
  }

  //
  onMouseUp(e) {
    const mouseUpItem = e.target;

    console.log(mouseUpItem);
    console.log('this.actualElement4');// +

    // this.items = document.querySelector('.card_content');
    // Неперехваченное исключение DOMException: не удалось выполнить 'insertBefore' на 'Узле': 
    // Новый дочерний элемент содержит родительский элемент.

    this.items = document.querySelector('.cards');
    // Неперехваченное исключение DOMException: не удалось выполнить 'insertBefore' на 'Узле':
    // Узел, перед которым должен быть вставлен новый узел, не является дочерним по отношению к этому узлу.

    this.items.insertBefore(this.actualElement, mouseUpItem);    

    this.actualElement.classList.remove('dragged');
    this.actualElement = undefined;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.documentElement.removeEventListener('mouseover', this.onMouseOver.bind(this));
  }

  onMouseOver(e) {
    console.log('this.actualElement3');// +
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }
}
