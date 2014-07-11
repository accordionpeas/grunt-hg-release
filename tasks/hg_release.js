/*
 * grunt-hg-release
 * https://github.com/accordionpeas/grunt-hg-release
 *
 */

'use strict';

module.exports = function(grunt) {

	grunt.registerTask('hg_release', 'Release a new version of your Node-based project using hg/Mercurial', function(type) {
	
		type = type || 'patch';
	
		var done = this.async(),
			options = this.options({
				commit: 'release-<%= version %>',
				tag: 'release-<%= version %>'
			});
			
		bump();
		
		function bump(){
			grunt.util.spawn({ cmd: "npm", args: [ "version", type ] }, function(err, result){
				if (err) grunt.fail.fatal(err);
				var version = result.stdout.substr(1);
				commit(version);
			});
		}
		
		function commit(version){
			var commit = getMessage(options.commit, version);
			grunt.util.spawn({ cmd: "hg", args: [ "commit", "-m", "\"" + commit + "\"" ] }, function(err, result){
				if (err) grunt.fail.fatal(err);
				tag(version);
			});
		}
		
		function tag(version){
			var tag = getMessage(options.tag, version);
			grunt.util.spawn({ cmd: "hg", args: [ "tag", tag ] }, function(err, result){
				if (err) grunt.fail.fatal(err);
				grunt.log.ok('Bumped to version: ' + version);
				done();
			});
		}
		
		function getMessage(template, version){
			return grunt.template.process(template, {data: {version: version}});
		}
	
	});
	
};