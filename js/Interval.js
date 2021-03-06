var Interval = (function(){

    var minDuration = 4;

    /**
     * @param table: the table which contains that interval
     * @param duration: the interval duration in seconds
     * @param sound: the sound provider
     */
    var interval = function Interval(table, duration, sound) {
        if (duration < minDuration) {
            duration = minDuration;
        }

        this.table = table;
        this.duration = duration;
        this.remaining = duration;
        this.color = 'white';
        this.sound = sound;
        this.finished = $.Deferred();
        this.timer = null;
        this.playCountdownAtThese = [];
    };

    interval.prototype.start = function() {
        var that = this;
        console.log('Next interval -', that.getType(), that.remaining, 's');

        that.beat();
        _decreaseTimer(that);

        that.timer = setInterval(
            function(){
                that.beat();
                _decreaseTimer(that);
            },
            1000
        );

        that.playStartSound();

        return that.finished.promise();
    };

     function _decreaseTimer(that) {
        if (that.remaining > 0) {
            that.remaining--;
        }
        else {
            that.stop();
            that.handleFinish();
        }
    }

    interval.prototype.handleFinish = function() {
         throw Error('Method should be overriden');
    };

    interval.prototype.pause = function() {
        clearInterval(this.timer);
    };

    interval.prototype.stop = function() {
        clearInterval(this.timer);
        this.finished.resolve();

        // reset the interval for reuse
        this.finished = $.Deferred();
        this.remaining = this.duration;
    };

    interval.prototype.beat = function() {
        $.event.trigger({
            type: 'beat',
            intervalType: this.getType(),
            remaining: this.remaining + 's',
            color: this.getColor()
        });

        this.playBeatSound(this.remaining);
    };

    interval.prototype.playStartSound = function() {};

    interval.prototype.getColor = function() {
        return this.color;
    };

    interval.prototype.playBeatSound = function(remainingTime) {
        if (this.playCountdownAtThese.indexOf(remainingTime) !== -1) {
            this.sound.playCountdownAt(this.remaining);
        }
    };

    interval.prototype.getType = function() {
        return this.type;
        // throw new Error('Method should be overridden.');
    };

    interval.prototype.display = function() {
        return this.getType() + ' for ' + helper.getDisplayDurationString(this.duration);
    };

    return interval;
})();


var BreathingInterval = (function(){
    var breathingInterval = function BreathingInterval(table, duration, sound) {
        Interval.call(this, table, duration, sound);
        this.type = 'BREATHE';
        this.color = 'green';
        this.playCountdownAtThese = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30];
    };

    breathingInterval.prototype = Object.create(Interval.prototype);
    breathingInterval.constructor = breathingInterval;

    breathingInterval.prototype.playStartSound = function() {
        this.sound.playBreathe();
    };

    breathingInterval.prototype.handleFinish = function() {
        this.table.handleBreathingFinish(this.duration);
    };

    return breathingInterval;
})();


var HoldingInterval = (function(){
    var holdingInterval = function HoldingInterval(table, duration, sound, isPlayingCountdown) {
        Interval.call(this, table, duration, sound);
        this.type = 'HOLD';
        this.color = 'red';
        this.playCountdownAtThese = isPlayingCountdown ? [60, 30, 15, 10, 5] : [];
    };

    holdingInterval.prototype = Object.create(Interval.prototype);
    holdingInterval.prototype.constructor = holdingInterval;

    holdingInterval.prototype.handleFinish = function() {
        this.table.handleHoldingFinish(this.duration);
    };

    holdingInterval.prototype.playStartSound = function() {
        this.sound.playHold();
    };

    return holdingInterval;
})();