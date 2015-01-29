/**
 * Basejs 1.1.1
 * https://github.com/ertrzyiks/basejs
 * 
 * Its pseudoclass functionality from 
 *		Backbone by Jeremy Ashkenas, DocumentCloud Inc.
 *		http://backbonejs.org/
 *		
 * with few improvements inspirated by
 *		Sencha Touch 2, Sencha Inc.
 *		http://www.sencha.com/products/touch
 */
(function(){
	
	var root = this;
	
	/**
	 * Generic object prototype
	 *
	 *	@class Base
	 *	@constructor
	 */
	var Base = function(){};
	
	if (typeof exports !== 'undefined') {
		module.exports = Base;
	} 
	else {
		root.Base = Base;
	}
	
	
	/**
	 * Default constructor
	 *
	 * @method constructor
	 */
	Base.prototype.constructor = function(){};
	
	/**
	 * Get overriden function reference. Util common for apply/call, proto and static.
	 * With {{#crossLink "Base/extend:method"}}{{/crossLink}} all methods receive hidden __name__ prop with name as
	 * they are usually anonymous.
	 */
	Base.prototype._getParentFn = function( caller )
	{
		var parentFn = function(){};
		
		if(caller && caller.__name__)
		{
			var _owner = caller.__owner__,
				_name = caller.__name__;
				
			//Check if function exists in chain
			if(!_owner.prototype[_name])
			{
				throw new Error("Parent function `" + _name + "` not found.")
			}
			parentFn = _owner.prototype[_name];			
		}
			
		return parentFn;
	};
	
	/**
	 * Static version, dont rely on prototype
	 */
	Base._getParentFn = function( caller )
	{
		var parentFn = function(){};
		
		if(caller && caller.__name__)
		{
			var _owner = caller.__owner__,
				_name = caller.__name__;
				
			//Check if function exists in chain
			if(!_owner[_name])
			{
				throw new Error("Parent function `" + _name + "` not found.")
			}			
			parentFn = _owner[_name];
		}			
		return parentFn;
	};
		
	/**
	 * Call overriden function. Looking for same named function in super class and call with passed arguments.
	 * 
	 * @method callParent
	 * @param {*} ... 
	 */

	Base.callParent = Base.prototype.callParent = function()
	{
		var caller = arguments.callee.caller,
			parentFn = this._getParentFn(caller);
			
		return parentFn.apply(this, arguments);
	};
	
	/**
	 * Similar to callParent, but uses passed array of parameters.
	 * 
	 * @method applyParent
	 * @param  {Array} params Array of parameters
	 */
	Base.applyParent = Base.prototype.applyParent = function(params)
	{
		var caller = arguments.callee.caller,
			parentFn = this._getParentFn(caller);
			
		return parentFn.apply(this, params);
	};
	
	/**
	 * Returns collection of interfaces implemented by class.
	 */
	Base.__getInterfaces = function(){
		return [];
	};
	
	/**
	 * Register new interface implemented by current class.
	 *
	 * Implement ensure that next `extend` call in chain define all members of interface.
	 *
	 * @method implement
	 * @static
	 * @param {Function} iface Class-interface which should be implemented by class.
	 * @return {Function} Class reference to continue chaining.
	 *
	 */
	Base.implement = function( iface )
	{
		return this.extend(null, { __getInterfaces: function(){
			var ifaces = this.callParent();
			ifaces.push( iface.prototype );
			return ifaces;
		}});
	};
	
	/**
	 * Check if object is instance of class which implements given interface.
	 * 
	 * @method implement
	 * @param {Function} iface Class-interface which should be implemented by object's class.
	 */
	Base.prototype.isImplementing = function( iface ){
		if(iface && !isFunction(iface))
		{
			throw new Error("Given interface " + iface + " is not function");
		}
		
		//Get prototype to compare with interfaces list
		iface = iface.prototype;
		
		var cnstr = this.constructor,
			interfaces = cnstr.__getInterfaces(),
			length = interfaces.length;
			
		for( var i = 0; i < length; i++ )
		{
			if( interfaces[i] === iface )
			{
				return true;
			}
		}
		
		return false;
	};
	
	/**
	 * @method use
	 * @static
	 */
	Base.use = function( mixin )
	{
		if(mixin && !isFunction(mixin))
		{
			throw new Error("Given prototype mixin " + mixin + "is not function");
		}
		
		return this.extend( mixin, mixin );
	};
	
	
	/**
	 * Helper function to correctly set up the prototype chain, for subclasses.
	 * Similar to `goog.inherits`, but uses a hash of prototype properties and
	 * class properties to be extended.
	 * 
	 * Adapted version of Backbone's extend feature.
	 * See <a href="http://github.com/documentcloud/backbone">http://github.com/documentcloud/backbone</a>
	 * 
	 * @method extend
	 * @static
	 * @param {Object,Function} protoProps Prototype properties/methods or class to inherit prototype from
	 * @param {Object} [staticProps] Static properties/methods
	 * @return {Function} reference of defined class
	 */
	Base.extend = function(protoProps, staticProps) 
	{
		var ignoreConstructor = false;
		
		//Check interfaces
		if ( protoProps ){
			if ( isFunction(protoProps) )
			{	
				protoProps = protoProps.prototype;
				ignoreConstructor = true;
			}
			
			each(this.__getInterfaces(), function( iface ){
				for ( var member in iface )
				{
					if( member in protoProps )
					{
						//TODO: Compare types
					}
					else if ( !( member in this.prototype ) )
					{
						throw new Error("Interface member `" + member + "` is not implemented!");
					}
				}
			}, this);
		}
		
		protoProps = protoProps || {};
		
		var parent = this;
		var child, key;
		
		//Fill __name__ for prototype functions
		for(key in protoProps)
		{
			if(isFunction(protoProps[key]))
			{
				protoProps[key].__name__ = key;
				protoProps[key].__owner__ = parent;
			}
		}
		
		//Fill __name__ for static functions
		for(key in staticProps)
		{
			if(isFunction(staticProps[key]))
			{
				staticProps[key].__name__ = key;
				staticProps[key].__owner__ = parent;
			}
		}
		
		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if ( protoProps && has(protoProps, 'constructor') && !ignoreConstructor ) 
		{
			child = protoProps.constructor;
		}
		else 
		{
			protoProps.constructor = function(){ parent.apply(this, arguments); };
			protoProps.constructor.__name__ = "constructor";
			protoProps.constructor.__owner__ = parent;	
			child = protoProps.constructor;
		}

		// Add static properties to the constructor function, if supplied.
		extend(child, parent, staticProps);
		
		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		
		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) extend(child.prototype, protoProps);
		
		//Ensure owner
		child.__owner__ = parent;
		
		return child;
	};
	
	
	/***********************************************************************************
	 * Utils extracted from underscore.js.
	 */	 	
	function isFunction(obj) 
	{
		  return Object.prototype.toString.call(obj) == '[object Function]';
	}
	
	function has(obj, property)
	{
		return Object.prototype.hasOwnProperty.call(obj, property);
	}
	
	// Extend a given object with all the properties in passed-in object(s).
	function extend(obj) 
	{
		each(Array.prototype.slice.call(arguments, 1), function(source) 
		{
			if (source) 
			{
				for (var prop in source) 
				{
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};
	
	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles objects with the built-in `forEach`, arrays, and raw objects.
	// Delegates to **ECMAScript 5**'s native `forEach` if available.
	function each(obj, iterator, context) 
	{
		var nativeForEach = Array.prototype.forEach;
		
		if (obj == null) return;
		if (nativeForEach && obj.forEach === nativeForEach) 
		{
			obj.forEach(iterator, context);
		}
		else if (obj.length === +obj.length) 
		{
			for (var i = 0, l = obj.length; i < l; i++) 
			{
				if (iterator.call(context, obj[i], i, obj) === breaker) return;
			}
		} 
		else 
		{
			for (var key in obj) 
			{
				if (has(obj, key)) 
				{
					if (iterator.call(context, obj[key], key, obj) === breaker) return;
				}
			}
		}
	};
})();