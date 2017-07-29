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
                "table_type": table.getType(),
                "is_completed": table.isCompleted
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

    /**
     * Refresh history, update table data in the display
     */
    sync.prototype.refreshHistory = function() {
        if (!this.email) {
            throw new Error('You need to be logged in to get your history');
        }

        $('.syncing').text('Updating history...');
        $.get(url + '/training-sessions?email=' + encodeURIComponent(this.email))
            .done(function(data){
                $('.syncing').text('');
                var tbody = $('tbody.history');

                // show no history if we don't get anything
                if (data.length === 0) {
                    tbody.html('<tr><td colspan="100">No history yet</td></tr>');
                    return;
                }

                // loop through all result, appending them to new html content
                var tbodyHTML = '';
                $.each(data, function(key, trainingSession) {
                    tbodyHTML+= '<tr>' +
                        '<td>' + trainingSession.date + '</td>' +
                        '<td>' + trainingSession.table_type + '</td>' +
                        '<td>' + trainingSession.holding_count + '</td>' +
                        '<td>' + helper.getDisplayDurationString(parseInt(trainingSession.time_breathing_total) + parseInt(trainingSession.time_holding_total)) + '</td>' +
                        '<td>' + helper.getDisplayDurationString(trainingSession.time_holding_total) + '</td>' +
                        '<td>' + helper.getDisplayDurationString(trainingSession.time_breathing_min) + '</td>' +
                        '<td>' + (trainingSession.is_completed ? '&#10004;' : '&#x2717;') + '</td>' +
                        '</tr>';
                });
                tbody.html(tbodyHTML);
            })
            .fail(function(){
                $('.syncing').text('History update failed :/');
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
