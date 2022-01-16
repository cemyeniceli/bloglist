module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'browser': true,
		'es2021': true,
		'jest': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 13
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
