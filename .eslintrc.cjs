module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'es2021': true,
	},
	'extends': ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	'overrides': [
		{
			'files': ['*.ts', '*.tsx'],
			'extends': ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
			'parser': '@typescript-eslint/parser',
			'plugins': ['@typescript-eslint'],
		},
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'plugins': ['react', '@typescript-eslint'],
	'rules': {
		'react/react-in-jsx-scope': 'off',
		'linebreak-style': ['error', 'windows'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
	},
	'settings': {
		'react': {
			'version': 'detect',
		},
	},
};
