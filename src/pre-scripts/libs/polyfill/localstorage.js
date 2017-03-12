(function(window, document){
	'use strict';
	var userData = document.body, attributes;
	if (!window.localStorage && userData && userData.addBehavior && userData.addBehavior('#default#userdata')) {
		userData.load('localStorage');
		attributes = userData.XMLDocument.documentElement.attributes;
		window.localStorage = {
			length: attributes.length,
			key: function(idx){
				return (idx >= this.length) ? null : attributes[idx].name;
			},
			getItem: function(key){
				return userData.getAttribute(key);
			},
			setItem: function(key, value){
				var isExist = userData.getAttribute(key);
				userData.setAttribute(key, value);
				userData.save('localStorage');
				this.length += isExist ? 1 : 0;
			},
			removeItem: function(key){
				if (userData.getAttribute(key)) {
					userData.removeAttribute(key);
					userData.save('localStorage');
					this.length = Math.max(0, this.length - 1);
				}
			},
			clear: function(){
				while (this.length) {
					userData.removeAttribute(attributes[--this.length].name);
				}
				userData.save('localStorage');
			}
		};
	}
})(window, document);