/**
 * Hashtable.js
 *
 * 해시테이블 구현체
 *
 * @author mornya
 */
var HashTable = function() {
	this._init();
}.prototype = {
	_init: function() {
		this.hashArr = [];
		this.length = 0;
	},

	get: function(key) {
		return this.hashArr[key];
	},

	put: function(key, value) {
		if (typeof(this.hashArr[key]) == 'undefined') {
			this.length++;
		}
		this.hashArr[key] = value;
	},

	remove: function(key) {
		if (typeof(this.hashArr[key]) != 'undefined') {
			this.length--;

			var value = this.hashArr[key];
			delete this.hashArr[key];

			return value;
		}
	},

	has: function(key) {
		return (typeof(this.hashArr[key]) != 'undefined');
	}
};