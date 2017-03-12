/**
 * ValidateUtil.js
 *
 * 입력값 검증 툴
 *
 * @author mornya
 */
var ValidateUtil = function(){
	this._init();
};
ValidateUtil.prototype = {
	_init: function() {
		this._regExp = {
			email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/,
			telNo: /^0[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}$/,
			mobile: /01[0-9]-[0-9]{3,4}-[0-9]{4}$/,
			url: /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/
		};
		this._acceptableFileExt = [
			'jpg', 'jpeg', 'gif', 'bmp', 'png', 'tif', 'ppt', 'doc', 'xls', 'xlsx',
			'csv', 'hwp', 'txt', 'pdf', 'zip', 'rar', '7z', 'alz', 'wma', 'wav'
		];
	},

	/**
	 * isValidFormat
	 *
	 * 입력값 체크
	 * (true:올바른 포맷 / false:잘못된 포맷)
	 * 
	 * @param input the input
	 * @param format the format
	 * @returns {Boolean}
	 */
	isValidFormat: function(input, format) {
		return (input.value.search(format) != -1);
	},

	/**
	 * isValidEmail
	 *
	 * 이메일 형식인지 체크
	 * 
	 * @param input the input
	 * @returns {Boolean}
	 */
	isValidEmail: function(input) {
		return this.isValidFormat(input, this._regExp.email);
	},

	/**
	 * isValidTel
	 *
	 * 전화번호 형식인지 체크
	 * 
	 * @param input the input
	 * @returns {Boolean}
	 */
	isValidTel: function(input) {
		return this.isValidFormat(input, this._regExp.telNo);
	},

	/**
	 * isValidMobile
	 *
	 * 핸드폰 형식인지 체크
	 * 
	 * @param input the input
	 * @returns {Boolean}
	 */
	isValidMobile: function(input) {
		return this.isValidFormat(input, this._regExp.mobile);
	},

	/**
	 * isValidURL
	 *
	 * URL 형식인지 체크
	 *
	 * @param input the input
	 * @returns {Boolean}
	 */
	isValidURL: function(input) {
		return this.isValidFormat(input, this._regExp.url);
	},

	/**
	 * isValidSSN
	 *
	 * 주민등록번호를 검사한다.
	 * 
	 * 체크방법: 
	 * (1) 주민등록번호 각각의 수에 234567892345를 순서대로 자리수에 맞게 12자리만 각각 곱한다.
	 * (2) 곱해서 나온 결과값을 모두 합한다.
	 * (3) 11 - (합한 값을 11로 나눈 나머지 값)을 한다.
	 * (4) 최종결과값이 주민등록번호 마지막자리와 같아야 한다.
	 * 
	 * @param ssn the ssn
	 * @returns {Boolean}
	 */
	isValidSSN: function(ssn) {
		var repSsn = ssn.replace(/-/g, '');
		if (repSsn.length != 13) {
			return false;
		}

		manno1 = this.trim(repSsn).substring(0,6);
		manno2 = this.trim(repSsn).substring(6,13);

		c1 = manno1.substring(0,1);
		c2 = manno1.substring(1,2);
		c3 = manno1.substring(2,3);
		c4 = manno1.substring(3,4);
		c5 = manno1.substring(4,5);
		c6 = manno1.substring(5,6);
		c7 = manno2.substring(0,1);
		c8 = manno2.substring(1,2);
		c9 = manno2.substring(2,3);
		c10 = manno2.substring(3,4);
		c11 = manno2.substring(4,5);
		c12 = manno2.substring(5,6);
		c13 = manno2.substring(6,7);

		c1 = c1 * 2;
		c2 = c2 * 3;
		c3 = c3 * 4;
		c4 = c4 * 5;
		c5 = c5 * 6;
		c6 = c6 * 7;
		c7 = c7 * 8;
		c8 = c8 * 9;
		c9 = c9 * 2;
		c10 = c10 * 3;
		c11 = c11 * 4;
		c12 = c12 * 5;

		no = c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + c9 + c10 + c11 + c12;
		no = (no % 11);
		no = 11 - no;
		if (no > 9) {
			no = (no % 10);
		}

		return !(no != c13 || (c7 > 2 && c7 < 1));
	},

	/**
	 * isValidBizNo
	 *
	 * 사업자등록번호 체크
	 * 
	 * @param regno1 the regno1
	 * @param regno2 the regno2
	 * @param regno3 the regno3
	 * @returns {Boolean}
	 */
	isValidBizNo: function(regno1, regno2, regno3) {
		var biz_value = new Array(10);

		if ((regno1.length != 3) || (regno2.length != 2) || (regno3.length != 5)) {
			return false;
		}

		try {
			Number(regno1);
			Number(regno2);
			Number(regno3);
		} catch (e) {
			return false;
		}

		var objstring = [regno1, '-', regno2, '-', regno3].join('');
		var li_temp, li_lastid;

		biz_value[0] = (parseFloat(objstring.substring(0 ,1))) % 10;
		biz_value[1] = (parseFloat(objstring.substring(1 ,2)) * 3) % 10;
		biz_value[2] = (parseFloat(objstring.substring(2 ,3)) * 7) % 10;
		biz_value[3] = (parseFloat(objstring.substring(4 ,5))) % 10;
		biz_value[4] = (parseFloat(objstring.substring(5 ,6)) * 3) % 10;
		biz_value[5] = (parseFloat(objstring.substring(7 ,8)) * 7) % 10;
		biz_value[6] = (parseFloat(objstring.substring(8 ,9))) % 10;
		biz_value[7] = (parseFloat(objstring.substring(9,10)) * 3) % 10;
		li_temp = parseFloat(objstring.substring(10,11)) * 5 + '0';
		biz_value[8] = parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
		biz_value[9] = parseFloat(objstring.substring(11,12));
		li_lastid = (10 - ((biz_value[0] + biz_value[1] + biz_value[2] + biz_value[3] + biz_value[4] + biz_value[5] + biz_value[6] + biz_value[7] + biz_value[8]) % 10)) % 10;

		return (biz_value[9] == li_lastid);
	},

	/**
	 * isValidFileExt
	 *
	 * 등록 가능한 파일 확장자인지 확인.
	 * 
	 * @param fileName the file name
	 * @returns {Boolean}
	 */
	isVaildFileExt: function(fileName) {
		var fileExt = fileName.slice(fileName.lastIndexOf('.')+1).toLowerCase();

		if (!!fileExt) {
			for (var a in this._acceptableFileExt.length) {
				if (fileExt.indexOf(this._acceptableFileExt[a]) != -1) {
					return true;
				}
			}
		}

		return false;
	}
};
