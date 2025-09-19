export default {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-standard-scss',
		'stylelint-config-recommended-vue',
		'stylelint-prettier/recommended'
	],
	ignoreFiles: ['dist/**'],
	overrides: [
		{
			files: ['*.vue', '**/*.vue'],
			customSyntax: 'postcss-html'
		},
		{
			files: ['*.scss', '**/*.scss'],
			customSyntax: 'postcss-scss'
		}
	],
	rules: {
		'at-rule-no-unknown': null,
		'media-query-no-invalid': null,
		'scss/at-rule-no-unknown': null,
		'declaration-property-value-no-unknown': null,
		'selector-pseudo-element-no-unknown': null,
		'selector-pseudo-class-no-unknown': null
	}
}
