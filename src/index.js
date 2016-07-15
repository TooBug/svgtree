import Tree from "./helper/tree";

class SvgTree{
	constructor($container, options = {}){
		this._tree = new Tree($container, options);
		if(options.nodeList){
			this.renderTree(options.nodeList);
		}
	}
	renderTree(nodeList){
		this._tree.renderTree(nodeList);
	}
}

export default SvgTree;