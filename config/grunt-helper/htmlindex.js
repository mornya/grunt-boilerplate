module.exports = function(grunt){
	var fs = require('fs');
	var htmlParser = require('htmlparser2');
	var resultList = [];

	var props = grunt.file.readJSON('./config/htmlindex.json');
	var propsBasePath = props.basePath || '';
	var propsOutPath = props.outPath || '';
	var propsLinkPath = props.linkPath || '';
	var propsExceptDirs = props.exceptDirs || {};

	var htmlInfo = function(html){
		var isTitleTag = false;
		var returnValue = {};
		var parser = new htmlParser.Parser({
			onopentag: function(name/*, attribs*/){
				if (name === 'title') {
					isTitleTag = true;
				}
			},
			ontext: function(text){
				if (isTitleTag) {
					returnValue['title'] = text;
				}
			},
			onclosetag: function(tagname){
				if (tagname === 'title') {
					isTitleTag = false;
				}
			}
		}, {decodeEntities: true});
		parser.write(html);
		parser.end();
		return returnValue;
	};

	var list = function(path){
		var result = {};
		var files = [];
		var curPath = path || '';
		if (fs.exists(propsBasePath + curPath)) {
			fs.readdirSync(propsBasePath + curPath).forEach(function(file){
				var pathFile = curPath + '/' + file;
				if (fs.lstatSync(propsBasePath + pathFile).isDirectory()) {
					var isValid = true;
					propsExceptDirs.forEach(function(value){
						if (file == value) isValid = false;
					});
					if (isValid) list(pathFile);
				} else {
					if (pathFile.substring(pathFile.length - 5) === '.html') {
						var info = htmlInfo(fs.readFileSync(propsBasePath + pathFile));
						var encodePath = (curPath.length > 0) ? '/' + encodeURIComponent(curPath.substring(1)) : '';
						files.push({
							pathname: propsLinkPath + encodePath,
							filename: file,
							title: info.title
						});
					}
				}
			});
		}
		if (files.length > 0) {
			result.path = path || '/';
			result.files = files;
			resultList.push(result);
		}
	};

	list();
	//console.log(resultList);
	grunt.file.write(propsOutPath + '/index.json', JSON.stringify(resultList, null, 2));
};
