const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 500;

import Svg from './svg';
import dnd from './dnd';

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
		let $dnd = new Svg('rect', {
			width: this._canvas.width,
			height: this._canvas.height,
			style: 'stroke:none;fill:white;cursor:-webkit-grab;'
		});
		this._svg.appendChild($dnd);

		$dnd = $dnd.element;
		var g = this._canvas;
		g.x = 0;
		g.y = 0;
		g.scale = 1;

		dnd.init({
			$element:$dnd,
			initPosition:{
				x:g.x,
				y:g.y
			},
			onMove:(position)=>{
				g.setAttribute('transform',`translate(${position.x},${position.y}),scale(${g.scale})`);
			},
			onStop:(position)=>{
				g.x = position.x;
				g.y = position.y;
				g.setAttribute('transform',`translate(${position.x},${position.y}),scale(${g.scale})`);
			},
			onScale:(scale)=>{
				g.scale = scale;
				g.setAttribute('transform',`translate(${g.x},${g.y}),scale(${scale})`);
			}
		});

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