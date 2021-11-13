const text = `После путешествия сложно остаться таким же, как прежде. Путешествия расширяют кругозор, меняют нашу жизнь и отношение к ней, наши приоритеты и ценности.
Поездка в другую страну – самый увлекательный способ изменить себя в лучшую сторону. Многие не подозревают, какие изменения может скрывать одно маленькое путешествие.
Мы верим, что путешествие – это лучшее образование!
1. Как быстро принимать решения
Дома вы знаете, где делать покупки, заказывать пиццу, какой автобус едет в нужное вам направление и т.д. Все эти вещи кажутся простыми. До тех пор, пока вы не оказываетесь в незнакомом месте и понимаете, что вы там совсем ничего не знаете.
В этом случае вам приходится принимать важные решения, от которых в прямом смысле будет зависеть, где вы сегодня будет ночевать, и что будете есть. Такие спартанские условия помогут вам в дальнейшем быть ответственным за свои действия и легче принимать решения.`;
const textExampleEL = document.querySelector("#textExample");
const party = createParty(text);

const inputEl = document.querySelector("input");
const letters = Array.from(document.querySelectorAll("[data-letter]"));
const specLetters = Array.from(document.querySelectorAll("[data-spec]"));
const symbolsPerMinute = document.querySelector("#symbolsPerMinute");
const errorPercent = document.querySelector("#errorPercent");

init();

function init() {
    inputEl.addEventListener("keydown", keyDownHandler);
    inputEl.addEventListener("keyup", keyUpHandler);
    veiwUpdate();
}

function keyDownHandler(event) {
    event.preventDefault();
    // console.log(event.key);
    const letter = letters.find((elem) =>
        elem.dataset.letter.includes(event.key)
    );

    if (letter) {
        letter.classList.add("pressed");
        press(event.key);
        return;
    }
    let key = event.key.toLowerCase();

    if (key === " ") {
        key = "space";
        press(" ");
    }
    if (key === "enter") {
        press("\n");
    }
    const ownSpesLetter = specLetters.filter((elem) => elem.dataset.spec === key);
    if (ownSpesLetter.length) {
        ownSpesLetter.forEach((elem) => elem.classList.add("pressed"));

        return;
    }
}

function keyUpHandler(event) {
    // event.preventDefault();
    // console.log(event.key);
    const letter = letters.find((elem) =>
        elem.dataset.letter.includes(event.key)
    );

    if (letter) {
        letter.classList.remove("pressed");

        return;
    }
    let key = event.key.toLowerCase();

    if (key === " ") {
        key = "space";
    }

    const ownSpesLetter = specLetters.filter((elem) => elem.dataset.spec === key);
    if (ownSpesLetter.length) {
        ownSpesLetter.forEach((elem) => elem.classList.remove("pressed"));

        return;
    }
}

function createParty(text) {
    const party = {
        text,
        strings: [],
        maxStringLength: 70,
        maxShowStrings: 3,
        currentStringIndex: 0,
        currentPressedIndex: 0,
        errors: [],
        started: false,

        statisticFlag: false,
        timerCounter: 0,

        startTimer: 0,
        errorCounter: 0,
        commonCounter: 0,
    };

    party.text = party.text.replace(/\n/g, "\n ");
    const words = party.text.split(" ");

    let string = [];
    for (const word of words) {
        const newStringLength = [...string, word].join(" ").length + !word.includes("\n");
        if (newStringLength > party.maxStringLength) {
            party.strings.push(string.join(" ") + " ");
            string = [];
        }
        string.push(word);
        if (word.includes("\n")) {
            party.strings.push(string.join(" "));
            string = [];
        }
    }
    if (string.length) {
        party.strings.push(string.join(" "));
    }
    return party;
}

function press(letter) {
    party.started = true;
    if (!party.statisticFlag) {
        party.statisticFlag = true;
        party.startTimer = Date.now();
    }
    const string = party.strings[party.currentStringIndex];
    const mustLetter = string[party.currentPressedIndex];
    if (letter === mustLetter) {
        party.currentPressedIndex += 1;

        if (string.length <= party.currentPressedIndex) {
            party.currentPressedIndex = 0;
            party.currentStringIndex += 1;
            party.statisticFlag = false;
            party.timerCounter = Date.now() - party.startTimer;
        }
    } else if (!party.errors.includes(mustLetter)) {
        party.errors.push(mustLetter);
        party.errorCounter += 1;
    }
    party.commonCounter += 1;
    veiwUpdate();
    // console.log(letter, mustLetter);
}

function veiwUpdate() {
    const string = party.strings[party.currentStringIndex];
    const showedStrings = party.strings.slice(
        party.currentStringIndex,
        party.currentStringIndex + party.maxShowStrings
    );

    const divEl = document.createElement("div");

    const firstLineEl = document.createElement("div");
    firstLineEl.classList.add("line");
    divEl.append(firstLineEl);
    const doneEl = document.createElement("span");
    doneEl.classList.add("done");
    doneEl.textContent = string.slice(0, party.currentPressedIndex);
    firstLineEl.append(
        doneEl,
        ...string
        .slice(party.currentPressedIndex)
        .split("")
        .map((letter) => {
            if (letter === " ") {
                return "·";
            }
            if (letter === "\n") {
                return "¶";
            }
            if (party.errors.includes(letter)) {
                const errorSpan = document.createElement("span");
                errorSpan.classList.add("hint");
                errorSpan.textContent = letter;
                return errorSpan;
            }
            return letter;
        })
    );

    for (let i = 1; i < showedStrings.length; i += 1) {
        const line = document.createElement("div");
        line.classList.add("line");
        divEl.append(line);

        line.append(
            ...showedStrings[i].split("").map((letter) => {
                if (letter === " ") {
                    return "·";
                }
                if (letter === "\n") {
                    return "¶";
                }
                if (party.errors.includes(letter)) {
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("hint");
                    errorSpan.textContent = letter;
                    return errorSpan;
                }
                return letter;
            })
        );
    }
    textExampleEL.innerHTML = "";
    textExampleEL.append(divEl);

    inputEl.value = string.slice(0, party.currentPressedIndex);

    if (!party.statisticFlag && party.started) {
        symbolsPerMinute.textContent = Math.round(
            party.commonCounter / (party.timerCounter / 1000 / 60)
        );
        errorPercent.textContent =
            Math.floor((10000 * party.errorCounter) / party.commonCounter) / 100 +
            " %";
    }
}