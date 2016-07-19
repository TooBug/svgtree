const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 500;

import Svg from './svg';

class Canvas{
	constructor($container, options){
		this.width = options.width || DEFAULT_WIDTH;
		this.height = options.height || DEFAULT_HEIGHT;
		this._svg = new Svg('svg', {
			width:options.width,
			height:options.height
		});
		this._canvas = new Svg('g', {
			width:options.width,
			height:options.height
		});
		this._dnd();
		this._svg.appendChild(this._canvas);
		$container.appendChild(this._svg.element);
	}
	_dnd(){
		let dnd = new Svg('rect', {
			width: this._canvas.width,
			height: this._canvas.height,
			style: 'stroke:none;fill:white;cursor:-webkit-grab;'
		});
		this._svg.appendChild(dnd);

		dnd = dnd.element;
		var g = this._canvas;
		g.x = 0;
		g.y = 0;
		g.scale = 1;

		(function(){
			var x,y,px,py,moving = false;
			dnd.addEventListener('mousedown',function(e){
				console.log('mousedown');
				x = g.x;
				y = g.y;
				px = e.pageX;
				py = e.pageY;
				moving = true;
				// dnd.setAttribute('style','stroke:none;fill:white;cursor:-webkit-grabbing;');
			},false);
			document.addEventListener('mousemove',function(e){
				if(!moving) return;
				var deltaX = e.pageX - px;
				var deltaY = e.pageY - py;
				// g.setAttribute('cx', x + deltaX);
				// g.setAttribute('cy', y + deltaY);
				g.x = x + deltaX;
				g.y = y + deltaY;
				// console.log('mousemove',g.x,g.y);
				g.setAttribute('transform',`translate(${g.x},${g.y}),scale(${g.scale})`);

				// svgTree.updatePath(path,100,100,x + deltaX,y + deltaY);
			},false);
			document.addEventListener('mouseup',function(e){
				moving = false;
				// dnd.setAttribute('style','stroke:none;fill:white;cursor:-webkit-grab;');
			},false);

			var timer;
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
			},false);

		})();
	}
	clear(){
		this._canvas.clear();
	}
	bindEvent(event, callback){
		if(typeof callback === 'function'){
			this._canvas.bindEvent(event, callback);
		}
	}
	appendNode(node){
		this._canvas.appendChild(node.element);
	}
	appendPath(path){
		this._canvas.appendChild(path);
	}
}

export default Canvas;