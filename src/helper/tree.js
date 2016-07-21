import Node from './node';
import Svg from './svg';
import Canvas from './canvas';

const X_GAP = 150;	// 横向间隔
const Y_GAP = 50;	// 纵向间隔
class Tree{
	constructor($container, options = {}){
		this._canvas = new Canvas($container,options);
	}
	renderTree(nodeListData){
		this._hashMap = {};
		this._connectMap = {};
		this._tree = this._buildTree(nodeListData);
		this._renderTree(this._tree);
		// this._renderTree(this._tree);
		this._toggle();
	}

	_countChildren(node){
		let doCount = function(nodeItem){
			if(!nodeItem.children || !nodeItem.children.length) return 1;
			if(!nodeItem.isShow) return 0;
			var ret = 0;
			nodeItem.children.forEach(function(child){
				ret += doCount(child);
			});
			return ret;
		};
		return doCount(node);
	}
	// 确定root子节点的左右分布
	_decideRootLeftRight(rootNode){
		var left = 0;
		var right = 0;
		rootNode.children.forEach((child, index) => {
			let node = rootNode.children[index];
			if(right > left){
				node.direction = 'left';
				left += this._countChildren(child);
			}else{
				node.direction = 'right';
				right += this._countChildren(child);
			}
		});
	}
	_reCountRootChildren(rootNode){
		rootNode.count = {
			left:0,
			right:0
		};
		rootNode.children.forEach((child, index) => {
			let node = rootNode.children[index];
			var count = this._countChildren(child);
			rootNode.count[node.direction] += count;
		});
	}
	_buildChildren(node, nodeData){
		this._hashMap[node.id] = node;
		node.children = [];
		if(nodeData.children){
			node.children = nodeData.children.map((nodeItemData)=>{
				let node = new Node(nodeItemData.title, {type:'normal'});
				return this._buildChildren(node, nodeItemData);
			});
		}
		return node;
	}
	_toggleTree(node, value){
		if(node.children){
			node.children.forEach((childNode) => {
				childNode.isShow = value;
				childNode.childrenShow = value;
				this._toggleTree(childNode, value);
			});
		}
	}
	_toggle(){
		this._canvas.bindEvent('click', (e)=>{
			var target = e.target;
			while(target && target.getAttribute('is_node') != 1){
				target = target.parentNode;
			}
			if(!target){
				return;
			}
			let nodeId = target.id;
			let node = this._hashMap[nodeId];
			node.childrenShow = !node.childrenShow;
			this._toggleTree(node, node.childrenShow);
			// console.log(this._tree,node);
			// this._canvas.clear();
			this._renderTree(this._tree);
		});
	}
	_buildTree(nodeData, parent, index){

		var thisNode;

		if(!parent){
			// root
			thisNode = new Node(nodeData.title, {type:'root'});
			this._buildChildren(thisNode, nodeData);
		}else{
			thisNode = parent.children[index];
		}
		this._canvas.appendNode(thisNode);

		if(thisNode.children) thisNode.children.forEach((nodeItem, index) => {
			this._buildTree(nodeItem, thisNode, index);
		});
		return thisNode;
	}
	_renderTree(node, parent, direction){

		if(!node.isShow){
			node.hide();
		}else{
			node.show();
		}
		var position = {};
		var takenSpace = 0;
		node.maxChildren = this._countChildren(node);

		if(node.type === 'root'){
			this._decideRootLeftRight(node);
			this._reCountRootChildren(node);

			position.x = this._canvas.width/2;
			position.y = this._canvas.height/2;

		}else{
			// non-root
			if(parent.type === 'root'){
				// first-class node
				direction = node.direction;
				// root node temp maxChildren
				parent.maxChildren = parent.count[direction];
			}

			var xFactor = 1;
			if(direction === 'left'){
				xFactor = -1;
			}
			var xDelta = X_GAP * xFactor;
			position.x = parent.x + xDelta;

			// parent has ? children layouted.
			if(!parent[direction]) parent[direction] = 0;

			takenSpace = parent[direction];
			if(!node.maxChildren) node.maxChildren = 1;
			parent[direction] += node.maxChildren;
			position.y = parent.y - (parent.maxChildren/2 - (takenSpace + node.maxChildren/2))*Y_GAP;
		}


		node.setPosition(position);

		if(parent){
			if(node.isShow){
				this._connect(parent,node,direction);
			}else{
				this._disconnect(parent,node);
			}
		}
		node.left = 0;
		node.right = 0;
		if(node.children) node.children.forEach((nodeItem, index) => {
			this._renderTree(nodeItem, node, direction);
		});
		return node;
	}
	_connect(node1,node2,direction){
		setTimeout(()=>{
			var node1Box = node1.getBBox();
			var node2Box = node2.getBBox();
			var startX,endX;
			if(!direction) direction = 'right';
			if(direction === 'left'){
				startX = +node1.x;
				endX = (+node2.x) + node2Box.width;
			}else if(direction === 'right'){
				startX = (+node1.x) + node1Box.width;
				endX = (+node2.x);
			}

			var color = ['#A157E5','#24BAE5','#DEE03C','#12E13C','#0BE2C5','#F37F78','#00ACDF'][(Math.random()*7)|0];

			let cacheKey = node1.id + '' + node2.id;
			let path = this._connectMap[cacheKey];
			if(!path){
				path = new Svg('path');
				this._canvas.appendPath(path);
				this._connectMap[cacheKey] = path;
			}
			path.setAttribute('display','block');
			path.path(
				startX,
				(+node1.y) + node1Box.height/2,
				endX,
				(+node2.y) + node2Box.height/2,
				color
			);
		},0);
	}
	_disconnect(node1,node2){
		let cacheKey = node1.id + '' + node2.id;
		let path = this._connectMap[cacheKey];
		path.setAttribute('display','none');
	}
}

export default Tree;
