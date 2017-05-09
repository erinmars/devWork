module.exports = function(grunt) {
  // Do grunt-related things in here
	"use strict";
	
	var dest = '/Library/WebServer/Documents/scos/sm_player';
	var sm_player_dest = '/Library/WebServer/Documents/scos/sm_player';
	var primary_sco_dest_js = '/Library/WebServer/Documents/scos/lo/sm_primary_sco/js';
	var primary_sco_src_js = '/Library/WebServer/Documents/scos/sm_math9_us/smmath9rootsco/js';
	var primary_sco_dest_css = '/Library/WebServer/Documents/scos/lo/sm_primary_sco/css';
	var primary_sco_src_css = '/Library/WebServer/Documents/scos/sm_math9_us/smmath9rootsco/css';
	
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	 
	  jshint: {
		  // configure JSHint (documented at http://www.jshint.com/docs/)
		  options: {
			  eqeqeq: true,
			  trailing: true,
		   
			 globals: {
			      jQuery: true,
			      console: true,
			      module: true
		     },
		 // define the files to lint
			  target: {
				  src : ['Gruntfile.js', 'widgets/*.js'],
			  }
		  }
		},
	 clean: {
		 options: {
		     'force': true
		  },
	      build: [
	          dest,
	          sm_player_dest
	      ]
	    },
	  copy: {
		  options: {
		     'force': true
		  },
		  files: {
		    cwd: 'widgets',  // set working folder / root to copy
		    src: '**/*',           // copy all files and subfolders
		    dest: dest,    // destination folder
		    expand: true           // required when using cwd
		  },
		  files2: {
		    cwd: 'sm_mock_player/dist/',  // set working folder / root to copy
		    src: '**/*',           // copy all files and subfolders
		    dest: sm_player_dest,    // destination folder
		    expand: true           // required when using cwd
		  },
		  files3: {
			    cwd: primary_sco_src_js,  // set working folder / root to copy
			    src: 'sco.js',           // copy all files and subfolders
			    dest: primary_sco_dest_js,    // destination folder
			    expand: true           // required when using cwd
			  },
		  files4: {
			    cwd: primary_sco_src_css,  // set working folder / root to copy
			    src: 'sco.css',           // copy all files and subfolders
			    dest: primary_sco_dest_css,    // destination folder
			    expand: true           // required when using cwd
			  }
		},
	  watch: {
		  options: {
			  'force': true 
		  },
	      js: {
	        files: [
	          'widgets/js/**/*.js'
	        ],
	        tasks: [
	          'jshint'
	        ]
	      },
	      css: {
	        files: [
	          'widgets/css/**/*.scss'
	        ]
	      }
	    }
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.option('stack', true);
	
	// grunt.registerTask('test', ['jshint', 'qunit']);

	// grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
	grunt.registerTask('default', ['jshint', 'clean', 'copy']);
	 //grunt.task.run('copy');
};