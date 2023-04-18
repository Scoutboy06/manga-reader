import chalk from 'chalk';
import checkUpdates from './checkUpdates.js';

export default async function updatesChecker() {
	const intervalDelay = 120; // minutes
	console.log(
		chalk.blue(
			`Updates checker is activated with an interval of ${intervalDelay} minutes.`
		)
	);

	setInterval(checkUpdates, 1000 * 60 * intervalDelay);
	checkUpdates();
}
