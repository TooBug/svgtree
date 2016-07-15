import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
export default {
	entry: './src/index.js',
	plugins: [
		babel({
			exclude: 'node_modules/**',
			presets: ['es2015-rollup']
		}),
		uglify()
	],
	moduleName: 'SvgTree',
	targets: [{
		dest:'./dist/index.js',
		format:'umd'
	}]
};