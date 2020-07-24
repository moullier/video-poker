// generate deck of cards

const deck = ["A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "T♥", "J♥", "Q♥", "K♥",
"A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "T♣", "J♣", "Q♣", "K♣",
"A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "T♦", "J♦", "Q♦", "K♦",
"A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "T♠", "J♠", "Q♠", "K♠"];
const suitsConversion = ["♣", "♦", "♥", "♠"];
const checkWinningHandFunctions = [checkRoyalFlush, checkStraightFlush, checkFourOfAKind];

let playDeck;
let backupCards;
let heldCards = [false, false, false, false, false];
let holdableState = false;
let handInPlay;

$(document).ready(function() {
    console.log( "ready!" );
    // findWinningHand(["T♦", "J♦", "K♦", "A♦", "Q♦"]);
    // findWinningHand(["9♥", "T♥", "J♥", "Q♥", "K♥"]);
    // findWinningHand(["2♠", "3♠", "4♠", "5♠", "A♠"]);
    // findWinningHand(["6♣", "3♠", "5♥", "6♠", "6♦"]);
    // findWinningHand(["5♣", "A♦", "J♣", "7♦", "K♥"]);
    findWinningHand(["5♣", "3♠", "4♠", "2♠", "A♦"]);
    // findWinningHand(["T♠", "2♦", "2♣", "T♣", "T♥"]);
    //subtractHands(["5♣", "3♠", "5♥", "8♠", "5♦"], ["5♣", "5♥", "5♦"])

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

    let winningHand = checkRoyalFlush(handArray, hand);
    if(!winningHand) {
        winningHand = checkStraightFlush(handArray, hand);
    }

    if(!winningHand) {
        winningHand = checkFourOfAKind(handArray, hand);
    }

    if(!winningHand) {
        winningHand = checkFullHouse(handArray, hand);
    }

    if(!winningHand) {
        winningHand = checkFlush(handArray, hand);
    }

    if(!winningHand) {
        winningHand = checkStraight(handArray, hand);
    }

    console.log("winningHand = " + winningHand);
    
}

    // check for royal flush
function checkRoyalFlush(handArray, hand) {

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
    } else {
        return null;
    }

}

function checkStraightFlush(handArray, hand) {
    
    let straightSuit = null;
    //check each suit for straight flush
    for(let i = 0; i < 4; i++) {
        // iterate through the starting card, from A (low) to 9
        for(let k = 0; k < 9; k++) {

            // for each starting card, check the five card hand and see if it is a straight flush
            let sum = 0;
            for(let j = k; j <= k + 4; j++) {
                sum += handArray[i][j];
            }
            
            if(sum === 5) {
                straightSuit = i;
                console.log("Straight Flush found - suit is " + suitsConversion[straightSuit]);
            }
        }
    }

    if(straightSuit)
        return hand;
    else
        return null;
}

// check for any four of a kinds
function checkFourOfAKind(handArray, hand) {

    let fourCards = null;
    let returnHand = [];

    for(let cardNum = 0; cardNum < 14; cardNum++) {
        let sum = 0;
        let i;
        for(i = 0; i < 4; i++) {
            sum += handArray[i][cardNum];
        }

        if(sum == 4) {
            fourCards = cardNum;
            console.log("Found a four of a kind - " + fourCards);
            returnHand.push(indexToCard(cardNum) + "♣");
            returnHand.push(indexToCard(cardNum) + "♦");
            returnHand.push(indexToCard(cardNum) + "♥");
            returnHand.push(indexToCard(cardNum) + "♠");
        }
    }

    return fourCards ? returnHand : null;
}

function checkFullHouse(handArray, hand) {
    // check for three of a kind first
    let setOfThree = null;
    setOfThree = checkThreeOfAKind(handArray, hand);
    console.log(setOfThree);

    // if set of three, check if other two cards are a pair
    if(setOfThree) {
        const remainingCards = subtractHands(hand, setOfThree);
        console.log(remainingCards + " are the remaining cards");
        console.log(remainingCards[0][0]);
        console.log(remainingCards[1][0]);
        if(remainingCards[0][0] == remainingCards[1][0]) {
            console.log("pair found.");
            return hand;
        } else {
            return setOfThree;
        }
    } else {
        return null;
    }
}

// check for any three of a kinds, return the cards if found
function checkThreeOfAKind(handArray, hand) {
    let threeCards = null;
    let returnHand = [];

    for(let cardNum = 0; cardNum < 14; cardNum++) {
        let sum = 0;
        let i;
        for(i = 0; i < 4; i++) {
            sum += handArray[i][cardNum];
        }

        // if three of a kind is found, create an array of the three cards
        if(sum == 3) {
            threeCards = cardNum;
            console.log("Found a three of a kind - " + threeCards);

            for(let index = 0; index < 4; index++) {
                if(handArray[index][cardNum] == 1)
                returnHand.push("" + indexToCard(cardNum) + suitsConversion[index]);
            }
        }
    }
    return threeCards ? returnHand : null;
}

function checkFlush(handArray, hand) {
    let flush = null;

    for(let suit = 0; suit < 4; suit++) {
        let sum = 0;
        for(let cardNum = 0; cardNum < 14; cardNum++) {
            sum += handArray[suit][cardNum];
        }
        console.log(sum);

        // if all cards are the same suit, we have a flush
        if(sum >= 5) {
            console.log('found a flush');
            flush = hand;
        }
    }
    return flush;
}

function checkStraight(handArray, hand) {
    let reducedArray = [];
    let straight = null;

    console.log(handArray);

    // reduce all the suits down to one array
    for(let i = 0; i < 13; i++) {

        let sum = 0;
        for(let j = 0; j < 4; j++) {
            sum += handArray[j][i];
        }
        reducedArray.push(sum);
    }

    console.log("reducedArray = " + reducedArray);

    // check to see if a straight exists
    // iterate through the starting card, from A (low) to 9
    for(let k = 0; k < 9; k++) {

        // for each starting card, check the five card hand and see if it is a straight flush
        let sum = 0;
        for(let j = k; j <= k + 4; j++) {
            sum += reducedArray[j];
        }
        
        if(sum === 5) {
            straight = hand;
            console.log("Straight found - first card is " + indexToCard(k));
        }
    }

    return straight;
}


// Utility functions

// Converts an index from the handArray back to the appropriate card
function indexToCard(arrayIndex) {
    switch(arrayIndex) {
        case 0:case 13:
            return "A";
        case 12:
            return "K";
        case 11:
            return "Q";
        case 10:
            return "J";
        case 9:
            return "T";
        default:
            return arrayIndex + 1;
    }
}

// takes two hand of cards as arguments, removes the cards in the second hand from the first
// and returns the "difference"
function subtractHands(hand1, hand2) {
    let resultHand = [];
    for(let i = 0; i < hand1.length; i++) {
        let isMatch = false;
        for(let j = 0; j < hand2.length; j++) {
            if(hand1[i] == hand2[j]) {
                isMatch = true;
            }
        }
        if(!isMatch)
            resultHand.push(hand1[i]);
    }

    //console.log(resultHand);
    return resultHand;
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
        $("#card" + cardClicked + "image").css('border', "solid 2px red");
    }
});