document.addEventListener("DOMContentLoaded", function () {
  const arrCards = []; //массив карточек
  const openCard = [];
  let cards = document.createElement("div");
  let form = document.createElement("form");
  let input = document.createElement("input");
  let timeGroup = document.createElement("div");
  let labelTime = document.createElement("span");
  let time = document.createElement("span");
  let gameOver = document.createElement("span");
  let restart = document.createElement("button");
  let secund;
  //перемешивание карточек
  function shuffleArr(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  //создание карточек в кол-ве amountCard
  function createCards(amountCard) {
    cards.classList.add("cards");
    let numberCard = 0;

    //создание массива с парными идентификаторами
    for (let amount = 0; amount < amountCard; amount++) {
      if (!(arrCards.length % 2)) {
        numberCard += 1;
      }
      arrCards.push(numberCard);
    }

    shuffleArr(arrCards);

    //добавление карточек с парными идентификаторами
    for (let amount = 0; amount < amountCard; amount++) {
      let card = document.createElement("div");
      let span = document.createElement("span");
      card.classList.add("card");
      card.classList.add("visible_none");
      cards.append(card);
      card.append(span);
      span.textContent = arrCards[amount];
    }

    document.body.append(cards);
    console.log(arrCards); //вывод массива карточек в начале игры
    eventCard();
  }

  function createTimer() {
    gameOver.textContent = "Поражение! Время вышло!";
    restart.textContent = "Попробовать снова";
    let statis = document.createElement("span");
    secund = input.value * 6;
    labelTime.textContent = `Времени осталось: ${secund}`;

    restart.classList.add("button");
    timeGroup.classList.add("time-group");
    labelTime.classList.add("label_end");

    timeGroup.append(labelTime);
    timeGroup.append(time);
    document.body.append(timeGroup);

    restart.addEventListener("click", function () {
      location.reload();
    });

    function sec() {
      if (openCard.length == input.value) {
        clearInterval(timer);
      } else {
        secund--;
        labelTime.textContent = `Времени осталось: ${secund}`;
      }
      if (secund == 0) {
        clearInterval(timer);
        labelTime.remove();
        cards.remove();
        time.classList.add("game-over");
        time.append(gameOver);
        time.append(statis);
        statis.textContent = `Открыто пар: ${openCard.length} из ${
          arrCards.length / 2
        }`;
        statis.classList.add("statis");
        time.append(restart);
      }
    }

    let timer = setInterval(sec, 1000);
  }

  //
  function startGame() {
    let buttonStart = document.createElement("button");
    let label = document.createElement("label");
    let error = document.createElement("span");
    form.classList.add("form");
    input.classList.add("input");
    buttonStart.classList.add("button");
    label.classList.add("label_start");
    error.classList.add("error");

    // input.placeholder = "Число";
    input.required = true;
    input.type = "number";
    input.max = "50";
    input.min = "2";
    label.textContent = "Введите кол-во пар карточек (2-50):";
    buttonStart.textContent = "Поехали!";

    form.append(label);
    form.append(input);
    form.append(buttonStart);
    form.append(error);
    document.body.append(form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let amountCards = input.value;
      let sizeCard = 600;

      error.classList.remove("error_visible");
      error.classList.add("error_no_visible");

      createTimer();

      createCards(amountCards * 2);
      form.remove();

      //рассчет размера карточки от их кол-ва
      for (let num = 0; num < amountCards; ) {
        if (
          document.body.clientHeight - document.documentElement.clientHeight >
          0
        ) {
          sizeCard -= 5;
          cards.style.setProperty("--size-card", sizeCard + "px");
        } else {
          num += 1;
        }
      }
    });
  }

  function eventCard() {
    let card = document.querySelectorAll(".card");
    let cardActive = false;
    let numCard = null;
    let contentCardActive = null;
    card.forEach(function (cardClick) {
      cardClick.addEventListener("click", function () {
        if (!cardActive) {
          // console.log(`нажата первая карточка ${cardClick.textContent}`);
          cardClick.classList.add("open_animation");

          function openOneCard() {
            cardClick.classList.remove("visible_none");
            numCard = cardClick.textContent;
            cardClick.classList.add("card_active");
            cardActive = !cardActive;
            cardClick.classList.add("pointer");
            contentCardActive = cardClick.textContent;
          }
          setTimeout(() => openOneCard(), 150);
        } else if (cardActive) {
          // console.log(`нажата вторая карточка ${cardClick.textContent}`);
          cardClick.classList.add("open_animation");

          if (cardClick.textContent === numCard) {
            // console.log("карточки совпадают");

            function openTwoCardIdent() {
              cardClick.classList.add("card_active");
              card.forEach(function (el) {
                if (el.textContent === contentCardActive) {
                  // console.log(el.textContent);
                  el.classList.add("cards_open");
                  el.classList.add("pointer");
                  el.classList.remove("visible_none");
                }
              });
            }

            setTimeout(() => openTwoCardIdent(), 150);

            openCard.push(true);
            // console.log(openCard);

            if (openCard.length == input.value) {
              console.log("Победа!");
              time.remove();
              labelTime.classList.add("game-win");
              labelTime.textContent = `Победа за ${
                input.value * 6 - secund
              } сек.`;
              restart.classList.add("restart");
              timeGroup.append(restart);
            }
          } else {
            // console.log("Карточки не совпадают");

            cardClick.classList.add("open_animation");

            function openTwoCard() {
              cardClick.classList.remove("visible_none");
              cardClick.classList.add("card_active");
              cards.classList.add("pointer");
            }
            setTimeout(() => openTwoCard(), 150);

            function closeCard() {
              cardClick.classList.add("visible_none");

              card.forEach(function (el) {
                if (el.textContent === contentCardActive) {
                  cardClick.classList.remove("card_active");
                  cardClick.classList.remove("open_animation");
                  el.classList.remove("card_active");
                  el.classList.remove("pointer");
                  el.classList.add("visible_none");
                  el.classList.remove("open_animation");
                }
              });
              cards.classList.remove("pointer");
            }
            setTimeout(() => closeCard(), 700);
          }
          cardActive = !cardActive;
        }
      });
    });
  }
  startGame();
});
