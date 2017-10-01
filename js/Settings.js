var Settings = (function(){
    var settings = function Settings(defaultSettings){
        this.getDefaultSettings = function(){
            // clone the default settings
            return JSON.parse(JSON.stringify(defaultSettings));
        };

        this.settings = _getSettingsFromCookiesOrDefault(this);
    };

    function _getSettingsFromCookiesOrDefault(that){
        var currentSettings = that.getDefaultSettings();

        for(var settingName in currentSettings){
            if (currentSettings.hasOwnProperty(settingName) === true) {
                currentSettings[settingName].value = (typeof $.cookie(settingName) !== 'undefined')
                    ? $.cookie(settingName)
                    : currentSettings[settingName].value;
            }
        }

        return currentSettings;
    }

    settings.prototype.get = function(settingName) {
        var value = this.settings[settingName].value;
        if (settingName === "is_playing_help_countdown") {
            console.log(value);
        }
        if (typeof value === 'boolean') {
            return value;
        }
        return parseInt(value);
    };

    settings.prototype.set = function(settingName, value) {
        this.settings[settingName].value = value;
    };

    settings.prototype.saveToCookie = function(){
        var that = this;
        $.each(that.settings, function(settingName){
            $.cookie(settingName, that.get(settingName));
        });
    };

    settings.prototype.reset = function(){
        this.settings = this.getDefaultSettings();
        this.updateDisplay();
    };

    settings.prototype.checkHasExpectedSettings = function(expectedProperties){
        var that = this;
        expectedProperties.forEach(function(propertyName){
            if (that.settings.hasOwnProperty(propertyName) === false) {
                throw new Error('The settings are missing property "' + propertyName + '"');
            }
        })
    };

    settings.prototype.updateFromUI = function(){
        var that = this;
        $.each(that.getDefaultSettings(), function(settingName, value) {
            var element= $('#' + value.selectorId);
            if (value.type === 'checkbox') {
                that.set(settingName, element.is(':checked'));
                return;
            }
            that.set(settingName, element.val());
        });
    };

    settings.prototype.updateDisplay = function(){
        var that = this;
        $.each(that.getDefaultSettings(), function(settingName, value) {
            $('#' + value.selectorId).val(that.get(settingName));
        });
    };

    return settings;
})();
