var Sync = (function () {

    var url = 'http://freediving.robinmoisson.com/api';

    var sync = function(){
        this.email = null;
    };

    sync.prototype.syncTable = function(table) {
        var that = this;
        var timestamp = + new Date();

        // if no email, the sync is not activated
        if (that.email === null) {
            return;
        }

        // TODO: show sync is in progress
        $.post(
            url + "/training-sessions/" + table.uuid,
            {
                "email": that.email,
                "time_holding_total": table.totalHoldingTime,
                "time_breathing_total": table.totalBreathingTime,
                "holding_count": table.holdingCount,
                "updated_at": timestamp,
                "table_type": table.getType()
            }
        ).done(function(){
            // TODO: show sync is done
        }).fail(function(){
            // TODO: show sync is failed
        });
    };

    sync.prototype.logIn = function(email) {
        this.email = email;

        // save to cookie
        $.cookie("email", email);
    };

    sync.prototype.logOut = function() {
        this.email = null;

        // save to cookie
        $.removeCookie("email");
    };

    return sync;

})();
