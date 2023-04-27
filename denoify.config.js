// @ts-check

/** @type { import('denoify/lib/config/parseParams').DenoifyParams } */
const config = {
	"replacer": "dist/bin/customReplacer.js",
	"ports": {
		"js-yaml": "https://deno.land/x/js_yaml_port/js-yaml.js",
		"ts-md5": "garronej/ts-md5"
	},
	"includes": [
		"README.md",
		"LICENSE",
		"res/**/*.txt",
		"!res/dir2/file3.txt",
		{
			"src": "res/foo.json",
			"destDir": "not_res/a/",
			"destBasename": "renamed_foo.json"
		}
	]
 }
 
 module.exports = config;