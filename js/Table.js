var Table = (function(){
    var table = function(preparationTime, numberOfRounds, sound){
        this.preparationTime = preparationTime;
        this.numberOfRounds = numberOfRounds;
        this.sound = sound;
        this.intervalList = [];
        this.fireStart = $.Deferred();
        this.intervalCompletionPromise = this.fireStart.promise();
        this.currentInterval = null;
        this.currentIntervalIndex = 0;
        this.running = false;
        this.isTryingToGenerateIntervalTooShort = false;
    };

    table.prototype.generate = function(){
        var that = this;
        that.isTryingToGenerateIntervalTooShort = false;
        try{
            this.tryToGenerate();
        }
        catch (error) {
            if (error instanceof IntervalError) {
                that.isTryingToGenerateIntervalTooShort = true;
            }
            else {
                throw error;
            }
        }
    };

    table.prototype.tryToGenerate = function() {
        throw new Error('Not implemented');
    };

    table.prototype.getType = function() {
        throw new Error('Not implemented');
    };

    table.prototype.start = function() {
        _checkWeCanStartTable(this);
        this.running = true;
        _chainEventsForWholeTable(this);
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

    function _chainEventsForWholeTable(that){
        _chainAllIntervalsToTable(that);
        that.intervalCompletionPromise.then(function(){
            that.stop();
            $.event.trigger({
                type: 'tableCompleted'
            });
        });
    }

    function _chainAllIntervalsToTable(that){
        for (var i = 0; i < that.intervalList.length; i++) {
            (function (intervalIndex) {
                _chainIntervalToPromise(that, intervalIndex);
            })(i);
        }
    }

    function _chainIntervalToPromise(that, intervalIndex) {
        that.intervalCompletionPromise = that.intervalCompletionPromise.then(function(){
            that.currentInterval = that.intervalList[intervalIndex];
            $.event.trigger({
                type: 'currentIntervalIndex',
                msg: intervalIndex
            });
            return that.intervalList[intervalIndex].start();
        });
    }

    table.prototype.pause  =function(){
        this.currentInterval.pause();
    };

    table.prototype.stop  =function(){
        if (this.running === true) {
            this.currentInterval.pause();
        }
        this.intervalList = [];
        this.currentInterval = null;
        this.intervalCompletionPromise = null;
        this.running = false;
        $.event.trigger({type: 'tableStopped'});
    };

    return table;
})();


var CO2Table = (function(){
    var _type = 'CO2';

    var co2Table = function(preparationTime, numberOfRounds, sound, holdTime, firstRestTime, decreaseBy) {
        Table.call(this, preparationTime, numberOfRounds, sound);
        this.holdTime = holdTime;
        this.firstRestTime = firstRestTime;
        this.decreaseBy = decreaseBy;
    };

    co2Table.prototype = Object.create(Table.prototype);
    co2Table.prototype.constructor = co2Table;

    co2Table.prototype.tryToGenerate = function(){
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

    co2Table.prototype.getType = function(){
        return _type;
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
    var _type = 'O2';

    var o2Table = function(preparationTime, numberOfRounds, sound, restTime, maxHoldTime, increaseBy) {
        Table.call(this, preparationTime, numberOfRounds, sound);
        this.restTime = restTime;
        this.maxHoldTime = maxHoldTime;
        this.increaseBy = increaseBy;
    };

    o2Table.prototype = Object.create(Table.prototype);
    o2Table.prototype.constructor = o2Table;

    o2Table.prototype.tryToGenerate = function(){
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

    o2Table.prototype.getType = function(){
        return _type;
    };

    function _getHoldTimeForRoundNumber(that, roundIndex){
        if (roundIndex > that.numberOfRounds) {
            throw new Error('The round index is too high.');
        }
        return that.maxHoldTime + that.increaseBy*(roundIndex+1 - that.numberOfRounds);
    }

    return o2Table;
})();
