(function(){
  var totalDice = 6;

  window.Cup = function() {
    this.diceValues = [];
    this.heldDiceValues = [];
    this.isQualified = false;
    this.isHoldingOne = false;
    this.isHoldingFour = false;
    this.roll = function(diceToHold) {
      diceToHold = diceToHold ? diceToHold : []; // setting default value because not using ES2015

      var heldDiceAreValid = function() {
        var oldDiceValues = this.diceValues.slice(0);
        return diceToHold.reduce(function(pv, cv) {
          if (oldDiceValues.indexOf(cv) >= 0) {
            oldDiceValues.splice(oldDiceValues.indexOf(cv), 1);
            return pv;
          }
          else {
            return false;
          }
        }.bind(this), true)
      }.bind(this);

      // Can't roll a previously held die
      this.heldDiceValues.forEach(function(value) {
        if (diceToHold.indexOf(value) < 0) {
          throw new Error('Attempted to reroll previously held die: ' + value);
        }
      });

      // If holding all dice, nothing left to roll
      if (diceToHold.length >= totalDice) {
        throw new Error('No Dice to Roll');
      }

      // Must roll at least one die a roll
      else if (this.heldDiceValues.length >= 1 && diceToHold.length <= this.heldDiceValues.length) {
        throw new Error('Must hold at least one die per throw');
      }

      // Cant hold die that weren't previously rolled
      else if (!heldDiceAreValid()) {
        throw new Error('Attempted to hold a die that was not previously rolled');
      }

      // Valid Roll
      else {
        var numToRoll = totalDice - diceToHold.length;
        var newDiceValues = diceToHold.slice(0); // Cloning array for safety
        for(var i = 0; i < numToRoll; i++) {
          newDiceValues.push(Math.floor(Math.random() * 6) + 1  );
        }
        this.diceValues = newDiceValues;
        this.heldDiceValues = diceToHold;
        this.isHoldingOne = this.heldDiceValues.indexOf(1) >= 0;
        this.isHoldingFour = this.heldDiceValues.indexOf(4) >= 0;
        this.isQualified = this.checkQualification();
        return this;
      }
    };

    this.checkQualification = function() {
      return this.isHoldingOne && this.isHoldingFour;
    };

    this.getTotal = function() {
      if (this.diceValues.indexOf(1) < 0 || this.diceValues.indexOf(4) < 0) {
        return 0;
      }
      else {
        // Clone dice values to not mess shit up
        var diceValuesClone = this.diceValues.splice(0);

        // Remove first 1 and 4 from rolls as they don't count for total
        diceValuesClone.splice(diceValuesClone.indexOf(1), 1);
        diceValuesClone.splice(diceValuesClone.indexOf(4), 1);

        // Now do math. DO IT
        return diceValuesClone.reduce(function(pv, cv) {
          return pv + cv;
        }, 0);
      }
    }
  };
})();
