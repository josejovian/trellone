const monthArray = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

// 2022-08-25T12:19:00.000Z

/**
 * 
 * @param {String} stringDate Date in string
 * @param {Boolean} isComplete Show with timestamp or not
 * @returns 
 */

export function prettifyDate(stringDate, isComplete=false) {
	const num = stringDate.match(/((\d)+)/g);

	const date = `${parseInt(num[2])} ${monthArray[parseInt(num[1]) - 1]} ${num[0]}`;
	const time = `${num[3]}:${num[4]}`;
	
	if(isComplete)
		return `${date} at ${time}`;
	
	return `on ${date}`;
}

export function getCurrentDate() {
	const date = new Date();

	let monthDigit = date.getMonth() + 1;
	if(monthDigit < 10) {
		monthDigit = `0${monthDigit}`;
	}

	let dayDigit = date.getDate();
	if(dayDigit < 10) {
		dayDigit = `0${monthDigit}`;
	}

	return `${date.getFullYear()}-${monthDigit}-${dayDigit}T00:00:00.000Z`;
}