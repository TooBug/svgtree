const XMLNS = 'http://www.w3.org/2000/svg';
import TweenLite from 'gsap/src/uncompressed/TweenLite.js';

class Svg{
	constructor(element, attrs = {}){
		this._element = this._createElement(element);

		this.setAttribute(attrs);

		if(element === 'svg'){
			this._element.setAttributeNS (null, 'viewBox', `0 0 ${attrs.width} ${attrs.height}`);
		}
	}
	get element(){
		return this._element;
	}
	getBBox(){
		return this._element.getBBox();
	}
	setAttribute(name, value){
		let attrs = {};
		if(typeof name === 'object'){
			attrs = name;
		}else{
			attrs[name] = value;
		}

		const STYLE_ATTR = ['stroke','fill','color','cursor'];
		let styleAttrs = {};
		for(let attrName in attrs){
			this[attrName] = attrs[attrName];
			if(STYLE_ATTR.indexOf(attrName) > -1){
				styleAttrs[attrName] = attrs[attrName];
			}else{
				this._element.setAttributeNS(null, attrName, attrs[attrName]);
			}
		}
		let styleStr = '';
		for(let attrName in styleAttrs){
			styleStr += `${attrName}: ${styleAttrs[attrName]};`;
		}
		if(styleStr){
			this._element.setAttributeNS(null, 'style', styleStr);
		}
	}
	setContent(content){
		this._element.innerHTML = content;
		return this;
	}
	appendChild(svg){
		// console.log(this._element,'appendChild',svg._element);
		this._element.appendChild(svg.element);
	}
	animatePosition(from, to){
		to.onUpdate = () => {
			this.setAttribute(`transform`, `translate(${from.x},${from.y})`);
		};
		let tween = TweenLite.to(from, 0.5, to);
	}
	path(x1,y1,x2,y2,color){
		// M30 100 Q 75 63, 100 100 T 200 80
		// let path = new Svg('path');
		// var color = 'red';
		this._updatePath(x1,y1,x2,y2);
		this.setAttribute({
			stroke:color,
			fill:'none',
			x1,
			y1,
			x2,
			y2
		});
	}
	clear(){
		while (this._element.lastChild) {
			this._element.removeChild(this._element.lastChild);
		}
	}
	bindEvent(event, callback){
		this._element.addEventListener(event, callback, false);
	}
	_updatePath(x1,y1,x2,y2){
		/*let center = {
			x:(x2-x1)/2 + x1,
			y:(y2-y1)/2 + y1
		};
		let ctrlPointX = center.x;
		let ctrlPointY = y1;*/


		// 没有初始化过，直接写
		if(!this.x1 && !this.x2){
			let path = `M${x1} ${y1} C${(x2-x1)/8*7 + x1} ${y1} ${(x2-x1)/8 + x1} ${y2} ${x2} ${y2}`;
			this.setAttribute('d', path);
		}else{
			let from = {
				x1:this.x1,
				y1:this.y1,
				x2:this.x2,
				y2:this.y2
			};
			let to = {
				x1,
				y1,
				x2,
				y2
			};
			to.onUpdate = ()=>{
				let path = `M${from.x1} ${from.y1} C${(from.x2-from.x1)/8*7 + from.x1} ${from.y1} ${(from.x2-from.x1)/8 + from.x1} ${from.y2} ${from.x2} ${from.y2}`;
				this.setAttribute('d', path);
			};
			let tween = TweenLite.to(from, 0.5, to);				
		}

	}
	_createElement(element){
		return document.createElementNS(XMLNS, element);
	}
}

export default Svg;