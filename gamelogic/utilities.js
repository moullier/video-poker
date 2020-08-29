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

export { 
    reduceHandArray, 
    getCardsOfRank,
    indexToCard,
    subtractHands
 };