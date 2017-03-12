module.exports = function(spritePath, baseBuildSpritesPath, baseBuildScssPath){
	var fs = require('fs');
	var mustache = require('mustache');
	var spriteOptions = {};

	var _getDirectories = function(src){
		var directories = [];
		fs.readdirSync(src || spritePath).map(function(subdir){
			if (fs.statSync(spritePath + '/' + subdir).isDirectory()) {
				directories.push(subdir);
			}
		});
		return directories;
	};
	var _createOptions = function(name){
		var src = spritePath + '/' + name + '/*.png';
		var dest = baseBuildSpritesPath + '/spr-' + name + '.png';
		var destScss = baseBuildScssPath + '/spr-' + name + '.scss';
		var imgPath = '../images/spr-' + name + '.png'; // relative path
		var cssSpritesheetName = 'spr-' + name;
		var cssTemplate = fs.readFileSync('./config/sprite.mosaic-2x.mustache', 'utf-8'); // default to x2 images
		return {
			padding: 4,
			algorithm: 'binary-tree', // vertical='top-down'
			src: src,
			dest: dest,
			destCss: destScss,
			imgPath: imgPath,
			cssSpritesheetName: cssSpritesheetName,
			cssTemplate: function(params){
				return mustache.render(cssTemplate, params);
			},
			cssOpts: {
				zerounit: function(){
					return function(text, render){
						var value = render(text);
						return ('0px' === value ? '0' : value);
					};
				}
			}
		};
	};

	_getDirectories().map(function(dir){
		spriteOptions[dir] = _createOptions(dir);
	});
	//console.log(spriteOptions);
	return spriteOptions;
};
