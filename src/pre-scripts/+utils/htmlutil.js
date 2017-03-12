/**
 * HtmlUtil.js
 *
 * 유저뷰 관련 툴
 *
 * @author mornya
 */
var HtmlUtil = function(){
	this._init();
};
HtmlUtil.prototype = {
	_init: function() {
		this._keyCodeAcceptable = {
			normal: [
				8, 9, 13, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
				96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 144, 190
			],
			numeric: [
				48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
			]
		};
	},

	/**
	 * acceptKeyNormal
	 *
	 * 입력 폼에서 숫자,백스페이스,Enter,방향키(<-,->),del,NumLock키만 허용
	 *
	 * @param event the event
	 * @returns {Boolean}
	 */
	acceptKeyNormal: function(event) {
		for (var a in this._keyCodeAcceptable.normal) {
			if (event.keyCode === this._keyCodeAcceptable.normal[a]) return true;
		}
		event.returnValue = false;
		return false;
	},

	/**
	 * acceptKeyNumeric
	 *
	 * 입력 폼에서 숫자만 허용
	 *
	 * @param event the event
	 * @returns {Boolean}
	 */
	acceptKeyNumeric: function(event) {
		for (var a in this._keyCodeAcceptable.numeric) {
			if (event.keyCode === this._keyCodeAcceptable.numeric[a]) return true;
		}
		event.returnValue = false;
		return false;
	},

	/**
	 * getClipboard
	 *
	 * 클립보드에 저장된 내용을 리턴
	 *
	 * @returns {Object}
	 */
	getClipboard: function(name) {
		return (window.clipboardData ? window.clipboardData.getData(name) : null);
	},

	/**
	 * setClipboard
	 *
	 * 클립보드에 내용을 등록
	 *
	 * @returns
	 */
	setClipboard: function(name, data) {
		if (window.clipboardData) {
			window.clipboardData.setData(name, data);
		}
	},

	/**
	 * openWindow
	 *
	 * 팝업창 띄우기
	 * 
	 * @param url the url
	 * @param winName the win name
	 * @param width the width
	 * @param height the height
	 * @returns {Object}
	 */
	openWindow: function(url, winName, width, height) {
		var targetWin = window.open(
			url, winName,
			"width=" + width + ",height=" + height + ",toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=0"
		);
		targetWin.focus();
		return targetWin;
	},

	/**
	 * closeWindow
	 *
	 * 팝업 창에서 윈도우 닫기 (iframe 내에서 호출시 top의 window 객체 사용해야 함)
	 */
	closeWindow: function() {
		top.window.close();
	},

	/**
	 * getDocHeight
	 *
	 * 문서(Document)객체의 높이를 구함
	 *
	 * @returns
	 */
	getDocHeight: function() {
		return Math.max(
			Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
			Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
			Math.max(document.body.clientHeight, document.documentElement.clientHeight)
		);
	},

	/**
	 * 유니크 스트링 얻기
	 * 
	 * @returns {String}
	 */
	getUniqueString: function() {
		var mydate = new Date();
		var myday = mydate.getDate();
		var mymonth = mydate.getMonth() + 1;
		var myyear = (((mydate.getYear() < 100) ? '19' : '') + mydate.getYear()).substring(2,4);
		var myhour = mydate.getHours();
		var myminutes = mydate.getMinutes();
		var myseconds = mydate.getSeconds();

		myday = ((myday < 10) ? '0':'') + myday;
		mymonth = ((mymonth < 10) ? '0':'') + mymonth;
		myhour = ((myhour < 10) ? '0':'') + myhour;
		myminutes = ((myminutes < 10) ? '0':'') + myminutes;
		myseconds = ((myseconds < 10) ? '0':'') + myseconds;

		var datearray = [mymonth, myday, myyear, myhour, myminutes, myseconds];
		var uniq = '';

		for (var i = 0; i < datearray.length; i++) {
			for (var z = 0; z < 2; z++) {
				var which = Math.round(Math.random());
				if (which === 0) {
					x = String.fromCharCode(64 + (Math.round(Math.random() * 25) + 1));
				} else {
					x = String.fromCharCode(47 + (Math.round(Math.random() * 9) + 1));
				}
				uniq += x;
			}
			uniq += datearray[i];
		}

		return uniq;
	}
};
