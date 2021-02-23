const $ = s => s[0] == '#' ? document.querySelector(s) : document.querySelectorAll(s);

const root = $('#root');
const title = $('#title');


window.addEventListener('load', async () => {
	const raw = await fetch('/api/manga');
	const json = await raw.json();

	console.log(json);

	json.forEach(manga => {
		const a = document.createElement('a');
		a.setAttribute('href', `/${manga['urlName']}/${manga['chapter']}`);
		a.classList.add('item');

		a.innerHTML = `
<div class="img">
	<img src="/api/image/${manga['coverUrl']}">
</div>
<div class="footer">
		<span>${manga['name']}</span>
</div>`;

		root.appendChild(a);
	});
});