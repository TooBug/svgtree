let dnd = {};

dnd.init = function(options = {}){
	let $elem = options.$element;
	let moving = false;
	let x = options.initPosition.x;
	let y = options.initPosition.y;
	let px,py,tmpX,tmpY;
	let scale = 1;

	// 阻止点击事件冒泡
	$elem.addEventListener('click',function(e){
		e.stopPropagation();
	},false);

	$elem.addEventListener('mousedown',function(e){
		e.stopPropagation();
		console.log('mousedown');
		px = e.pageX;
		py = e.pageY;
		moving = $elem;
		if(options.onStart) options.onStart();
	},false);

	document.addEventListener('mousemove',function(e){
		e.stopPropagation();
		if(moving !== $elem) return;
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
		e.stopPropagation();
		e.preventDefault();
		if(moving !== $elem) return;
		
		x = tmpX;
		y = tmpY;
		moving = false;
		if(options.onStop) options.onStop({
			x,
			y
		});
	},false);

	if(options.onScale){
		var timer;
		$elem.addEventListener('mousewheel',function(e){
			if(!e.ctrlKey) return;
			var delta = e.deltaY;
			if(delta === 0) return;
			if(delta > 0){
				delta = 1 - 0.5/40*delta;
			}else if(delta < 0){
				delta = 1 - 0.5/40*delta;
			}
			scale *= delta;
			if(scale < 0.1) scale = 0.1;
			if(scale > 2) scale = 2;

			clearTimeout(timer);
			timer = setTimeout(function(){
				if(scale >= 0.9 && scale <= 1.1){
					scale = 1;
					options.onScale(scale);
				}
			},100);
			options.onScale(scale);
			return false;
		},false);
	}

};

export default dnd;