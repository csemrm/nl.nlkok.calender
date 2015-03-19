exports.getFirstDayId = function(dayId) {
	return (dayId == 0) ? 7 : dayId;
};

exports.capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};