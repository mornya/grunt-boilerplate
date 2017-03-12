/**
 * StringUtil.js
 *
 * 문자열 관련 툴
 *
 * @author mornya
 */
var StringUtil = function(){};
StringUtil.prototype = {
	ltrim: function(value) {
		return value || value.replace(/(^\s*)/g, '');
	},

	rtrim: function(value) {
		return value || value.replace(/(\s*$)/g, '');
	},

	trim: function(value) {
		return value || value.replace(/(^\s*)|(\s*$)/g, '');
	},

	isEmpty: function(value) {
		return !!value;
	},

	isNumber: function(value) {
		try {
			Number(value);
		} catch (e) {
			return false;
		}
		return true;
	},

	isNumberOrLetter: function(value) {
		return new RegExp("^[0-9a-zA-Z]+$").test(value);
	},

	isKorean: function(value) {
		var returnValue = false;

		if (value.substring(0, 2) == "%u") {
			returnValue = (value.substring(2,4) != "00");
		} else if (value.substring(0, 1) == "%") {
			returnValue = (parseInt(value.substring(1,3), 16) > 127);
		}

		return returnValue;
	},

	/**
	 * 특정문자열로 split한 값중 특정번째 값
	 * 
	 * @param value the value
	 * @param sep the sep
	 * @param index the index
	 * @returns {String}
	 */
	word: function (value, sep, index) {
		var returnValue = '';

		if (!!value) {
			var lists = value.split(sep);
			returnValue = (index == -1) ? lists[lists.length - 1] : ((lists.length - 1) < index ? "" : lists[index]);
		}

		return returnValue;
	},

	/**
	 * insertComma
	 *
	 * 숫자에 콤마(,)가 삽입된 문자열 리턴
	 * 
	 * @param value the value
	 * @returns {String}
	 */
	insertComma: function(value) {
		var nValue = value.split('.'); // Separates the components of the number
		nValue[0] = Number(String(nValue[0])).toLocaleString().slice(0, -3);
		return nValue.join('.'); // Combines the two sections
	},

	/**
	 * removeComma
	 *
	 * 문자열에 콤마(,)가 제거된 숫자 리턴
	 * 
	 * @param value the value
	 * @returns {Number}
	 */
	removeComma: function(/** String */ value) {
		return Number(String(value).replace(/,/g,""));
	},

	/**
	 * containsChars
	 *
	 * 입력값에 특정 문자(chars)가 있는지 체크 (특정 문자를 허용하지 않으려 할 때 사용)
	 * 
	 * ex) if (containsChars(form.name,"!,*&^%$#@~;")) { alert("이름 필드에는 특수 문자를 사용할 수 없습니다."); }
	 *
	 * @param input the input
	 * @param chars the chars
	 * @returns {Boolean}
	 */
	containsChars: function(input, chars) {
		var returnValue = false;

		for (var inx = 0; inx < input.value.length; inx++) {
			if (chars.indexOf(input.value.charAt(inx)) != -1) {
				returnValue = true;
				break;
			}
		}

		return returnValue;
	},

	/**
	 * inArray
	 *
	 * 입력값이 배열내에 있는지 체크
	 *
	 * @param needle 입력값
	 * @param haystack 대상 배열
	 */
	inArray: function(needle, haystack) {
		for (var e in haystack) {
			if (needle == e) { return true; }
		}
		return false;
	},

	/**
	 * getRealLength
	 *
	 * 바이트단위 문자열 길이 구하기.
	 * 
	 * @param strValue the str value
	 * @returns {Number}
	 */
	getRealLength: function(strValue) {
		var strCode;
		var strLength = 0;
		if (!!strValue) {
			for (var i = 0; i < strValue.length; i++) {
				strCode = strValue.charCodeAt(i);
				strLength += (strCode > 255) ? 2 : 1;
			}
		}
		return strLength;
	},

	/**
	 * getRealString
	 *
	 * 바이트단위 문자열 절삭.
	 * 
	 * @param strValue the str value
	 * @param realLength the real length
	 * @returns {String}
	 */
	getRealString: function(strValue, realLength) {
		var returnValue = "";
		var strCode;
		var strLength = 0;
		if (!!strValue) {
			for (var i = 0; i < strValue.length; i++) {
				strCode = strValue.charCodeAt(i);
				strLength += (strCode > 255) ? 2 : 1;
				if (strLength > realLength) {
					returnValue = strValue.substring(0, i);
					break;
				}
			}
		}
		return returnValue;
	},

	/**
	 * decToHex
	 *
	 * 문자열의 hexa값 encoding&decoding 함수
	 * 
	 * @param x the x
	 * @returns {String}
	 */
	decTohex: function(x) {
		var chex = "0123456789ABCDEF";
		var hexval = [];
		var tmpval = x;

		for (var i = 0; i < hexval.length; i++) {
			hexval[i] = "";
		}

		if (tmpval >= 16) {
			while (tmpval >= 16) {
				tmpRem = tmpval % 16;
				tmpmok = (tmpval - tmpRem) / 16;
				hexval[i] = chex.charAt(tmpRem);
				if (tmpmok < 16) {
					hexval[i + 1] = chex.charAt(tmpmok);
					tmpval = tmpmok;
				} else {
					tmpval = tmpmok;
				}
				i++;
			}
		} else {
			hexval = chex.charAt(tmpval);
		}

		converthex = '';
		hexval.reverse();

		for (var k = 0; k < hexval.length; k++) {
			converthex += hexval[k];
		}

		return converthex;
	}
};