var helper = {
    getDisplayDurationString: function (totalTimeInSec) {
        var hours = Math.floor(totalTimeInSec / 3600);
        totalTimeInSec -= hours * 3600;
        var minutes = Math.floor(totalTimeInSec / 60);
        totalTimeInSec -= minutes * 60;
        var seconds = totalTimeInSec;
        return ((hours > 0) ? (hours + 'h ') : '')
            + ((minutes > 0) ? (minutes + 'min ') : '')
            + ((seconds > 0) ? (seconds + 's') : '');
    }
};