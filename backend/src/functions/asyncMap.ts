/**
 * @description Loop through an array asynchronously. Uses the `Promise.all()` function
 */
export default function asyncMap(arr: any[], cb: Function) {
	return Promise.all(
		arr.map(
			(...args) =>
				new Promise(async (resolve, reject) => {
					try {
						const res = await cb(...args);
						resolve(res);
					} catch (err) {
						reject(err);
					}
				})
		)
	);
}

/**
 * @description Loop through an array asynchronously. Uses the `Promise.allSettled()` function
 */
export function asyncSettled(arr: any[], cb: Function) {
	return Promise.allSettled(
		arr.map(
			(...args) =>
				new Promise(async (resolve, reject) => {
					try {
						const res = await cb(...args);
						resolve(res);
					} catch (err) {
						reject(err);
					}
				})
		)
	);
}
