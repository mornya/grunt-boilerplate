module.exports = function(grunt){
	// 초기 로딩 헬퍼들
	var spriteHelper = require('./config/grunt-helper/sprite.js');
	var mergedFileListHelper = require('./config/grunt-helper/merged-file-list.js');

	// 각 태스크가 얼마나 시간을 사용하는지 측정
	require('time-grunt')(grunt);

	// loadNpmTasks: package.json을 분석하여 자동으로 디펜던시 로딩
	require('jit-grunt')(grunt, {
		eslint: 'grunt-eslint',
		babel: 'grunt-babel',
		appcache: 'grunt-appcache',
		sprite: 'grunt-spritesmith',
		includereplace: 'grunt-include-replace',
		watch: 'grunt-contrib-watch'
	});

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		path: {
			base: {
				src: 'src',
				build: 'src',
				distRoot: 'www_contents',
				dist: '<%=path.base.distRoot%>/assets'
			},
			src: {
				scripts: 'src/pre-scripts',
				styles: 'src/pre-styles',
				pages: 'src/pre-pages',
				images: 'src/pre-images',
				sprites: 'src/pre-sprites'
			},
			build: {
				css: 'src/css',
				js: 'src/js',
				html: 'src/html',
				images: 'src/images'
			},
			dist: {
				css: 'www_contents/assets/css',
				js: 'www_contents/assets/js',
				html: 'www_contents/assets/html',
				images: 'www_contents/assets/images'
			}
		},
		symbols: {
			concat: '+'
		},
		clean: {
			build: [
				'<%=path.build.css%>', '<%=path.src.styles%>/__SPRITE__',
				'<%=path.build.js%>',
				'<%=path.build.html%>',
				'<%=path.build.images%>'
			],
			dist: {
				src: [
					'<%=path.dist.css%>',
					'<%=path.dist.js%>',
					'<%=path.dist.html%>',
					'<%=path.dist.images%>'
				],
				options: {
					force: true
				}
			}
		},
		babel: {
			build: {
				files: [{
					expand: true,
					cwd: '<%=path.src.scripts%>',
					src: ['**/*.js'],
					dest: '<%=path.build.js%>',
					ext: '.js'
				}]
			},
			options: {
				sourceMap: false,
				presets: ['react', 'es2015']
			}
		},
		appcache: {
			options: {
				basePath: '<%=path.base.distRoot%>',
				preferOnline: false
			},
			dist: {
				dest: '<%=path.base.distRoot%>/manifest.appcache', // .appcache is now the W3C recommended file extension.
				cache: {
					patterns: [
						'<%=path.base.dist%>/css/*.min.css',
						'<%=path.base.dist%>/images/spr-*.png',
						'<%=path.base.dist%>/js/mornya/*.min.js',
						'<%=path.base.dist%>/js/*.min.js'
					],
					literals: [
						'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'
					]
				},
				network: '*',
				fallback: '/ /offline.html'
			}
		},
		sass: {
			build: {
				files: [{
					expand: true,
					cwd: '<%=path.src.styles%>',
					src: ['*.scss', '!**/_*.scss'],
					dest: '<%=path.build.css%>',
					ext: '.css'
				}]
			},
			options: {
				style: 'compact',
				sourcemap: 'none',
				require: ['./config/sass.functions.rb']
			}
		},
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%=path.build.css%>',
					src: ['**/*.css', '!**/*.min.css'],
					dest: '<%=path.build.css%>',
					ext: '.min.css'
				}]
			},
			options: {
				keepSpecialComments: 0 // default=save !comment, 1=remove first !comment, 0=remove all
			}
		},
		eslint: {
			build: {
				src: ['Gruntfile.js', '<%=path.src.scripts%>/**/*.js']
			},
			options: {
				configFile: '.eslintrc'
			}
		},
		jshint: {
			build: ['Gruntfile.js', '<%=path.src.scripts%>/**/*.js'],
			options: {
				reporter: require('jshint-stylish'),
				esversion: 6
			}
		},
		concat: {
			js: {
				files: []
			},
			options: {
				banner: '/** modified:<%=grunt.template.today("yyyy-mm-dd")%> @author mornya */'
			}
		},
		uglify: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%=path.build.js%>',
						src: ['**/*.js', '!+**/*', '!**/+**/*', '!**/*.min.js'],
						dest: '<%=path.build.js%>',
						ext: '.min.js'
					}
				]
			},
			options: {
				mangle: true, // change func & var name true
				compress: {
					unused: false, // do not remove unused vars/functions
					drop_console: false // do not remove "console.*" output in scripts
				},
				banner: '/** modified:<%=grunt.template.today("yyyy-mm-dd")%> @author mornya */',
				beautify: false
			}
		},
		sprite: spriteHelper('src/pre-sprites', '<%=path.build.images%>', '<%=path.src.styles%>/__SPRITE__'),
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
						expand: true, // Set to true to enable the following options
						cwd: '<%=path.src.images%>/__MINIFY__/',
						src: ['**/*.png'],
						dest: '<%=path.build.images%>',
						ext: '.min.png'
					}
				]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
						expand: true, // Set to true to enable the following options
						cwd: '<%=path.src.images%>/__MINIFY__/',
						src: ['**/*.jpg'],
						dest: '<%=path.build.images%>',
						ext: '.min.jpg'
					}
				]
			}
		},
		includereplace: {
			build: {
				files: [
					{
						expand: true,
                        cwd: '<%=path.src.pages%>',
						src: ['**/*.html', '!**/_*.html', '!index.html', '!__INCLUDE__/**/*'],
                        dest: '<%=path.build.html%>'
                    }
                ],
				options: {
					includesDir: '<%=path.src.pages%>/__INCLUDE__/'
				}
			}
        },
		copy: {
			buildImage: {
				expand: true,
				cwd: '<%=path.src.images%>',
				src: ['**/*.*', '!__MINIFY__/**/*.*'],
				dest: '<%=path.build.images%>'
			},
			distAll: {
				expand: true,
				cwd: '<%=path.base.build%>',
				src: [
					'css/**/*.min.css',
					'html/**/*.html', '!html/#**/*', '!html/index.html',
					'images/**/*',
					'js/**/*.min.js',
					'medias/**/*'
				],
				dest: '<%=path.base.dist%>'
			}
		},
		watch: {
			sass: {
				files: '<%=path.src.styles%>/**/*.scss',
				tasks: ['generateCSS']
			},
			js: {
				files: '<%=path.src.scripts%>/**/*.js',
				tasks: ['eslint', 'jshint', 'generateJS']
			},
			sprites: {
				files: '<%=path.src.sprites%>/**/*.png',
				tasks: ['sprite', 'generateCSS']
			},
			images: {
				files: '<%=path.src.images%>/**/*',
				tasks: ['imagemin']
			},
			include: {
				files: '<%=path.src.pages%>/**/*.html',
				tasks: ['includereplace']
			},
			options: {
				nospawn: true,
				livereload: true
			}
		}
	});

	// Prepare concat JS files
	grunt.registerTask('prepareConcatJS', 'prepare concat JS files', function(){
		grunt.config.set(
			'concat.js.files',
			mergedFileListHelper(grunt.config('symbols.concat'), 'js', grunt.config('path.build.js'), grunt.config('path.build.js'))
		);
	});

	// HTML Index tasks
	grunt.registerTask('htmlindex', 'Generates HTML index page', function(){
		require('./config/grunt-helper/htmlindex.js')(grunt, 'assets/html');
	});

	// Generate Images
	grunt.registerTask('generateImage', ['sprite', 'copy:buildImage', 'imagemin']); // sprite task always first

	// Generate CSS
	grunt.registerTask('generateCSS', ['sass', 'cssmin']);

	// Generate JS
	grunt.registerTask('generateJS', ['babel', 'prepareConcatJS', 'concat:js', 'uglify']);

	// Build tasks
	grunt.registerTask('build', [
		'clean:build', // not clean dist!
		'generateImage',
		'generateCSS',
		'generateJS',
		'includereplace'
	]);

	// Distribute tasks
	grunt.registerTask('distribute', [
		'clean:dist',
		'copy:distAll'
	]);

	// Deploy tasks for release deploy only
	grunt.registerTask('deploy', ['build', 'distribute', 'appcache']);

	// Default tasks for dev only
	grunt.registerTask('default', ['eslint', 'jshint', 'build', 'htmlindex', 'watch']);
};