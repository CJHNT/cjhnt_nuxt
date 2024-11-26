import withNuxt from './.nuxt/eslint.config.mjs'
import pluginSecurity from 'eslint-plugin-security'

export default withNuxt({
  ...pluginSecurity.configs.recommended,

  rules: {
    'vue/html-self-closing': 'off'
  }
})
// your custom flat configs go here, for example:
// {
//   files: ['**/*.ts', '**/*.tsx'],
//   rules: {
//     'no-console': 'off' // allow console.log in TypeScript files
//   }
// },
// {
//   ...
// }

// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginVue from "eslint-plugin-vue";

// export default [
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...pluginVue.configs["flat/essential"],
// ];
