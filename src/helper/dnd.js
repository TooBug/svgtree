let dnd = {};

dnd.init = function(options = {}){
	let $elem = options.$element;
	let isMoving = false;
	let x = options.initPosition.x;
	let y = options.initPosition.y;
	let px,py,tmpX,tmpY;
	$elem.addEventListener('mousedown',function(e){
		console.log('mousedown');
		px = e.pageX;
		py = e.pageY;
		isMoving = true;
		if(options.onStart) options.onStart();
	},false);

	document.addEventListener('mousemove',function(e){
		if(!isMoving) return;
		let deltaX = e.pageX - px;
		let deltaY = e.pageY - py;
		tmpX = x + deltaX;
		tmpY = y + deltaY;
		if(options.onMove) options.onMove({
			x:tmpX,
			y:tmpY
		});
	},false);

	document.addEventListener('mouseup',function(e){
		x = tmpX;
		y = tmpY;
		isMoving = false;
		if(options.onStop) options.onStop({
			x,
			y
		});
	},false);

	/*var timer;
	dnd.addEventListener('mousewheel',function(e){
		if(!e.ctrlKey) return;
		var delta = e.deltaY;
		if(delta === 0) return;
		if(delta > 0){
			delta = 1 - 0.5/40*delta;
		}else if(delta < 0){
			delta = 1 - 0.5/40*delta;
		}
		g.scale *= delta;
		if(g.scale < 0.1) g.scale = 0.1;
		if(g.scale > 2) g.scale = 2;

		clearTimeout(timer);
		timer = setTimeout(function(){
			if(g.scale >= 0.9 && g.scale <= 1.1){
				g.scale = 1;
				g.setAttribute('transform',`translate(${g.x},${g.y}),scale(${g.scale})`);
			}
		},100);
		g.setAttribute('transform',`translate(${g.x},${g.y}),scale(${g.scale})`);
		return false;
	},false);*/

};

export default dnd;