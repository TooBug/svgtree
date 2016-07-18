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
		let rootNode = this._buildTree(nodeListData);
	}

	_countChildren(nodeData){
		let doCount = function(nodeItem){
			if(!nodeItem.children) return 1;
			var ret = 0;
			nodeItem.children.forEach(function(child){
				ret += doCount(child);
			});
			return ret;
		};
		return doCount(nodeData);
	}
	// 确定root子节点的左右分布
	_decideRootLeftRight(root){
		var left = 0;
		var right = 0;
		root.children.forEach((child) => {
			if(right > left){
				child.direction = 'left';
				left += this._countChildren(child);
			}else{
				child.direction = 'right';
				right += this._countChildren(child);
			}
		});
	}
	_reCountRootChildren(root){
		root.count = {
			left:0,
			right:0
		};
		root.children.forEach((child) => {
			var count = this._countChildren(child);
			root.count[child.direction] += count;
		});
	}
	_buildTree(nodeData, parent, direction){

		nodeData.maxChildren = this._countChildren(nodeData);

		// console.log(nodeData);

		var position = {};
		var takenSpace = 0;

		var nodeType = 'normal';

		if(!parent){
			// root
			nodeData._root = true;
			nodeType = 'root';
			this._decideRootLeftRight(nodeData);
			this._reCountRootChildren(nodeData);

			position.x = this._canvas.width/2;
			position.y = this._canvas.height/2;

		}else{
			// non-root
			if(parent._root){
				// first-class node
				direction = nodeData.direction;
				// root node temp maxChildren
				parent.maxChildren = parent.count[direction];
			}

			var xFactor = 1;
			if(direction === 'left'){
				xFactor = -1;
			}
			var xDelta = X_GAP * xFactor;
			position.x = parent._node.x + xDelta;

			// parent has ? children layouted.
			if(!parent[direction]) parent[direction] = 0;

			takenSpace = parent[direction];
			if(!nodeData.maxChildren) nodeData.maxChildren = 1;
			parent[direction] += nodeData.maxChildren;

			/*if(!node.maxChildren){
				node.maxChildren = 1;
			}*/
			position.y = parent._node.y - (parent.maxChildren/2 - (takenSpace + nodeData.maxChildren/2))*Y_GAP;
		}


		// var parentVSpace = parent.vSpace || vSpace;
		// var vDelta = vGap*parent[direction];
		var thisNode = new Node(position, nodeData.title, {type:nodeType});
		nodeData._node = thisNode;
		this._canvas.appendNode(thisNode);

		if(parent){
			this._connect(parent._node,thisNode,direction);
		}
		if(nodeData.children) nodeData.children.forEach((nodeItem) => {
			this._buildTree(nodeItem,nodeData,direction);
		});
		return thisNode;
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
			let path = new Svg('path');
			path.path(
				startX,
				(+node1.y) + node1Box.height/2,
				endX,
				(+node2.y) + node2Box.height/2,
				color
			);
			this._canvas.appendPath(path);
		},0);
	}
}

export default Tree;
