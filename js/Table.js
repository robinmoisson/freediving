var Table = (function(){
    var table = function(preparationTime, numberOfRounds, sound){
        this.preparationTime = preparationTime;
        this.numberOfRounds = numberOfRounds;
        this.sound = sound;
        this.intervalList = [];
        this.fireStart = $.Deferred();
        this.intervalCompletionPromise = this.fireStart.promise();
        this.currentInterval = null;
        this.running = false;
    };

    table.prototype.generateTable = function() {
        throw new Error('Not implemented');
    };

    table.prototype.startTable = function() {
        _checkWeCanStartTable(this);
        this.running = true;
        _chainAllTable(this);
        this.fireStart.resolve();
    };

    function _checkWeCanStartTable(that){
        if (that.intervalList.length < 1) {
            throw new Error('Generate the table before starting it.');
        }
        if (that.running === true) {
            throw new Error('Table is already running.');
        }
    }

    function _chainAllTable(that){
        for (var i = 0; i < that.intervalList.length; i++) {
            (function(index){
                _chainIntervalToPromise(that, that.intervalList[index]);
            })(i);
        }
        that.intervalCompletionPromise.then(function(){
            that.stopTable();
        });
    }

    function _chainIntervalToPromise(that, interval) {
        that.intervalCompletionPromise = that.intervalCompletionPromise.then(function(){
            that.currentInterval = interval;
            return interval.start();
        });
    }

    table.prototype.pauseTable  =function(){
        this.currentInterval.pause();
    };

    table.prototype.stopTable  =function(){
        this.currentInterval.pause();
        this.intervalList = [];
        this.currentInterval = null;
        this.intervalCompletionPromise = null;
        this.running = false;
    };

    return table;
})();


var CO2Table = (function(){
    var co2Table = function(preparationTime, numberOfRounds, sound, holdTime, firstRestTime, decreaseBy) {
        Table.call(this, preparationTime, numberOfRounds, sound);
        this.holdTime = holdTime;
        this.firstRestTime = firstRestTime;
        this.decreaseBy = decreaseBy;
    };

    co2Table.prototype = Object.create(Table.prototype);
    co2Table.prototype.constructor = co2Table;

    co2Table.prototype.generateTable = function(){
        var preparationInterval = new BreathingInterval(this.preparationTime, this.sound);
        this.intervalList.push(preparationInterval);

        for (var i = 0; i < this.numberOfRounds; i++) {
            var holdInterval = new HoldingInterval(this.holdTime, this.sound);
            this.intervalList.push(holdInterval);

            if (i+1 === this.numberOfRounds)
                continue;
            var restTime = _getBreatheTimeForRoundNumber(this, i);
            var breatheInterval = new BreathingInterval(restTime, this.sound);
            this.intervalList.push(breatheInterval);
        }
    };

    function _getBreatheTimeForRoundNumber(that, roundIndex){
        if (roundIndex > that.numberOfRounds) {
            throw new Error('The round index is too high.');
        }
        return that.firstRestTime - roundIndex*that.decreaseBy;
    }

    return co2Table;
})();


var O2Table = (function(){
    var o2Table = function(preparationTime, numberOfRounds, sound, restTime, maxHoldTime, increaseBy) {
        Table.call(this, preparationTime, numberOfRounds, sound);
        this.restTime = restTime;
        this.maxHoldTime = maxHoldTime;
        this.increaseBy = increaseBy;
    };

    o2Table.prototype = Object.create(Table.prototype);
    o2Table.prototype.constructor = o2Table;

    o2Table.prototype.generateTable = function(){
        var preparationInterval = new BreathingInterval(this.preparationTime, this.sound);
        this.intervalList.push(preparationInterval);

        for (var i = 0; i < this.numberOfRounds; i++) {
            var holdTime = _getHoldTimeForRoundNumber(this, i);
            var holdInterval = new HoldingInterval(holdTime, this.sound);
            this.intervalList.push(holdInterval);

            if (i+1 === this.numberOfRounds)
                continue;
            var breatheInterval = new BreathingInterval(this.restTime, this.sound);
            this.intervalList.push(breatheInterval);
        }
    };

    function _getHoldTimeForRoundNumber(that, roundIndex){
        if (roundIndex > that.numberOfRounds) {
            throw new Error('The round index is too high.');
        }
        return that.maxHoldTime + that.increaseBy*(roundIndex+1 - that.numberOfRounds);
    }

    return o2Table;
})();
