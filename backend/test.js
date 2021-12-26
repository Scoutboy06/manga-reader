import fs from 'fs';
import fetch from 'node-fetch';

const url = 'http://127.0.0.1:5001/api/getUpdates';

async function execute() {
	const raw = await fetch(url);
	const json = await raw.json();
	fs.writeFileSync('./data.json', JSON.stringify(json[1], null, 2));
}

execute();
