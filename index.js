import express from 'express';
import HTMLParser from 'node-html-parser';
import fetch from 'node-fetch';
import path from 'path';
import fs, { exists } from 'fs';


const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;


function getDBData() {
	return JSON.parse(
		fs.readFileSync('data.json', 'utf-8')
	);
}

function saveData(json, callback) {
	fs.writeFileSync('data.json', JSON.stringify(json, null, '\t'));
	if(typeof callback === 'function') callback();
}


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.json())



app.use(express.static(path.join(__dirname, '/public')));



app.get('/', (req, res) => {
	res.sendFile('index.html', {
		root: path.join(__dirname, '/public'),
	});
});



app.get('/api/mangas', (req, res) => {
	const jsonData = getDBData();

	const data = [];

	jsonData['mangas'].forEach(manga => {
		const {
			name,
			urlName,
			chapter,
			subscribed,
			lastChapter,
			coverUrl,
		} = manga;

		data.push({
			name,
			urlName,
			chapter,
			subscribed,
			lastChapter,
			coverUrl,
		});
	});

	res.send(data);
});




app.get('/api/image/*', async (req, res) => {
	const imgUrl = req.params[0];

	const raw = await fetch(decodeURI('https://' + imgUrl));
	const blob = await raw.blob();
	const buf = await blob.arrayBuffer();
	
	res.send(Buffer.from(buf));
});




app.post('/api/chapterProgress', (req, res) => {
	const { mangaName, chapter } = req.body;

	const jsonData = getDBData();

	const exists = jsonData['mangas'].some(manga => {
		if(manga['urlName'] === mangaName) {
			manga['chapter'] = chapter;
			return true;
		}
	});

	if(exists) {
		saveData(jsonData, () => {
			res.status(200);
		});
	}
});




app.get('/:mangaName/:chapter', (req, res) => {
	res.sendFile('page.html', {
		root: path.join(__dirname, '/public'),
	});
});




app.get('/api/:mangaName/:chapter', (req, res) => {
	const { mangaName, chapter } = req.params;

	const jsonData = getDBData();

	
	jsonData['mangas'].some(async manga => {

		for(const site of manga['sites']) {
			const host = jsonData['hosts'].find(host => host['siteName'] === site['siteName']);


			const url = host['path']
				.replace('%name%', site['mangaName'])
				.replace('%chapter%', chapter);
			

			try {
				const raw = await fetch(url);
				const html = await raw.text();

				const document = HTMLParser.parse(html);
				const elements = document.querySelectorAll(host['querySelector']);

				const data = [];

				for(let i = 0; i < elements.length; i++) {
					let src = elements[i].getAttribute('src').trim();
					
					if(!src.startsWith(`https://${host['siteName']}`)) {
						src = host['siteName'] + src;
					}

					data.push(src);
				};


				res.json(data);
				return true;
			} catch(err) {
				continue;
			}
		}
	});
});






app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});