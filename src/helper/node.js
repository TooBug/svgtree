import Svg from './svg';

const NODE_STYLES = {
	normal: {
		fill:'#00C0FF',
		stroke:'none',
		color:'white',
		circleColor:'white'
	},
	root: {
		stroke:'#f0f0f0',
		fill:'none',
		color:'black',
		circleColor:'#00C0FF'
	}
};

const NODE_CONFIG = {
	lineHeight : 24,	//文字行高
	padding : 5,	//文字padding
	circleR : 5	//圆点半径
};

/**
 * 树状结构中的一个节点
 * 节点结构：
 * {
 * 	title,
 * 	x,
 * 	y,
 * 	type,
 * 	width,
 * 	height,
 * 	isShow,
 * 	get element(),
 * 	getBBox(),
 * 	updateTitle(),
 * 	_layout(),
 * 	_elements:{
 * 		wrapper:g,
 * 		border:react
 * 		text:text,
 * 		itemSymble:circle
 * 	}
 * }
 */
class Node{

	constructor(title, options = {}){

		if(!options.type) options.type = 'normal';
		let nodeStyle = NODE_STYLES[options.type];
		let id = Date.now() + '' + (Math.random()*100000 | 0);

		let wrapper = new Svg('g', {
			id,
			is_node:1,
			cursor:'pointer'
		});

		let text = new Svg('text', {
			x: NODE_CONFIG.circleR*2 + NODE_CONFIG.padding*2,
			color: nodeStyle.color,
			'text-rendering': 'geometricPrecision'
		}).setContent(title);

		let border = new Svg('rect', {
			stroke: nodeStyle.stroke,
			fill: nodeStyle.fill,
			height: NODE_CONFIG.lineHeight + NODE_CONFIG.padding*2
		});

		let itemSymbol = new Svg('circle', {
			r: NODE_CONFIG.circleR,
			cx: NODE_CONFIG.circleR + NODE_CONFIG.padding,
			cy: (NODE_CONFIG.lineHeight + NODE_CONFIG.padding * 2) / 2,
			stroke: 'none',
			fill: nodeStyle.circleColor
		});

		wrapper.appendChild(border);
		wrapper.appendChild(itemSymbol);
		wrapper.appendChild(text);

		var thisNode = {
			id,
			title,
			x:0,
			y:0,
			type:options.type,
			width:0,
			height:0,
			isShow:true,
			childrenShow:true,
			direction:'right',
			maxChildren:0,
			children:[],
			_elements:{
				wrapper,
				border,
				text,
				itemSymbol
			}
		};

		setTimeout(function(){
			var textBox = text.getBBox();
			border.setAttribute('width',textBox.width + NODE_CONFIG.padding*3 + NODE_CONFIG.circleR*2);
			text.setAttribute('y',textBox.height + NODE_CONFIG.padding + (NODE_CONFIG.lineHeight-textBox.height)/2);
		},0);

		return Object.assign(this, thisNode);
	}
	bindEvent(event, callback){
		if(typeof callback === 'function'){
			this.wrapper.bindEvent(event, callback);
		}
	}
	setPosition(position){
		if(this.x === 0 && this.y === 0){
			// 第一次设置位置
			this._elements.wrapper.setAttribute({
				x: position.x,
				y: position.y,
				transform:`translate(${position.x},${position.y})`
			});
		}else{
			// 非第一次设置位置
			this._elements.wrapper.animatePosition({
				x:this.x,
				y:this.y
			},{
				x:position.x,
				y:position.y
			});
			this._elements.wrapper.setAttribute({
				transform:`translate(${position.x},${position.y})`
			});
		}
		this.x = position.x;
		this.y = position.y;
	}
	hide(){
		this._elements.wrapper.setAttribute({
			display:'none'
		});
	}
	show(){
		this._elements.wrapper.setAttribute({
			display:'block'
		});
	}
	getBBox(){
		return this._elements.wrapper.getBBox();
	}
	get element(){
		return this._elements.wrapper;
	}

}

export default Node;