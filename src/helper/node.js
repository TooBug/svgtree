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


class Node{

	constructor(position, title, options = {}){
		if(!options.type) options.type = 'normal';
		let nodeStyle = NODE_STYLES[options.type];

		let g = new Svg('g', {
			transform:`translate(${position.x},${position.y})`,
			x: position.x,
			y: position.y
		});

		let text = new Svg('text', {
			x: NODE_CONFIG.circleR*2 + NODE_CONFIG.padding*2,
			color: nodeStyle.color,
			'text-rendering': 'geometricPrecision'
		});
		text.setContent(title);

		let rect = new Svg('rect', {
			stroke: nodeStyle.stroke,
			fill: nodeStyle.fill,
			height: NODE_CONFIG.lineHeight + NODE_CONFIG.padding*2
		});

		let circle = new Svg('circle', {
			r: NODE_CONFIG.circleR,
			cx: NODE_CONFIG.circleR + NODE_CONFIG.padding,
			cy: (NODE_CONFIG.lineHeight + NODE_CONFIG.padding * 2) / 2,
			stroke: 'none',
			fill: nodeStyle.circleColor
		});

		g.appendChild(rect);
		g.appendChild(circle);
		g.appendChild(text);

		setTimeout(function(){
			var textBox = text.getBBox();
			rect.setAttribute('width',textBox.width + NODE_CONFIG.padding*3 + NODE_CONFIG.circleR*2);
			text.setAttribute('y',textBox.height + NODE_CONFIG.padding + (NODE_CONFIG.lineHeight-textBox.height)/2);
		},0);

		return g;
	}

}

export default Node;