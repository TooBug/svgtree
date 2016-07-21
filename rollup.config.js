import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'src/index.js',
	plugins: [
		babel({
			exclude: 'node_modules/**',
			presets: ['es2015-rollup']
		}),
		nodeResolve(),
		commonjs(),
		uglify()
	],
	moduleName: 'SvgTree',
	targets: [{
		dest:'./dist/index.js',
		format:'umd'
	}]
};