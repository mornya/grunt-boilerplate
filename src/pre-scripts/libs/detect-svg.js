(function(exportName, window, document){
	'use strict';
	var DetectSVG = function(){
		var _isSupported;

		function _getResultCallback(callback) {
			if (_isSupported === null) {
				var img = document.createElement('img');
				img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzUiIGhlaWdodD0iMjc1Ij48L3N2Zz4%3D');
				img.onload = function(){
					_isSupported = true;
					_doCallback(callback, _isSupported);
				};

				if (img.complete) {
					img.style.visibility = 'hidden';
					img.style.position = 'absolute';
					document.body.appendChild(img);
					window.setTimeout(function(){
						_isSupported = false;
						document.body.removeChild(img);
						if (img.width >= 100) {
							onload();
						}
					}, 100);
				} else {
					_isSupported = false;
					img.onload = onload;
				}
			} else {
				_doCallback(callback, _isSupported);
			}
		}

		function _doCallback(callback, result) {
			if (callback && typeof callback === 'function') {
				callback(result);
			}
		}

		return {
			getResultCallback: _getResultCallback
		};
	};

	if (typeof define === 'function' && define.amd) {
		define(function(){ return new DetectSVG(); });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = new DetectSVG();
	} else {
		window[exportName] = new DetectSVG();
	}
})('DetectSVG', window, document);
