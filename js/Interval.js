var Interval = (function(){

    var interval = function Interval(duration, sound) {
        this.duration = duration;
        this.remaining = duration;
        this.sound = sound;
        this.finished = $.Deferred();
        this.timer = null;
    };

    interval.prototype.start = function() {
        var that = this;
        if (that.remaining === 0){
            console.log('Interval already finished.');
            return;
        }
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
        return that.finished.promise();
    };

     function _decreaseTimer(that) {
        if (that.remaining > 0) {
            that.remaining--;
        }
        else {
            that.stop();
        }
    };

    interval.prototype.pause = function() {
        clearInterval(this.timer);
    };

    interval.prototype.stop = function() {
        clearInterval(this.timer);
        this.finished.resolve();
    };

    interval.prototype.beat = function() {
        $.event.trigger({
            type: 'beat',
            msg: this.getType() + ' for ' + this.remaining + 's.'
        })
    };

    interval.prototype.getType = function() {
        throw new Error('Method should be overridden.');
    };

    interval.prototype.display = function() {
        return this.getType() + ' for ' + this.duration + 's';
    };

    return interval;
})();


var BreathingInterval = (function(){
    var breathingInterval = function BreathingInterval(duration, sound) {
        Interval.call(this, duration, sound);
        this.type = 'BREATHE';
    };

    breathingInterval.prototype = Object.create(Interval.prototype);
    breathingInterval.constructor = breathingInterval;

    breathingInterval.prototype.beat = function() {
        console.log('Breathe heartbeat - remaining time:', this.remaining, 's');
        Interval.prototype.beat.call(this);
        if (this.remaining === 0) {
            this.sound.playHold();
        }
        else if (this.remaining > 0) {
            this.sound.playCountdownAt(this.remaining);
        }
        else {
            throw new Error("The countdown went too low.");
        }
    };

    breathingInterval.prototype.getType = function(){
        return this.type;
    };

    return breathingInterval;
})();


var HoldingInterval = (function(){
    var holdingInterval = function HoldingInterval(duration, sound) {
        Interval.call(this, duration, sound);
        this.type = 'HOLD';
    };

    holdingInterval.prototype = Object.create(Interval.prototype);
    holdingInterval.prototype.constructor = holdingInterval;

    holdingInterval.prototype.beat = function() {
        console.log('Hold heartbeat - remaining time:', this.remaining, 's');
        Interval.prototype.beat.call(this);
        if (this.remaining === 0) {
            this.sound.playBreathe();
        }
    };

    holdingInterval.prototype.getType = function(){
        return this.type;
    };

    return holdingInterval;
})();