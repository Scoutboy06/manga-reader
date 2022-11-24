/*
Usage:
asyncMap(arr, async (item, i) => {
	// To stop you just return the function
	// To reject you throw an error

	if(error) throw new Error('Error message');

});

Is equivalent of calling
Promise.all(array.map((item, i) => new Promise((resolve, reject) => {
	...
})));

but without resolve() and reject()
*/

export default function (arr, cb) {
	return Promise.all(arr.map((...args) => new Promise(async (resolve, reject) => {
		try {
			const res = await cb(...args);
			resolve(res);
		} catch (err) {
			reject(err);
		}
	})));
};