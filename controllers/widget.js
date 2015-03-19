// LOAD HELPER FILE
var helper = require(WPATH('helper'));
var moment = require(WPATH('moment.min'));

var monthCorrection = 0;
var iDayBlockCounter = 1;
var aDayBlocks = [];
var aWeeks = [$.week1, $.week2, $.week3, $.week4, $.week5, $.week6];

var today = moment().toString();
var todayId = moment().format('D');
var todayName = moment().locale('nl').format('dddd').toString();

var monthId;
var monthName;
var monthDays;
var monthYear;
var monthFirsyDayName;
var monthFirsyDayId;

Ti.API.info('-------------------------');
Ti.API.info('Today: ' + today);
Ti.API.info('Today ID: ' + todayId);
Ti.API.info('Today name: ' + todayName);

function click(e) {
	Ti.API.info(e.source.title + ' | ' + e.source.monthName + " | " + e.source.monthId + " | " + e.source.year);
}

function prev() {
	// MONTHCORRECTION - 1
	monthCorrection--;
	// UPDATE CONSOLE
	update();
}

function next() {
	// MONTHCORRECTION + 1
	monthCorrection++;
	// UPDATE CONSOLE
	update();
}

function update() {

	monthId = moment().add(monthCorrection, 'months').format('M');
	monthName = moment().add(monthCorrection, 'months').locale('nl').format('MMMM');
	monthDays = moment().add(monthCorrection, 'months').daysInMonth();
	monthYear = moment().add(monthCorrection, 'months').format('YYYY');
	monthFirsyDayName = moment().add(monthCorrection, 'months').subtract(todayId - 1, 'days').locale('nl').format('dddd');
	monthFirsyDayId = moment().add(monthCorrection, 'months').subtract(todayId - 1, 'days').format('d');

	Ti.API.info('-------------------------');
	Ti.API.info('Month ID:' + monthId);
	Ti.API.info('Month name: ' + monthName);
	Ti.API.info('Month total days: ' + monthDays);
	Ti.API.info('Month year: ' + monthYear);
	Ti.API.info('Month first day: ' + monthFirsyDayName);
	Ti.API.info('Month first day ID: ' + monthFirsyDayId);

	drawCalender();
}


function drawCalender() {
	// RESET DAYBLOCK COUNTER
	iDayBlockCounter = 1;
	// EMPTY DAYBLOCK ARRAY
	aDayBlocks = [];
	// CLEAR CALENDER
	clearCalender();
	// DATE UI BLOCK ID'S
	var iFirstDayBlock = helper.getFirstDayId(monthFirsyDayId);

	$.navTitle.setText(monthName);

	for(var i = 1; i <= 42; i++) {
		var dayBlock = eval('$.day'+i);

		if(i >= iFirstDayBlock && iDayBlockCounter <= monthDays) {

			// MARK TODAY
			if(monthCorrection == 0 && iDayBlockCounter == todayId) {
				var color = 'green';
			} else {
				var color = '#FFF';
			}
			// CHANGE UI PROPERTIES
			dayBlock.applyProperties({
				backgroundColor: color,
				title: iDayBlockCounter,
				monthName: monthName,
				monthId: monthId,
				year: monthYear
			});
			// IDAYBLOCKCOUNTER + 1
			iDayBlockCounter++;
		} else if (monthDays >= 30 && iFirstDayBlock >= 7) {
			addWeek();
		} else {
			removeWeek();
		}
		// PUSH TO ADAYBLOCKS ARRAY
		aDayBlocks.push(dayBlock);
	}
}

function clearCalender() {
	for(var i = 1; i <= 42; i++) {
		var dayBlock = eval('$.day'+i);
		// CHANGE UI PROPERTIES
		dayBlock.applyProperties({
			backgroundColor: '#fff',
			title: "",
			monthName: "",
			monthId: "",
			year: ""
		});
	}
}

function removeWeek() {
	for(var i = 0; i < aWeeks.length; i++) {
		if(i == aWeeks.length - 1) {
			aWeeks[i].setVisible(false);
			aWeeks[i].setHeight(0);
		} else {
			aWeeks[i].setHeight('20%');
		}
	}
}

function addWeek() {
	for(var i = 0; i < aWeeks.length; i++) {
		aWeeks[i].setVisible(true);
		aWeeks[i].setHeight('16.666%');
	}
}




update();

// ADD EVENTLISTENERS
for(var i = 0; i < aDayBlocks.length; i++) {
	aDayBlocks[i].addEventListener('click', click);
}