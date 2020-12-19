let gl;
let indices;
let shaderTime ; 

//Shader variables
let locationOfTime;
let locationOfMouse;

let elapsedTime = 0;
let frameCount = 0;
let lastTime = 0;
let renderLoopRunning = false;
let mouseX = 0;
let mouseY = 0;

initiateWebGl("precision highp float; \
uniform float time; \
uniform vec2 resolution; \
uniform vec2 mouse; \
\
void main() \
{\
	float tempTime = time*3.0;\
    vec2 a = vec2(resolution.x /resolution.y, 1);\
    vec2 c = gl_FragCoord.xy / vec2(resolution.x,resolution.y) * a * 4. + tempTime * 0.3;\
\
	float k = 0.1 + cos(c.y + sin(.148 - tempTime)) + 2.4 * tempTime;\
	float w = 0.9 + sin(c.x + cos(.628 + tempTime)) - 0.7 * tempTime;\
	float d = length(c);\
	float s = 7.0 * cos(d+w) * sin(k+w);\
	\
	gl_FragColor = vec4(.5 + .5 * cos(s + vec3(.2, .5, .9)), 1);\
}");

// initiateWebGl("precision highp float; \
// uniform float time; \
// uniform vec2 resolution; \
// uniform vec2 mouse; \
//  \
// void main() \
// { \
//     vec2 uv = gl_FragCoord.xy/resolution.x; \
// \
//     vec2 sc = vec2( 0.5, 0.5*resolution.y/resolution.x );\
// \
//     float tempTime = time * 3.0;\
// \
//     for( int idx=0; idx<4; idx++ ) \
//     {\
//         vec2 center = vec2(sin( tempTime*(float(idx)*0.132+0.1672 ) )*(0.146+0.0132*float(idx)),\
//                                 sin( tempTime + tempTime*(float(idx)*0.1822+0.221))*(0.1131+0.0112*float(idx)) ) + sc;\
// \
//         float dist = distance( center, uv );\
//         vec3 col = vec3( sin( 100.0*dist ), sin( 110.0*dist ), sin( 120.0*dist ) );\
//         col *= max( 0.0, (1.0-dist*3.0) );\
//         gl_FragColor += vec4( col, 0.0 );\
//     }    \
// }");

if (renderLoopRunning === false){
    renderLoopRunning = true;
    renderLoop();
}

function initiateWebGl(fragCode) {
    //Prepare the canvas and get WebGL context 
    let canvas = document.getElementById('backgroundCanvas');
    gl = canvas.getContext('webgl');

    //Define the geometry and store it in buffer objects 
    let vertices = [
                        -1.0,1.0,0.0,
                        -1.0,-1.0,0.0,
                        1.0,-1.0,0.0,
                        1.0,1.0,0.0 
                    ];

    indices= [3, 2, 1, 3, 1, 0]; 

    // Create a new buffer object
    let vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create an empty buffer object to store Index buffer
    let Index_Buffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Create and compile Shader programs 

    // Vertex shader source code
    let vertCode =
    'attribute vec3 coordinates;' + 
    'void main(void) {' + ' gl_Position = vec4(coordinates, 1.0);' + '}';

    //Create a vertex shader object
    let vertShader = gl.createShader(gl.VERTEX_SHADER);

    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    //Compile the vertex shader
    gl.compileShader(vertShader);

    // Create fragment shader object
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    shaderTime  = 0.0;

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    let shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader); 

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    locationOfTime = gl.getUniformLocation(shaderProgram, "time");

    gl.uniform1f(locationOfTime, shaderTime);

    let locationOfResolution = gl.getUniformLocation(shaderProgram, "resolution");

    gl.uniform2f(locationOfResolution, canvas.width, canvas.height);

    locationOfMouse = gl.getUniformLocation(shaderProgram, "mouse");

    gl.uniform2f(locationOfMouse, mouseX, mouseY);

    /* Step 4: Associate the shader programs to buffer objects */

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 

    //Get the attribute location
    let coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);

    // Clear the canvas
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST); 

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);
}

function renderLoop(){
    let animate = function(time) {
        // Draw the quad
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); 

        shaderTime = shaderTime +0.001;

        gl.uniform1f(locationOfTime, shaderTime);
        gl.uniform2f(locationOfMouse, mouseX, mouseY);

        let now = new Date().getTime();

        frameCount++;
        elapsedTime += (now - lastTime);

        lastTime = now;

        if(elapsedTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            elapsedTime = 0;
            //document.getElementById('footer').innerHTML = fps + ' Frames Per Second';
        }

        window.requestAnimationFrame(animate);
    }
        
    animate(0);
}
