var Settings = (function(){
    var settings = function Settings(defaultSettings){
        this.getDefaultSettings = function(){
            return $.extend({}, defaultSettings);
        };

        this.settings = _getSettingsFromCookiesOrDefault(this);
    };

    function _getSettingsFromCookiesOrDefault(that){
        var defaultSettings = that.getDefaultSettings();
        var currentSettings = {};

        for(var settingName in defaultSettings){
            if (defaultSettings.hasOwnProperty(settingName) === true) {
                currentSettings[settingName] = (typeof $.cookie(settingName) !== 'undefined')
                    ? $.cookie(settingName)
                    : defaultSettings[settingName].value;
            }
        }

        return currentSettings;
    }

    settings.prototype.get = function(settingName) {
        return this.settings[settingName];
    };

    settings.prototype.save = function(){
        var that = this;
        $.each(that.settings, function(settingName){
            $.cookie(settingName, that.settings[settingName]);
        });
    };

    settings.prototype.reset = function(){
        this.settings = this.getDefaultSettings();
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
            that.settings[settingName] = $('#' + value.selectorId).val();
        });
    };

    settings.prototype.updateDisplay = function(){
        var that = this;
        $.each(that.getDefaultSettings(), function(settingName, value) {
            $('#' + value.selectorId).val(that.settings[settingName]);
        });
    };
})();
