const pokerlogic = require("./gamelogic/logic");

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
    // findWinningHand(["2♠", "3♠", "4♠", "5♠", "6♦"]);
     findWinningHand(["Q♦", "3♠", "5♥", "Q♣", "6♦"]);
    //findWinningHand(["J♣", "J♥", "5♦", "5♣", "J♠"]);
    // findWinningHand(["Q♦", "T♦", "T♠", "7♠", "A♦"]);
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

// deal 5 cards from the playDeck
function dealHand() {
    let hand = [];
    for(let i = 0; i < 5; i++) {
        hand.push(playDeck.pop());
    }

    return hand;
}

// display the hand of cards passed in as a parameter
function displayHand(hand) {
    for(let i = 1; i <= 5; i++) {
        // let temp = $("<p></p>").text(hand[i-1]);
        // $("#card" + i).append(temp);
        let cardImg = $("#card" + i + "image");

        let imageURL = generateImageURL(hand[i-1]);
        cardImg.attr("src", imageURL);
    }
    
}

// start a new round of the video poker
function dealNewHand() {
    console.log("dealing a new hand");
    // unhighlight all cards
    for(let i = 1; i < 6; i++) {
        $("#card" + i + "image").css('border', "none");
    }

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
    const winningHand = findWinningHand(handInPlay);

    if(winningHand) {
        highlightWinningCards(handInPlay, winningHand.hand);
    }

}

function dealFillInCards() {
    console.log("dealing fill in cards");

    for(let i = 1; i < 6; i++) {
        $("#card" + i + "image").css('border', "none");
    }

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

    const winningHand = findWinningHand(handInPlay);



    if(winningHand) {
        highlightWinningCards(handInPlay, winningHand.hand);
        console.log(winningHand.name);
        $("#winningHandSpan").text(winningHand.name);
    }

    
    
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


// pass in a hand of five cards, return the cards that make up
// any winning hand found in the cards
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

    if(!winningHand) {
        winningHand = checkTwoPair(handArray, hand);
    }

    if(!winningHand) {
        winningHand = checkJacksOrBetter(handArray, hand);
    }

    if(winningHand) {
        console.log("winningHand = " + winningHand.name);
        console.log("winning Hand is " + winningHand.hand);
    }
    return winningHand;
    
}

// check for royal flush
function checkRoyalFlush(handArray, hand) {

    let royalFlush = null;
    for(let i = 0; i < 4; i++) {
        let sum = 0;
        for(let j = 9; j <= 13; j++) {
            sum += handArray[i][j];
        }
        
        if(sum === 5) {
            royalFlush = {
                hand: hand,
                name: "Royal Flush"
            };
        }
    }

    return royalFlush;
}

function checkStraightFlush(handArray, hand) {
    
    let straightFlush = null;
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
                straightFlush = {
                    hand: hand,
                    name: "Straight Flush"
                };
                console.log("Straight Flush found");
            }
        }
    }

    return straightFlush;
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
            fourCards = {
                hand: returnHand,
                name: "Four of a Kind"
            };
        }
    }

    return fourCards;
}

function checkFullHouse(handArray, hand) {
    // check for three of a kind first
    let setOfThree = null;
    setOfThree = checkThreeOfAKind(handArray, hand);

    // if set of three, check if other two cards are a pair
    if(setOfThree) {
        const remainingCards = subtractHands(hand, setOfThree.hand);
        console.log(remainingCards + " are the remaining cards");
        console.log(remainingCards[0][0]);
        console.log(remainingCards[1][0]);
        if(remainingCards[0][0] == remainingCards[1][0]) {
            console.log("pair found.");
            return {
                hand: hand,
                name: "Full House"
            }
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

            threeCards = {
                hand: returnHand,
                name: "Three of a Kind"
            }
        }
    }
    return threeCards;
}


// check if there is a flush, return the whole hand if so
function checkFlush(handArray, hand) {
    let flush = null;

    for(let suit = 0; suit < 4; suit++) {
        let sum = 0;
        for(let cardNum = 0; cardNum < 14; cardNum++) {
            sum += handArray[suit][cardNum];
        }
        // console.log(sum);

        // if all cards are the same suit, we have a flush
        if(sum >= 5) {
            console.log('found a flush');
        
            flush = {
                hand: hand,
                name: "Flush"
            }
        }
    }

    return flush;
}

// check if there is a straight, return the whole hand if so
function checkStraight(handArray, hand) {
    let straight = null;

    // console.log(handArray);

    // reduce array with low and high aces
    const reducedArray = reduceHandArray(handArray, true);

    console.log("reducedArray = " + reducedArray);

    // check to see if a straight exists
    // iterate through the starting card, from A (low) to 10
    for(let k = 0; k < 10; k++) {

        // for each starting card, check the five card hand and see if it is a straight
        let sum = 0;
        for(let j = k; j <= k + 4; j++) {
            if(reducedArray[j] > 0) {
                sum++;
            }
        }
        
        if(sum === 5) {
            straight = {
                hand: hand,
                name: "Straight"
            }
                
            console.log("Straight found - first card is " + indexToCard(k));
        }
    }

    return straight;
}


function checkTwoPair(handArray, hand) {
    let twoPair = null;
    let returnHand = [];

    const reducedArray = reduceHandArray(handArray, false);

    console.log("reducedArray = " + reducedArray);

    // iterate through reduced Array and find total number of pairs
    let numberOfPairs = 0;

    for(let i = 0; i < 13; i++) {
        console.log(reducedArray[i]);
        if(reducedArray[i] == 2) {
            numberOfPairs++;
            console.log("found pair of " + indexToCard(i));
            returnHand = returnHand.concat(getCardsOfRank(hand, i));
        }
    }

    if(numberOfPairs == 2) {
        twoPair = {
            hand: returnHand,
            name: "Two Pair"
        }
    }

    return twoPair;

}

function checkJacksOrBetter(handArray, hand) {
    let jacksOrBetter = null;
    let returnHand = [];

    const reducedArray = reduceHandArray(handArray, true);

    console.log("reducedArray = " + reducedArray);

    for(let i = 10; i < 14; i++) {
        console.log(reducedArray[i]);
        if(reducedArray[i] == 2) {
            console.log("found pair of " + indexToCard(i));
            returnHand = returnHand.concat(getCardsOfRank(hand, i));
            jacksOrBetter = {
                hand: returnHand,
                name: "Jacks or Better"
            }
            console.log(jacksOrBetter.hand);
        }
    }

    return jacksOrBetter;
}

function highlightWinningCards(hand, winningHand) {

    let cardsToHighlight = [];

    for(let i = 0; i < 5; i++) {
        winningHand.forEach(card => {
            if(hand[i] == card) {
                console.log(hand[i]);
                cardsToHighlight.push(i + 1);
            }
        })
    }

    console.log(cardsToHighlight);
    cardsToHighlight.forEach(cardNum => {
        $("#card" + cardNum + "image").css('border', "solid 2px yellow");
    })


}


// Utility functions

// Takes in an array representing the cards in each suit (4 by 13 array)
// and adds it up for functions where the suit doesn't matter
// second parameter is a boolean for whether the high ace should be included
// as well as the low ace
function reduceHandArray(handArray, withTwoAces) {

    const maxLength = withTwoAces ? 14 : 13;
    let reducedArray = [];

    // reduce all the suits down to one array
    for(let i = 0; i < maxLength; i++) {

        let sum = 0;
        for(let j = 0; j < 4; j++) {
            sum += handArray[j][i];
        }
        reducedArray.push(sum);
    }

    return reducedArray;

}

// Get cards of a given rank in the hand passed in, and return them
function getCardsOfRank(hand, rank) {
    const displayRank = indexToCard(rank);
    let returnHand = [];

    console.log(displayRank);
    // iterate through hand and if card matchs the passed in rank,
    // push the card on the hand to return
    for(let i = 0; i < hand.length; i++) {
        let card = hand[i];
        if(displayRank == card[0]) {
            returnHand.push(card);
        }
    }


    console.log("returnhand = " + returnHand);
    return returnHand;
}

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
        
    }
});


// Making all functions available in this 
// module to exports that we have made 
// so that we can import this module and 
// use these functions whenever we want. 
module.exports = { 
    area, 
    perimeter 
} 