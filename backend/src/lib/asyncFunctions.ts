/**
 * Use `Promise.all` to loop over an array asynchronously
 * @param arr An array to loop over asynchronously
 * @param callback A function that takes an item of the array as an argument
 * @returns A promise that contains the returned value from the callback function
 */
export function promiseAll<T>(
	arr: T[],
	callback: (item?: T, index?: number) => Promise<unknown>
) {
	return Promise.all(
		arr.map(
			(item, i) =>
				new Promise((resolve, reject) =>
					callback(item, i).then(resolve).catch(reject)
				)
		)
	);
}

/**
 * Use `Promise.allSettled` to loop over an array asynchronously
 * @param arr An array to loop over asynchronously
 * @param callback A function that takes an item of the array as an argument
 * @returns A promise that contains the returned value from the callback function
 */
export function promiseSettled<T>(
	arr: T[],
	callback: (item?: T, index?: number) => Promise<unknown>
) {
	return Promise.allSettled(
		arr.map(
			(item, i) =>
				new Promise((resolve, reject) =>
					callback(item, i).then(resolve).catch(reject)
				)
		)
	);
}
