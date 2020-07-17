// generate deck of cards

const deck = ["A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "T♥", "J♥", "Q♥", "K♥",
"A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "T♣", "J♣", "Q♣", "K♣",
"A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "T♦", "J♦", "Q♦", "K♦",
"A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "T♠", "J♠", "Q♠", "K♠"];

let playDeck;
let backupCards;


// shuffle deck
function shuffleDeck() {
    let tempDeck = deck.slice(0);
    let shuffledDeck = [];
    let counter = 0;
    console.log(tempDeck);
    console.log("deck = ");
    console.log(deck);

    while(tempDeck.length > 0) {
        let index = Math.floor(tempDeck.length * Math.random());
        // console.log(index);
        let cardRemoved = tempDeck.splice(index, 1);
        shuffledDeck.push(cardRemoved[0]);
        counter++;
        // console.log(counter);
        console.log(cardRemoved);
    }

    console.log("deck = ");
    console.log(deck);
    console.log(shuffledDeck);
    return shuffledDeck;
}

function dealHand() {
    let hand = [];
    for(let i = 0; i < 5; i++) {
        hand.push(playDeck.pop());
    }
    console.log(hand);

    return hand;
}

function displayHand(hand) {
    for(let i = 1; i <= 5; i++) {
        // let temp = $("<p></p>").text(hand[i-1]);
        // $("#card" + i).append(temp);
        let cardImg = $("#card" + i + "image");

        let imageURL = generateImageURL(hand[i-1]);
        cardImg.attr("src", imageURL);
    }
    
}

function dealNewHand() {
    console.log("dealing a new hand");
    playDeck = shuffleDeck();
    console.log(playDeck);
    let dispHand = dealHand();
    console.log(dispHand);
    backupCards = dealHand();
    displayHand(dispHand);

}

function generateImageURL(cardName) {
    console.log(cardName);
    arrayName = cardName.split("");
    console.log(arrayName);
    let suit = "";
    switch(arrayName[1]) {
    case "♥":
        suit = "H";
        break;
    case "♣":
        suit = "C";
        break;
    case "♦":
        suit = "D";
        break;
    case "♠":
        suit = "S";    
    }

    return `./assets/images/${arrayName[0]}${suit}.jpg`;
}