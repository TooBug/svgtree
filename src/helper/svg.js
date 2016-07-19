const XMLNS = 'http://www.w3.org/2000/svg';
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
	path(x1,y1,x2,y2,color){
		// M30 100 Q 75 63, 100 100 T 200 80
		// let path = new Svg('path');
		// var color = 'red';
		this.setAttribute({
			stroke:color,
			fill:'none'
		});
		this._updatePath(x1,y1,x2,y2);
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
		var center = {
			x:(x2-x1)/2 + x1,
			y:(y2-y1)/2 + y1
		};
		var ctrlPointX = center.x;
		var ctrlPointY = y1;
		// path.setAttribute('d',`M${x1} ${y1} Q${ctrlPointX} ${ctrlPointY},${center.x} ${center.y} T${x2} ${y2}`);
		this.setAttribute('d',`M${x1} ${y1} C${(x2-x1)/8*7 + x1} ${y1} ${(x2-x1)/8 + x1} ${y2} ${x2} ${y2}`);

	}
	_createElement(element){
		return document.createElementNS(XMLNS, element);
	}
}

export default Svg;