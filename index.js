// generate deck of cards

const deck = ["A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "T♥", "J♥", "Q♥", "K♥",
"A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "T♣", "J♣", "Q♣", "K♣",
"A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "T♦", "J♦", "Q♦", "K♦",
"A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "T♠", "J♠", "Q♠", "K♠"];

let playDeck;
let backupCards;
let heldCards = [false, false, false, false, false];
let holdableState = false;
let handInPlay;

$(document).ready(function() {
    console.log( "ready!" );
    findWinningHand(["T♦", "J♦", "K♦", "A♦", "Q♦"]);
    findWinningHand(["9♥", "T♥", "J♥", "Q♥", "K♥"]);
})

// shuffle deck
function shuffleDeck() {
    let tempDeck = deck.slice(0);
    let shuffledDeck = [];
    let counter = 0;

    while(tempDeck.length > 0) {
        let index = Math.floor(tempDeck.length * Math.random());
        // console.log(index);
        let cardRemoved = tempDeck.splice(index, 1);
        shuffledDeck.push(cardRemoved[0]);
        counter++;
        // console.log(counter);
        // console.log(cardRemoved);
    }

    console.log(shuffledDeck);
    return shuffledDeck;
}

function dealHand() {
    let hand = [];
    for(let i = 0; i < 5; i++) {
        hand.push(playDeck.pop());
    }

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
    $('.hold-btn').prop('disabled', false);
    let funcName = "dealFillInCards()";
    $("#dealButton").attr("onclick", funcName);
    holdableState = true;
    playDeck = shuffleDeck();
    console.log(playDeck);
    handInPlay = dealHand();
    console.log(handInPlay);
    backupCards = dealHand();
    console.log(backupCards);
    displayHand(handInPlay);
    // findWinningHand(handInPlay);

}

function dealFillInCards() {
    console.log("dealing fill in cards");
    $('.hold-btn').prop('disabled', true);
    let funcName = "dealNewHand()";
    $("#dealButton").attr("onclick", funcName);
    holdableState = false;

    for(let i = 0; i < 5; i++) {
        if(!heldCards[i]) {
            handInPlay[i] = backupCards[i];
        }
    }

    console.log(handInPlay);
    displayHand(handInPlay);
}

function generateImageURL(cardName) {

    let arrayName = cardName.split("");
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

function toggleHold(card) {
    let holdSpan = $("#card" + card + "hold");

    if(heldCards[card - 1] == true) {
        holdSpan.css("visibility", "hidden");
        heldCards[card - 1] = false;
    } else {
        holdSpan.css("visibility", "visible");
        heldCards[card - 1] = true;
    }
    console.log(heldCards);
}

function findWinningHand(hand) {
    console.log(hand);

    // create a 2d array to represent the hand
    let handArray = [
    //   A,2,3,4,5,6,7,8,9,T,J,Q,K,A
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // clubs
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // diamonds
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // hearts
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // spades
    ];// 0 1 2 3 4 5 6 7 8 9 10111213  

    for(let i = 0; i < 5; i++) {
        let arrayName = hand[i].split("");
        let suit, number;
        switch(arrayName[1]) {
        case "♥":
            suit = 2;
            break;
        case "♣":
            suit = 0;
            break;
        case "♦":
            suit = 1;
            break;
        case "♠":
            suit = 3;    
        }


        if(arrayName[0] == "T") {
            number = 9;
        } else if(arrayName[0] == "J") {
            number = 10;
        } else if(arrayName[0] == "Q") {
            number = 11;
        } else if(arrayName[0] == "K") {
            number = 12;
        } else if(arrayName[0] == "A") {
            number = 13;
        } else {
            number = arrayName[0] - 1;
        }

        // console.log("suit is " + suit + " and number is " + number);

        handArray[suit][number] = 1;
        if(number == 13) {
            handArray[suit][0] = 1;
        }
    }

    console.log(handArray);

    // check for royal flush
    let royalSuit = null;
    for(let i = 0; i < 4; i++) {
        let sum = 0;
        for(let j = 9; j <= 13; j++) {
            sum += handArray[i][j];
        }
        
        if(sum === 5) {
            royalSuit = i;
        }
    }

    if(royalSuit) {
        console.log("royal flush in suit " + royalSuit);
        return(hand);
    }

}


// event listeners

$('.hold-btn').click(function(event){
    if(holdableState) {
        let cardClicked = event.target.value;
        console.log(cardClicked);
        toggleHold(cardClicked);
    }
});

$('.img-fluid').click(function(event){
    if(holdableState) {
        let cardClicked = parseInt(event.target.attributes[2].value);
        console.log(cardClicked);
        toggleHold(cardClicked);
    }
});