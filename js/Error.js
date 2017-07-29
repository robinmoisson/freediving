function IntervalError(){
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'IntervalError';
    this.stack = temp.stack;
    this.message = temp.message;
}

IntervalError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: IntervalError,
        writable: true,
        configurable: true
    }
});
