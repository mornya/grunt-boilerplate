/**
 * CookieUtil.js
 *
 * @author mornya
 */
var CookieUtil = function(){};
CookieUtil.prototype = {
	/**
	 * getCookie.
	 * 
	 * @param name the name
	 * @returns cookie value
	 */
	getCookie: function(name) {
		var nameOfCookie = name + '=';
		var x = 0;
		var y;

		while (x <= document.cookie.length) {
			y = (x + nameOfCookie.length);
			if (document.cookie.substring(x, y) == nameOfCookie) {
				if ((endOfCookie = document.cookie.indexOf(';', y)) === -1) {
					endOfCookie = document.cookie.length;
				}
				return unescape(document.cookie.substring(y, endOfCookie));
			}
			x = document.cookie.indexOf(' ', x) + 1;
			if (x === 0) {
				break;
			}
		}

		return '';
	},

	/**
	 * setCookie.
	 * 
	 * @param name the name
	 * @param value the value
	 * @param options ['domain':'.my-domainm.com','expiredays':-1,'path':'','secure':false]
	 */
	setCookie: function(name, value, options) {
		var todayDate = new Date();
		options = options || {};

		if ((value === null) || (value === '')) {
			value = '';
			options.expiredays = -1;
		}
		if ((options.domain === null) || (options.domain === '')) {
			options.domain = '.my-domain.com';
		}
		if ((options.path === null) || (options.path === '')) {
			options.path = '/';
		}
		if ((options.expiredays === null) || (options.expiredays === '')) {
			options.expiredays = -1;
		}

		todayDate.setDate(todayDate.getDate() + options.expiredays);

		var expires = (options.expiredays <= 0) ? '' : ('; expires=' + todayDate.toGMTString());
		var domain = '; domain=' + options.domain;
		var path = '; path=' + options.path;
		var secure = (options.secure) ? '; secure' : '';

		document.cookie = [name, '=', escape(value), expires, domain, path, secure].join('');
	}
};
