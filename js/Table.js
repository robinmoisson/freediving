var Table = (function () {
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * @param sync: an instance of the sync handler
     * @param sound: an instance of the sound handler
     */
    var table = function (sync, sound) {
        this.uuid = uuidv4();

        this.sound = sound;
        this.sync = sync;
        this.intervalList = [];
        this.errorMsg = null;

        this.totalHoldingTime = 0;
        this.totalBreathingTime = 0;
        this.minBreathingTime = null;
        this.holdingCount = 0;

        _resetTableCounters(this);
    };

    function _resetTableCounters(that) {
        that.fireStart = $.Deferred();
        that.intervalCompletionPromise = that.fireStart.promise();
        that.currentInterval = null;
        that.currentIntervalIndex = 0;
        that.isPlaying = false;
        that.isAleadyStarted = false;
    }

    table.prototype.generate = function () {
        this.errorMsg = null;
        try {
            this.tryToGenerate();
        }
        catch (error) {
            if (error instanceof IntervalError) {
                this.errorMsg = error.message;
            }
            else {
                throw error;
            }
        }
    };

    table.prototype.tryToGenerate = function () {
        throw new Error('Not implemented');
    };

    table.prototype.getTotalDurationString = function () {
        var total = _calculateTotalDuration(this);
        var hours = Math.floor(total / 3600);
        total -= hours * 3600;
        var minutes = Math.floor(total / 60);
        total -= minutes * 60;
        var seconds = total;
        return ((hours > 0) ? (hours + 'h ') : '')
            + ((minutes > 0) ? (minutes + 'min ') : '')
            + ((seconds > 0) ? (seconds + 's ') : '');
    };

    function _calculateTotalDuration(that) {
        var total = 0;
        that.intervalList.forEach(function (interval) {
            total += interval.duration;
        });
        return total;
    }

    table.prototype.getType = function () {
        throw new Error('Not implemented');
    };

    table.prototype.start = function () {
        _checkWeCanStartTable(this);
        this.isPlaying = true;
        if (this.isAleadyStarted === false) {
            _chainEventsForWholeTable(this);
            this.fireStart.resolve();
            this.isAleadyStarted = true;
        }
        else {
            this.currentInterval.start();
        }
    };

    function _checkWeCanStartTable(that) {
        if (that.intervalList.length < 1) {
            throw new Error('Generate the table before starting it.');
        }
        if (that.isPlaying === true) {
            throw new Error('Table is already running.');
        }
    }

    function _chainEventsForWholeTable(that) {
        _chainAllIntervalsToTable(that);
        that.intervalCompletionPromise.then(function () {
            that.stop();
            $.event.trigger({
                type: 'tableCompleted'
            });
            that.sound.playTableCompleted();
        });
    }

    function _chainAllIntervalsToTable(that) {
        for (var i = 0; i < that.intervalList.length; i++) {
            (function (intervalIndex) {
                _chainIntervalToPromise(that, intervalIndex);
            })(i);
        }
    }

    function _chainIntervalToPromise(that, intervalIndex) {
        that.intervalCompletionPromise = that.intervalCompletionPromise.then(function () {
            that.currentInterval = that.intervalList[intervalIndex];
            $.event.trigger({
                type: 'currentIntervalIndex',
                msg: intervalIndex
            });
            return that.intervalList[intervalIndex].start();
        });
    }

    table.prototype.pause = function () {
        this.isPlaying = false;
        this.currentInterval.pause();
    };

    table.prototype.stop = function () {
        if (this.isPlaying === true) {
            this.currentInterval.pause();
        }
        _resetTableCounters(this);
        $.event.trigger({type: 'tableStopped'});
    };

    /**
     * Add stats to the table when a breath hold interval finishes
     * @param totalDuration
     */
    table.prototype.handleHoldingFinish = function (totalDuration) {
        this.holdingCount++;
        this.totalHoldingTime += totalDuration;

        // sync with back end
        this.sync.syncTable(this);
    };

    /**
     * Add stats to the table when a breathe up interval finishes
     * @param totalDuration
     */
    table.prototype.handleBreathingFinish = function (totalDuration) {
        if (this.minBreathingTime === null || this.minBreathingTime > totalDuration) {
            this.minBreathingTime = totalDuration;
        }
        this.totalBreathingTime += totalDuration;

        // sync with back end
        this.sync.syncTable(this);
    };

    return table;
})();


var CO2Table = (function () {
    var _type = 'CO2';

    var co2Table = function (settings, sync, sound) {
        Table.call(this, sync, sound);

        var expectedSettings = [
            'preparationTime',
            'numberOfRounds',
            'holdTime',
            'firstRestTime',
            'decreaseBy'
        ];
        settings.checkHasExpectedSettings(expectedSettings);

        this.settings = settings;
        this.generate();
    };

    co2Table.prototype = Object.create(Table.prototype);
    co2Table.prototype.constructor = co2Table;

    co2Table.prototype.tryToGenerate = function () {
        var preparationInterval = new BreathingInterval(this, this.settings.get('preparationTime'), this.sound);
        this.intervalList.push(preparationInterval);

        for (var i = 0; i < this.settings.get('numberOfRounds'); i++) {
            var holdInterval = new HoldingInterval(this, this.settings.get('holdTime'), this.sound, this.settings.get('isPlayingHelpCountdown'));
            this.intervalList.push(holdInterval);

            if (i + 1 === this.settings.get('numberOfRounds'))
                continue;
            var restTime = _getBreatheTimeForRoundNumber(this, i);
            var breatheInterval = new BreathingInterval(this, restTime, this.sound);
            this.intervalList.push(breatheInterval);
        }
    };

    function _getBreatheTimeForRoundNumber(that, roundIndex) {
        if (roundIndex > that.settings.get('numberOfRounds')) {
            throw new Error('The round index is too high.');
        }
        return that.settings.get('firstRestTime') - roundIndex * that.settings.get('decreaseBy');
    }

    co2Table.prototype.getType = function () {
        return _type;
    };

    return co2Table;
})();


var O2Table = (function () {
    var _type = 'O2';

    var o2Table = function (settings, sync, sound) {
        Table.call(this, sync, sound);

        var expectedSettings = [
            'preparationTime',
            'numberOfRounds',
            'restTime',
            'maxHoldTime',
            'increaseBy'
        ];
        settings.checkHasExpectedSettings(expectedSettings);

        this.settings = settings;
        this.generate();
    };

    o2Table.prototype = Object.create(Table.prototype);
    o2Table.prototype.constructor = o2Table;

    o2Table.prototype.tryToGenerate = function () {
        var preparationInterval = new BreathingInterval(this, this.settings.get('preparationTime'), this.sound);
        this.intervalList.push(preparationInterval);

        for (var i = 0; i < this.settings.get('numberOfRounds'); i++) {
            var holdTime = _getHoldTimeForRoundNumber(this, i);
            var holdInterval = new HoldingInterval(this, holdTime, this.sound, this.settings.get('isPlayingHelpCountdown'));
            this.intervalList.push(holdInterval);

            if (i + 1 === this.settings.get('numberOfRounds'))
                continue;
            var breatheInterval = new BreathingInterval(this, this.settings.get('restTime'), this.sound);
            this.intervalList.push(breatheInterval);
        }
    };

    function _getHoldTimeForRoundNumber(that, roundIndex) {
        if (roundIndex > that.settings.get('numberOfRounds')) {
            throw new Error('The round index is too high.');
        }
        return that.settings.get('maxHoldTime') + that.settings.get('increaseBy') * (roundIndex + 1 - that.settings.get('numberOfRounds'));
    }

    o2Table.prototype.getType = function () {
        return _type;
    };

    return o2Table;
})();
