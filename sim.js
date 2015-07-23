/*globals Cup*/
window.simulation = {
  run: function(iterations) {
    var results = [];
    for (var i =0; i < iterations; i++) {
      var myCup = new Cup;
      // First Roll
      myCup.roll();
      results.push(this.playSafe(myCup));
    }
    return this.summarizeResults(results);
  },
  playSafe: function(cup) {
    var diceToHold = cup.heldDiceValues.slice(0);
    var remainingDiceValues = cup.diceValues.slice(0);
    var numHeld = 0;

    // Remove previously held dice from possible dice to roll
    cup.heldDiceValues.forEach(function(value) {
      remainingDiceValues.splice(remainingDiceValues.indexOf(value), 1);
    });

    // If there's a one or four, keep it
    if (!cup.isHoldingOne && cup.diceValues.indexOf(1) >= 0) {
      diceToHold.push(1);
      remainingDiceValues.splice(remainingDiceValues.indexOf(1), 1);
      numHeld++;
    }
    if (!cup.isHoldingFour && cup.diceValues.indexOf(4) >= 0) {
      diceToHold.push(4);
      remainingDiceValues.splice(remainingDiceValues.indexOf(4), 1);
      numHeld++;
    }

    // If there's a 6 that I'm not already holding, keep it
    if (remainingDiceValues.indexOf(6) >= 0) {
      diceToHold.push(6);
      remainingDiceValues.splice(remainingDiceValues.indexOf(6), 1);
      numHeld++;
    }

    // If still haven't kept anything, keep highest
    if (numHeld === 0) {
      diceToHold.push(Math.max.apply(null, remainingDiceValues));
    }

    // Check to see if we have everything held now
    if (diceToHold.length === 6) {
      cup.heldDiceValues = diceToHold;
      return cup.getTotal();
    }
    else {
      return this.playSafe(cup.roll(diceToHold));
    }

  },
  summarizeResults: function(results) {
    var resultsWithoutDQ = results.filter(function(number) {
      return number !== 0;
    });

    function median(values) {
      values.sort( function(a,b) {return a - b;} );
      var half = Math.floor(values.length/2);
      if(values.length % 2) {
        return values[half];
      }
      else {
        return (values[half-1] + values[half]) / 2.0;
      }
    }

    return {
      data: results,
      mean: results.reduce(function(pv, cv) {
        return pv + cv
      }, 0) / results.length,
      median: median(results),
      meanQualifiedScore: resultsWithoutDQ.reduce(function(pv, cv) {
        return pv + cv
      }, 0) / resultsWithoutDQ.length,
      medianQualifiedScore: median(resultsWithoutDQ),
      disqualifications: results.filter(function(number) {
        return number === 0;
      }).length,
      qualifiedGames: resultsWithoutDQ.length
    }
  }
};
