import Card from './card';

export default class CardManager {
  constructor() {
    this.container = null;
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

    console.log(newcard);
    // Card {container: div.container, column: 'progress', 
    // id: 694700, card: div.card_content.data-id_694700, text: 'jhgikugvikjbhlou', …}
    // card это объект, надо присвоить ему саму карточку в разметке

    const card = newcard.card;
    card.addEventListener('mouseover', (e) => { // событие наведения на карточку
      e.preventDefault();
      this.showClose(card);
    });

    card.addEventListener('mouseout', (e) => { // событие ушли с карточки
      e.preventDefault();
      this.hiddenClose(card);
    });

    // card.addEventListener('mouseover', (e) => { // событие пертаскивания карточки
      // e.preventDefault();
      // this.eventCardMove(card);
    // });
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

    // card.removeaddEventListener('mouseover', (e) => { // событие пертаскивания карточки
    // e.preventDefault();
    // this.eventCardMove(card);
    // });

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
  // eventCardMove(card) {

  // }

  //
}
