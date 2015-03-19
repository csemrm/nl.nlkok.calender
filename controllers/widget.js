var args = arguments[0] || {};
// LOAD HELPER FILE
var helper = require(WPATH('helper'));
var moment = require(WPATH('moment.min'));
var fa     = require(WPATH('fa'));

var monthCorrection = 0;
var iDayBlockCounter = 1;
var aDayBlocks = [];
var aWeeks = [$.week1, $.week2, $.week3, $.week4, $.week5, $.week6];

var today = moment().toString();
var todayId = moment().format('D');
var todayName = moment().locale(args.locale).format('dddd').toString();

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

// UPDATE NAV BTNS
$.navLeftBtn.setTitle(fa.arrowCircleOLeft);
$.navRightBtn.setTitle(fa.arrowCircleORight);
$.navLeftBtn.setColor(args.colors.btn);
$.navRightBtn.setColor(args.colors.btn);

// SET HEIGHT AND WIDTH
var weekWrapperHeight = args.height - $.navigation.getHeight() - $.labelWrapper.getHeight();

Ti.API.info(weekWrapperHeight);
Ti.API.info(weekWrapperHeight / 6);
Ti.API.info((weekWrapperHeight / 6) / 2);


function click(e) {
    var day       = parseInt(e.source.title),
        blockId   = (Ti.Platform.osname == "android") ? e.source._properties.blockId : e.source.blockId,
        monthName = (Ti.Platform.osname == "android") ? e.source._properties.monthName : e.source.monthName,
        monthId   = (Ti.Platform.osname == "android") ? e.source._properties.monthId : e.source.monthId,
        year      = (Ti.Platform.osname == "android") ? e.source._properties.year : e.source.year;

	// CONSOLE LOG
    Ti.API.info(blockId + ' | ' + day + ' | ' + monthName + " | " + monthId + " | " + year + ' ' + aDayBlocks.length);

    // RESET DAYBLOCK COUNTER
    iDayBlockCounter = 1;
	var iFirstDayBlock = helper.getFirstDayId(monthFirsyDayId);
    for (var i = 0; i < aDayBlocks.length; i++) {
        if (i >= iFirstDayBlock && iDayBlockCounter <= monthDays) {
        	Ti.API.info(i + ' en ' + day);
            if (i + 1 == day) {
                // CHANGE UI PROPERTIES TO SELECTED
                aDayBlocks[i].applyProperties({
                    backgroundColor: args.colors.dayBg,
                    borderColor: args.colors.daySelected,
                    color: args.colors.daySelectedLabel
                });
            } else {
                // CHANGE UI PROPERTIES TO DEFAULT (NON-SELECTED)
                aDayBlocks[i].applyProperties({
                    backgroundColor: args.colors.dayBg,
                    borderColor: 'transparent',
                    color: args.colors.dayLabel
                });
            }
            iDayBlockCounter++;
            if(monthCorrection == 0 && iDayBlockCounter == todayId) {
            	// CHANGE UI PROPERTIES TO SELECTED
                aDayBlocks[i].applyProperties({
                    backgroundColor: args.colors.dayCurrent,
                    borderColor: 'transparent',
                    color: args.colors.dayCurrentLabel
                });
            }
        }
    }
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
    monthName = moment().add(monthCorrection, 'months').locale(args.locale).format('MMMM');
    monthDays = moment().add(monthCorrection, 'months').daysInMonth();
    monthYear = moment().add(monthCorrection, 'months').format('YYYY');
    monthFirsyDayName = moment().add(monthCorrection, 'months').subtract(todayId - 1, 'days').locale(args.locale).format('dddd');
    monthFirsyDayId = moment().add(monthCorrection, 'months').subtract(todayId - 1, 'days').format('d');

    if(args.disableHistory && monthCorrection == 0) {
    	$.navLeftBtn.setEnabled(false);
    	$.navLeftBtn.setOpacity(0.5);
    } else {
    	$.navLeftBtn.setEnabled(true);
    	$.navLeftBtn.setOpacity(1);
    }

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

    $.navTitle.setText(helper.capitalizeFirstLetter(monthName) + ' - ' + monthYear);

    for (var i = 1; i <= 42; i++) {
        var dayBlock = eval('$.day' + i);

        if (i >= iFirstDayBlock && iDayBlockCounter <= monthDays) {

            // MARK TODAY
            if (monthCorrection == 0 && iDayBlockCounter == todayId) {
                var labelColor = args.colors.dayCurrentLabel;
                var bgColor = args.colors.dayCurrent;
            } else {
                var labelColor = args.colors.dayLabel;
                var bgColor = args.colors.dayBg;
            }
            // CHANGE UI PROPERTIES
            dayBlock.applyProperties({
                backgroundColor: bgColor,
                blockId: i.toString(),
                color: labelColor,
                font: {
            		fontFamily: args.fonts.days
                },
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
    for (var i = 1; i <= 42; i++) {
        var dayBlock = eval('$.day' + i);
        // CHANGE UI PROPERTIES
        dayBlock.applyProperties({
            backgroundColor: '#fff',
            borderColor: 'transparent',
            blockId: "",
            title: "",
            monthName: "",
            monthId: "",
            year: ""
        });
    }
}

function removeWeek() {
    for (var i = 0; i < aWeeks.length; i++) {
        if (i == aWeeks.length - 1) {
            aWeeks[i].setVisible(false);
            aWeeks[i].setHeight(0);
        } else {
            aWeeks[i].setHeight('20%');
        }
    }
}

function addWeek() {
    for (var i = 0; i < aWeeks.length; i++) {
        aWeeks[i].setVisible(true);
        aWeeks[i].setHeight('16.666%');
    }
}




update();

// ADD EVENTLISTENERS
for (var i = 0; i < aDayBlocks.length; i++) {
    aDayBlocks[i].addEventListener('click', click);
}
