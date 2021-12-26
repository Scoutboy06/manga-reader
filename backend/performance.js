/*
data: [
	{
		groupName: String,
		data: [
			{
				time: Number
				name: String
			}
		]
	},
	{
		time: Number
		name: String
	}
]
*/

class Performance {
	constructor() {
		this.data = [];

		this.startTime = null;
		this.prevTime = null;
		this.callbackFunction = null;
		this.isInGroup = false;
	}

	start() {
		this.data = [];
		this.startTime = performance.now();
		this.prevTime = this.startTime;
	}

	end() {
		console.log('--------------------------------------');
		console.log(this.data);
		console.log('--------------------------------------');
	}

	group(name) {
		this.isInGroup = true;

		this.data.push({
			groupName: name,
			data: [],
		});
	}

	solo() {
		this.isInGroup = false;
	}

	step(name) {
		if (this.isInGroup && this.data[this.data.length - 1]?.groupName) {
			this.data[this.data.length - 1].data.push({
				time: performance.now() - this.prevTime,
				name,
			});
		} else {
			this.data.push({
				time: performance.now() - this.prevTime,
				name,
			});
		}

		this.prevTime = performance.now();
	}
}

export default Performance;
