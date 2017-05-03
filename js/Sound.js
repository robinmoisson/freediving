var Sound = (function(){
    var sound = function Sound(){};

    sound.prototype.playCountdownAt = function() {
        throw new Error('Method should be overridden.');
    };

    sound.prototype.playBreathe = function() {
        throw new Error('Method should be overridden.');
    };

    sound.prototype.playHold = function() {
        throw new Error('Method should be overridden.');
    };

    sound.prototype.playTableCompleted = function() {
        throw new Error('Method should be overridden.');
    };

    return sound;
})();

var GoogleSound = (function(){
    var _audioPath = 'sound/google/';
    var _oneAudio = new Audio(_audioPath + '1_one.mp3'),
        _twoAudio = new Audio(_audioPath + '2_two.mp3'),
        _threeAudio = new Audio(_audioPath + '3_three.mp3'),
        _fourAudio = new Audio(_audioPath + '4_four.mp3'),
        _fiveAudio = new Audio(_audioPath + '5_five.mp3'),
        _sixAudio = new Audio(_audioPath + '6_six.mp3'),
        _sevenAudio = new Audio(_audioPath + '7_seven.mp3'),
        _eightAudio = new Audio(_audioPath + '8_eight.mp3'),
        _nineAudio = new Audio(_audioPath + '9_nine.mp3'),
        _tenAudio = new Audio(_audioPath + '10_ten.mp3'),
        _fifteenAudio = new Audio(_audioPath + '15_fifteen.mp3'),
        _twentyAudio = new Audio(_audioPath + '20_twenty.mp3'),
        _thirtyAudio = new Audio(_audioPath + '30_thirty.mp3'),
        _sixtyAudio = new Audio(_audioPath + '60_oneminute.mp3'),
        _holdAudio = new Audio(_audioPath + 'hold.mp3'),
        _breatheAudio = new Audio(_audioPath + 'breathe.mp3'),
        _tableCompletedAudio = new Audio(_audioPath + 'completed.mp3');

    var googleSound = function GoogleSound() {
        Sound.call(this);
    };

    googleSound.prototype = Object.create(Sound.prototype);
    googleSound.prototype.constructor = googleSound;


    googleSound.prototype.playCountdownAt = function(remainingTime) {
        switch (remainingTime) {
            case 1:
                _oneAudio.play();
                break;
            case 2:
                _twoAudio.play();
                break;
            case 3:
                _threeAudio.play();
                break;
            case 4:
                _fourAudio.play();
                break;
            case 5:
                _fiveAudio.play();
                break;
            case 6:
                _sixAudio.play();
                break;
            case 7:
                _sevenAudio.play();
                break;
            case 8:
                _eightAudio.play();
                break;
            case 9:
                _nineAudio.play();
                break;
            case 10:
                _tenAudio.play();
                break;
            case 15:
                _fifteenAudio.play();
                break;

            case 20:
                _twentyAudio.play();
                break;

            case 30:
                _thirtyAudio.play();
                break;
            case 60:
                _sixtyAudio.play();
                break;
        }
    };

    googleSound.prototype.playHold = function() {
        _holdAudio.play();
    };

    googleSound.prototype.playBreathe = function() {
        _breatheAudio.play();
    };

    googleSound.prototype.playTableCompleted = function() {
        _tableCompletedAudio.play();
    };

    return googleSound;
})();

var BeepSound = (function(){
    var beepSound = function BeepSound() {
        Sound.call(this);
    };

    beepSound.prototype = Object.create(Sound.prototype);
    beepSound.prototype.constructor = beepSound;

    beepSound.prototype.audio = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

    beepSound.prototype.beep = function() {
        this.audio.play();
    };

    function _delayedBeep(that, timeout) {
        var d = $.Deferred();
        setTimeout(function(){
            that.beep();
            d.resolve();
        }, timeout);
        return d.promise();
    }

    beepSound.prototype.playNBeep = function (numberOfBeep, interval) {
        var that = this;
        if (numberOfBeep < 1) {
            return;
        }
        if (typeof(interval)==='undefined') interval = 333;

        var beepPromise = _delayedBeep(that, 0);
        for (var i = 1; i < numberOfBeep; i++) {
            beepPromise = beepPromise.then(function(){
                return _delayedBeep(that, interval);
            });
        }
    };

    beepSound.prototype.playCountdownAt = function(remainingTime) {
        switch (remainingTime) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 15:
                this.playNBeep(1);
                break;

            case 20:
                this.playNBeep(2);
                break;

            case 30:
                this.playNBeep(3);
                break;
        }
    };

    beepSound.prototype.playHold = function() {
        this.playNBeep(3);
    };

    beepSound.prototype.playBreathe = function() {
        this.playNBeep(5);
    };

    beepSound.prototype.playBreathe = function() {
        this.playNBeep(6);
    };

    return beepSound;
})();
