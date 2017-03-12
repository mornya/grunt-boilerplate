/*
 * @(#)merged-file-list.js version 2016. 6. 24
 * JS 파일을 머지하거나 복사
 */
module.exports = function(mergeSymbol, extName, srcPath, destPath){
	var fs = require('fs');
	var mergedScriptFiles = {};
	var mergeFiles = [];

	var list = function(path, isMerged){
		fs.readdirSync(path).forEach(function(file){
			var pathFile = path + '/' + file;
			if (fs.lstatSync(pathFile).isDirectory()) {
				list(pathFile, (file.startsWith(mergeSymbol)));
			} else if (!file.startsWith('_') && file.endsWith(extName)) {
				if (isMerged) {
					// merge 대상은 임시 array에 담아두고 루프 종료시 처리한다.
					mergeFiles.push(pathFile);
				} else {
					// merge 대상이 아닌 파일들은 복사하도록 최종 array에 담는다.
					mergedScriptFiles[destPath + '/' + pathFile.replace(srcPath + '/', '')] = pathFile;
				}
			}
		});
		if (mergeFiles.length > 0) {
			var genPath = path.replace(srcPath + '/', '').split('/');
			var lastIdx = genPath.length - 1;
			genPath[lastIdx] = genPath[lastIdx].substring(mergeSymbol.length);
			mergedScriptFiles[destPath + '/' + genPath.join('/') + '.' + extName] = mergeFiles;
			mergeFiles = [];
		}
	};

	list(srcPath, false);
	//console.log(mergedScriptFiles);
	return mergedScriptFiles;
};