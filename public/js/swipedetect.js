function swipedetect(el, callback) {

	var touchsurface = el,
			swipedir,
			startX,
			distX,
			threshold = 50, //required min distance traveled to be considered swipe
			allowedTime = 300, // maximum time allowed to travel that distance
			elapsedTime,
			startTime,
			handleswipe = callback || function (swipedir) {}

			touchsurface
					.addEventListener('touchstart', function (e) {
							var touchobj = e.changedTouches[0];
							swipedir = 'none';
							distX = 0;
							startX = touchobj.pageX;
							startTime = new Date().getTime(); // record time when finger first makes contact with surface
							// e.preventDefault();
					}, { passive: false })

	// touchsurface.addEventListener('touchmove', function (e) {
	// 		e.preventDefault(); // prevent scrolling when inside DIV
	// }, { passive: false });

	touchsurface.addEventListener('touchend', function (e) {
			var touchobj = e.changedTouches[0];
			distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
			elapsedTime = new Date().getTime() - startTime; // get time elapsed
			if (elapsedTime <= allowedTime) { // first condition for awipe met
					if (Math.abs(distX) >= threshold) { // 2nd condition for horizontal swipe met
							swipedir = (distX < 0)
									? 'left'
									: 'right'; // if dist traveled is negative, it indicates left swipe
					}
			}
			handleswipe(swipedir);
			// e.preventDefault();
	}, { passive: false });
}


swipedetect(document.body, swipedir => {
	if(swipedir === 'right') newChapter(-1);
	else if(swipedir === 'left') newChapter(1);
});