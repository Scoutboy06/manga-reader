const aMinute = 1000 * 60;
const anHour = aMinute * 60;
const aDay = anHour * 24;
const aWeek = aDay * 7;

export default function relativeTimeString(date: Date): string {
	const timeDiff = Date.now() - date.getTime();

	if (timeDiff < aMinute) return '<1 minute ago';
	if (timeDiff < anHour) {
		const min = getMinutes(timeDiff);
		return `${min} minute${min === 1 ? '' : 's'} ago`;
	}
	if (timeDiff < aDay) {
		const hrs = getHours(timeDiff);
		return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
	}
	if (timeDiff < aWeek) {
		const days = getDays(timeDiff);
		return `${days} hour${days === 1 ? '' : 's'} ago`;
	}

	return date.toLocaleDateString();
}

const getMinutes = (diff: number) => Math.floor(diff / aMinute);
const getHours = (diff: number) => Math.floor(diff / anHour);
const getDays = (diff: number) => Math.floor(diff / aDay);
