var Sync = (function () {

    var url = 'https://freediving.robinmoisson.com/api';

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

        $('.syncing').text('Syncing...');
        $.ajax({
            type: "PUT",
            url: url + "/training-sessions/" + table.uuid,
            data: {
                "email": that.email,
                "time_holding_total": table.totalHoldingTime,
                "time_breathing_total": table.totalBreathingTime,
                "time_breathing_min": table.minBreathingTime,
                "holding_count": table.holdingCount,
                "updated_at": timestamp,
                "table_type": table.getType()
            }
        }).done(function(){
            $('.syncing').text('Syncing complete !');
            setTimeout(function() {
                $('.syncing').text('');
            }, 3000);
        }).fail(function(){
            $('.syncing').text('Syncing failed :/');
            setTimeout(function() {
                $('.syncing').text('');
            }, 3000);
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
