/**
 * DateUtil.js
 *
 * @author mornya
 */
var DateUtil = function(){};
DateUtil.prototype = {
	/**
	 * formatDate
	 *
	 * 날짜 객체를 문자열 바꾸어 리턴.
	 * 만약 separator가 있다면 해당 구분자로 연결.
	 * 돌려질 문자열은 YYYY, MM, DD 포맷으로 구성된 날짜라 가정.
	 * 
	 * @returns {String}
	 */
	formatDate: function(/** Date */ _date, separator) {
		var month = _date.getMonth() + 1;
		var date = _date.getDate();

		month = ((month < 10) ? '0':"") + month;
		date = ((date < 10) ? '0':"") + date;
		separator = (typeof separator == "undefined") ? "" : separator;

		return [_date.getFullYear(), separator, month, separator, date].join('');
	},

	/**
	 * parseDate
	 *
	 * 문자열로 된 날짜를 해석하여 날짜 객체로 리턴.
	 * 만약 주어진 문자열이 8자리로 되어 있으면 separator로 끊는 것이 아니라 4,2,2의 길이로 끊음.
	 * 주어진 문자열은 YYYY, MM, DD 포맷으로 구성된 날짜라 가정.
	 *
	 * @params dateStr the date string
	 * @params separator the separator
	 * @returns {Date}
	 */
	parseDate: function(/** String */ dateStr, separator) {
		var date;
		if (dateStr.length == 8) {
			date = [dateStr.substring(0,4), dateStr.substring(4,6), dateStr.substring(6,8)];
		} else {
			date = dateStr.split(separator);
		}

		var parsed;
		switch (date.length) {
			case 3:
				parsed = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]));
				break;
			case 6:
				parsed = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), date[3], date[4], date[5]);
				break;
			default:
				parsed = null;
				break;
		}

		// parsed가 null이면 잘못된 날짜 정보
		return parsed;
	},

	/**
	 * getWeekDate
	 *
	 * 현재일자가 포함된 주의 일요일에 해당하는 날짜를 리턴.
	 * 
	 * @param date the Date
	 * @returns {Date}
	 */
	getWeekDate: function(/** Date */ date) {
		var rtnDate = new Date(
			date.getFullYear(), date.getMonth(), date.getDate(),
			date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()
		);

		// 86400000 = 1 day (24 * 60 * 60 * 1000)
		rtnDate.setTime(rtnDate.getTime() - (rtnDate.getDay() * 86400000)); 

		return rtnDate;
	},

	/**
	 * addTime
	 *
	 * 주어진 날짜에 addTime만큼의 시간을 더하거나 뺀 날짜 객체를 넘김.
	 *
	 * @param date the Date
	 * @param addTime the add time
	 * @returns {Date}
	 */
	addTime: function(/** Date */ date, addTime) {
		var rtnDate = new Date(
			date.getFullYear(), date.getMonth(), date.getDate(),
			date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()
		);
		if (rtnDate.toString() !== 'NaN') {
			rtnDate.setTime(rtnDate.getTime() + addTime);
		} else {
			rtnDate = null;
		}
		return rtnDate;
	},

	/**
	 * addHour
	 *
	 * 주어진 날짜에 addHours만큼의 시간을 더하거나 뺀 날짜 객체를 넘김.
	 * 
	 * @param date the Date
	 * @param addHours the add hours
	 * @returns {Date}
	 */
	addHour: function(/** Date */ date, addHours) {
		// 36000000 = 1hour (60 * 60 * 1000)
		return this.addTime(date, 36000000 * addHours);
	},

	/**
	 * addDay
	 *
	 * 주어진 날짜에 addDays만큼의 날짜를 더하거나 뺀 날짜 객체를 넘김.
	 * 
	 * @param date the Date
	 * @param addDays the add days
	 * @returns {Date}
	 */
	addDay: function(/** Date */ date, addDays) {
		// 86400000 = 1day (24 * 60 * 60 * 1000)
		return this.addTime(date, 86400000 * addDays);
	},

	/**
	 * addMonth
	 *
	 * 주어진 날짜에 addMonths만큼의 달을 더하거나 뺀 날짜 객체를 넘김.
	 * 이 함수는 오라클의 ADD_MONTHS 함수처럼 동작함.
	 * 
	 * addMonth("20070531", -1) > 20070430 addMonth("20070630", -1) > 20070531
	 * addMonth("20070228", -1) > 20070131
	 * 
	 * @param date the Date
	 * @param addMonths the add months
	 * @returns {Date}
	 */
	addMonth: function(/** Date */ date, addMonths) {
		var lastDayInThisMonth = this.getLastDayInMonth(date);
		var iMonth = (date.getMonth() + addMonths) % 12;
		var iYear = date.getFullYear() + Math.floor(iMonth / 12);
		var newDate = new Date(iYear, iMonth, 1);
		var lastDayInPrevMonth = this.getLastDayInMonth(newDate);

		if (this.formatDate(date) == this.formatDate(lastDayInThisMonth) || date.getDate() > lastDayInPrevMonth.getDate()) {
			return lastDayInPrevMonth;
		}

		newDate.setDate(date.getDate());

		return newDate;
	},

	/**
	 * addYear
	 *
	 * 주어진 날짜에 addYears만큼의 연도를 더하거나 뺀 날짜 객체를 넘김.
	 * 
	 * @param date the Date
	 * @param addYears the add years
	 * @returns {Date}
	 */
	addYear: function(/** Date */ date, addYears) {
		var rtnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		rtnDate.setYear(rtnDate.getFullYear() + addYears);

		return rtnDate; 
	},

	/**
	 * isLeapYear
	 *
	 * 날짜가 윤년인지 아닌지를 판단.
	 * 윤년일경우 true를, 아닐경우 false를 리턴.
	 * 
	 * @param date the Date
	 * @returns {Boolean}
	 */
	isLeapYear: function(/** Date */ date) {
		var curYear = date.getFullYear();
		return (((curYear % 4) === 0 && (curYear % 100) !== 0) || curYear % 400 === 0);
	},

	/**
	 * getLastDayInMonth
	 *
	 * 해당 날짜의 달 중에 가장 나중의 날짜를 리턴.
	 *
	 * @param date the Date
	 * @returns {Date} 날짜 객체
	 */
	getLastDayInMonth: function(/** Date */ date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;

		if (month === 12) {
			year++;
			month = 1;
		}

		return this.addDay(new Date(year, month, 1), -1);
	},

	/**
	 * diffDays
	 *
	 * 두 날짜의 간격을 날수로 돌려줌.
	 * 
	 * ex1) diffDays(parseDate('20070101'), parseDate('20070107')) = 6 ==>
	 * 20070107000000 - 20070101000000 과 같다.
	 * 
	 * @param sDate the start date
	 * @param eDate the end date
	 * @returns {Number} 두 날짜의 날수
	 */
	diffDays: function(/** Date */ sDate, /** Date */ eDate) {
		return (eDate.getTime() - sDate.getTime()) / 86400000; // 1day (24 * 60 * 60 * 1000)
	},

	/**
	 * isValidDate
	 *
	 * 날짜 validation check.
	 * 
	 * @param dateString the date string
	 * @returns {Boolean}
	 */
	isValidDate: function(dateString) {
		var returnValue = false;
		var dt = (dateString.replace(/-/g, '/')).replace(/\./g, '/');
		var date1 = new Date(dt);

		if (date1.toString() !== 'NaN') {
			dt = (dt.replace(/:/g, '/')).replace(/ /g, '/');
			var dt_list = dt.split('/');
			var Y1 = dt_list[0];
			var M1 = (dt_list[1].length < 2) ? '0' + dt_list[1] : dt_list[1];
			var D1 = (dt_list[2].length < 2) ? '0' + dt_list[2] : dt_list[2];
			var h1, m1, s1;
			if (dt_list.length == 3) {
				h1 = '00';
				m1 = '00';
				s1 = '00';
			} else {
				h1 = (dt_list[3].length < 2) ? '0' + dt_list[3] : dt_list[3];
				m1 = (dt_list[4].length < 2) ? '0' + dt_list[4] : dt_list[4];
				s1 = (dt_list[5].length < 2) ? '0' + dt_list[5] : dt_list[5];
			}
			var Y2 = date1.getFullYear();
			var M2 = date1.getMonth()+1;
			var D2 = date1.getDate();
			var h2 = date1.getHours();
			var m2 = date1.getMinutes();
			var s2 = date1.getSeconds();
			M2 = (M2.length < 2) ? '0' + M2 : M2;
			D2 = (D2.length < 2) ? '0' + D2 : D2;
			h2 = (h2.length < 2) ? '0' + h2 : h2;
			m2 = (m2.length < 2) ? '0' + m2 : m2;
			s2 = (s2.length < 2) ? '0' + s2 : s2;

			returnValue = (Y1 == Y2 && M1 == M2 && D1 == D2 && h1 == h2 && m1 == m2 && s1 == s2);
		}

		return returnValue;
	}
};
