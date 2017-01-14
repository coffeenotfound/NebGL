var NebGL = {
	
	// ### shaders ###
	
	/** Creates and compiles a shader with the given type from the given glsl code. */
	createShaderFromCode(gl, type, code) {
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
			if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS) {
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
	createShaderFromScript(gl, type, scriptid) {
		// find script tag
		var scriptTag = document.getElementById(scriptid);
		if(!scriptTag) throw ("shader creation failed: unknown script tag: #" + scriptid);
		
		// create shader
		var shader = createShaderFromCode(gl, type, scriptTag.text);
		return shader;
	},
	
	/** Creates and links a shader program from the given vertex and fragment shader objects. */
	createProgramFromShaders(gl, vert, frag) {
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
	createProgramFromCode(gl, vertcode, fragcode) {
		// create shaders
		var vert = createShaderFromCode(gl, gl.VERTEX_SHADER, vertcode);
		var frag = createShaderFromCode(gl, gl.FRAGMENT_SHADER, fragcode);
		
		// create program
		var program = createProgramFromShaders(gl, vert, frag);
		return program;
	},
	
	/** Creates and links a shader program from vertex and fragment shader code from the script tags with the given ids. */
	createProgramFromScripts(gl, vertscriptid, fragscriptid) {
		// create shaders
		var vert = createShaderFromScript(gl, gl.VERTEX_SHADER, vertscriptid);
		var frag = createShaderFromScript(gl, gl.FRAGMENT_SHADER, fragscriptid);
		
		// create program
		var program = createProgramFromShaders(gl, vert, frag);
		return program;
	},
};