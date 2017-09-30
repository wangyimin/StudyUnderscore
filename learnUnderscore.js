(function() {
var root = this;

var _ = function(obj) {
	
    if (obj instanceof _){
        return obj;
    }

    if (!(this instanceof _)){
    	return new _(obj);
    }
      
    
    this._wrapped = obj;
};

root._ = _;

var optimizeCb = function(func, context, argCount) {
    if (context === void 0)
    	return func;

      return func.apply(context, arguments);
};

var push = Array.prototype.push;

 _.each = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);

    var i, length;
    for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
    }
};

_.functions = function(obj) {
    var names = [];

    for (var key in obj) {
      if (typeof obj[key] == 'function') names.push(key);
    }

    return names.sort();
};

var result = function(instance, obj) {
    //return instance._chain ? _(obj).chain() : obj;
    return instance._chain ? _.chain(obj) : obj;
};

_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
    	var func = _[name] = obj[name];

    	_.prototype[name] = function() {
        	var args = [this._wrapped];

        	push.apply(args, arguments);
 
        	return result(this, func.apply(_, args));
        	//return func.apply(_, args);
    	};
    });
};

_.mixin(_);

_.chain = function(obj) {
    var instance = _(obj);

    instance._chain = true;

    return instance;
};



}.call(this));