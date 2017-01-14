var NebGL = {
	
	/** Creates a new WebGL context for the given canvas */
	createGL: function(canvas, config) {
		config = config || {};
		
		// set canvas size
		if(config.width) canvas.setAttribute("width", config.width);
		if(config.height) canvas.setAttribute("height", config.height);
		
		// create context
		var gl = canvas.getContext("webgl");
		
		// context creation failed
		if(!gl) {
			throw "WebGL context creation failed: webgl may be unsupported";
		}
		return gl;
	},
	
	/** Creates a new WebGL context for the canvas with the given element id */
	createGLForId: function(id, config) {
		var canvas = document.getElementById(id);
		
		var gl = this.createGL(canvas, config);
		return gl;
	},
	
	// ### shaders ###
	
	/** Creates and compiles a shader with the given type from the given glsl code. */
	createShaderFromCode: function(gl, type, code) {
		if(type != gl.FRAGMENT_SHADER && type != gl.VERTEX_SHADER) {
			throw ("shader creation failed: unknown shader type: " + type);
		}
		
		var shader;
		try {
			// create and compile
			shader = gl.createShader(type);
			gl.shaderSource(shader, code);
			gl.compileShader(shader);
			
			// check status
			if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				var infolog = gl.getShaderInfoLog(shader);
				throw ("shader compile failed: " + infolog);
			}
		}
		catch(e) {
			// destroy shader
			if(shader) {
				gl.deleteShader(shader);
			}
			
			throw e;
		}
		return shader;
	},
	
	/** Creates and compiles a shader with the given type from the glsl code in the script tag with the given id. */
	createShaderFromScript: function(gl, type, scriptid) {
		// find script tag
		var scriptTag = document.getElementById(scriptid);
		if(!scriptTag) throw ("shader creation failed: unknown script tag: #" + scriptid);
		
		// create shader
		var shader = this.createShaderFromCode(gl, type, scriptTag.text);
		return shader;
	},
	
	/** Creates and links a shader program from the given vertex and fragment shader objects. */
	createProgramFromShaders: function(gl, vert, frag) {
		// create program
		var program = gl.createProgram();
		
		// attach shaders
		gl.attachShader(program, vert);
		gl.attachShader(program, frag);
		
		// link
		gl.linkProgram(program);
		
		// check status
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			var infolog = gl.getProgramInfoLog(program);
			throw ("program linking failed: " + infolog);
		}
		return program;
	},
	
	/** Creates and links a shader program from the given vertex and fragment shader code. */
	createProgramFromCode: function(gl, vertcode, fragcode) {
		// create shaders
		var vert = this.createShaderFromCode(gl, gl.VERTEX_SHADER, vertcode);
		var frag = this.createShaderFromCode(gl, gl.FRAGMENT_SHADER, fragcode);
		
		// create program
		var program = this.createProgramFromShaders(gl, vert, frag);
		return program;
	},
	
	/** Creates and links a shader program from vertex and fragment shader code from the script tags with the given ids. */
	createProgramFromScripts: function(gl, vertscriptid, fragscriptid) {
		// create shaders
		var vert = this.createShaderFromScript(gl, gl.VERTEX_SHADER, vertscriptid);
		var frag = this.createShaderFromScript(gl, gl.FRAGMENT_SHADER, fragscriptid);
		
		// create program
		var program = this.createProgramFromShaders(gl, vert, frag);
		return program;
	},
};