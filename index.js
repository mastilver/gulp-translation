var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Vinyl = require('vinyl');

const PLUGIN_NAME = 'gulp-translation';


var translate = function(opt)
{
	if(!opt.localeFiles)
	{
		
	}

	


	var transform = function(file, enc, callback)
	{
		if(file.isNull())
		{
			return callback();
		}

		if(file.isStream())
		{
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return callback();
		}

		var self = this;

		opt.localeFiles.pipe(gutil.buffer(function(err, localeFiles)
		{
			// get locales configuration
			var locales = {};
			localeFiles.forEach(function(localeFile)
			{
				locales[localeFile.relative.split('.')[0]] = JSON.parse(localeFile.contents.toString('utf8'));
			});



			var text = file.contents.toString('utf8');

			text = text.replace(/\{\s?(\w+)\s?\}/mg, function(match, p1, offset, string)
			{
				return locales['en'][p1];
			});

			file.contents = new Buffer(text);

			self.push(file);
		}));



		


	};


	return through.obj(transform);
};


module.exports = translate;