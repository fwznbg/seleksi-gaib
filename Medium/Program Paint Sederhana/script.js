let canvas = document.getElementById("gl-canvas");
let gl;
let program;

// true when selected
let line;
let pen;
let square;
let rect;

let drawTrack = []; // array of new start point for every point on pen drawn
let lineStartPoints = [];   // array of start point of a line

let mouseClicked = false;

let position = [];  // array of position index
let color = [];

let nPolygons = 0;  // array of number of polygons created
let start = [];     // array of start index on buffer for polygon on index i
let numIdx = [];    // array of number of points for polygon on index i
let idx = 0;        // total point created



window.onload = init;

// return a shader
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    return shader;
  }
  
  // return a shader program
function createProgram(gl, vertex, fragment){
    let program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    return program;
}

// canvas resizing
function resizeCanvas(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}


// return mouse position, assuming target is canvas
function getMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }
 
// return mouse position on canvas relatives to clp space
function mousePositiontoWebGLcoordiante(event, canvas) {
    target = canvas || event.canvas;
    var pos = getMousePosition(event, canvas);

    pos.x = pos.x * canvas.width  / canvas.clientWidth;
    pos.y = pos.y * canvas.height / canvas.clientHeight;

    pos.x = pos.x / gl.canvas.width  *  2 - 1;
    pos.y = pos.y / gl.canvas.height * -2 + 1;

    return pos;  
}

function updateToggle(){
    // true if selected
    pen = document.getElementById("pen").checked;
    line = document.getElementById("line").checked;
    square = document.getElementById("square").checked;
    rect = document.getElementById("rectangle").checked;
}

// return polygon containing of 2 triangle based on 2 points
function createLine(begin, end){
    var width = 0.003;
    var beta = (Math.PI/2.0) - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
    var delta_x = Math.cos(beta)*width;
    var delta_y = Math.sin(beta)*width;
    return [begin[0] - delta_x, begin[1] + delta_y,
            begin[0] + delta_x, begin[1] - delta_y,
            end[0] + delta_x, end[1] - delta_y,
            end[0] - delta_x, end[1] + delta_y];
}

// return hex value of color
function colorPicker(){
    picker = document.getElementById("color-picker");
    return picker.value
}

// converting hex to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function init() {
    gl = canvas.getContext("webgl");

    let vertexShaderSource = document.getElementById("vertex-shader").text;
    let fragmentShaderSource = document.getElementById("fragment-shader").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    canvas.addEventListener("mousedown", function(e){ 
        mouseClicked = true;

        let rgb = hexToRgb(colorPicker());
        let r = rgb.r;
        let g = rgb.g;
        let b = rgb.b;

        // create new polygon with start index is the last total polygon created
        if(pen){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
        }else if(line){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
        }else if(square){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
        }else if(rect){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
        }
        for(let i=0;i<4;i++){
            color.push(r, g, b);
        }
    });
    canvas.addEventListener("mouseup", function(e){
        mouseClicked = false;
        drawTrack = [];
        lineStartPoints = [];
    });

    canvas.addEventListener("mousemove", function(e){
        if(mouseClicked){
            let pos = mousePositiontoWebGLcoordiante(e, canvas);
            let x =pos.x;
            let y = pos.y;

            if(pen){
                /*
                every point drawn on pen is a tiny polygon, not a dot
                */
                let rgb = hexToRgb(colorPicker());
                let r = rgb.r;
                let g = rgb.g;
                let b = rgb.b;

                if(drawTrack.length==2){    // start point has been obtained
                    // create a line based on start point and current point
                    let tracks = createLine([drawTrack[0], drawTrack[1]], [x, y]);
                    
                    // pushing line created to position array 
                    for(let track of tracks){
                        position.push(track);
                    }
                    
                    for(let i=0; i<4;i++){
                        // point created for current polygon increased
                        numIdx[nPolygons]++;
                        // total point created increased
                        idx++;
                    }
                    render();

                    // pdating start point with current point as new start point
                    drawTrack = [];
                    drawTrack.push(x);
                    drawTrack.push(y);

                    // create new polygon with start index is the last total polygon created
                    nPolygons++;
                    start[nPolygons] = idx;
                    numIdx[nPolygons] = 0;

                    for(let i=0;i<4;i++){
                        color.push(r, g, b);
                    }
                }else{  // start point hasn't been obtained 
                    drawTrack.push(x);
                    drawTrack.push(y);
                }
            }else if(line){
                if(numIdx[nPolygons]==4){       //a line has created
                    // delete the last line created for updating, since the cursor is moving
                    for(let i=0;i<4;i++){
                        position.pop(); 
                        position.pop();
                    }
                    for(let i=0;i<4;i++){
                        numIdx[nPolygons]--;
                        idx--;
                    }
                }else if(lineStartPoints.length==2){    // start point is created
                    startX = lineStartPoints[0];
                    startY = lineStartPoints[1];

                    let tracks = createLine([startX,startY], [x,y]);    // create a new line based on start point and current point

                    for(let track of tracks){
                        position.push(track);
                    }

                    for(let i=0;i<4;i++){
                        numIdx[nPolygons]++;
                        idx++;
                    }
                    render();
                }else if(numIdx[nPolygons]==0){ // initialization, get start point
                    lineStartPoints.push(x);   
                    lineStartPoints.push(y);
                }
            }else if(square){
                if(numIdx[nPolygons]==0){ // initialization, get start point
                    position.push(x);
                    position.push(y);

                    numIdx[nPolygons]++;
                    idx++;
                }else if(numIdx[nPolygons]==4){ // a square has been created
                    // delete the last 3 point created for updating, since the cursor is moving
                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]--;
                        idx--;
                        for(let j=0;j<2;j++){
                            position.pop();
                        }
                    }
                }else if(numIdx[nPolygons]==1 || numIdx[nPolygons]==2 || numIdx[nPolygons]==3){ // square hasn't been created
                    // get the start point
                    x0 = position[position.length-2];
                    y0 = position[position.length-1];

                    // get the furthest point from start point
                    abs = Math.abs;
                    let max = Math.max(abs(x-x0), abs(y-y0));

                    // create a square based on start point with side = max (furthest point from start point)
                    if(x0>x){
                        if(y0>y){
                            position.push(x0-max);
                            position.push(y0);

                            position.push(x0-max);
                            position.push(y0-max);

                            position.push(x0);
                            position.push(y0-max);
                        }else{
                            position.push(x0-max);
                            position.push(y0);

                            position.push(x0-max);
                            position.push(y0+max);

                            position.push(x0);
                            position.push(y0+max);
                        }
                    }else{
                        if(y0>y){
                            position.push(x0+max);
                            position.push(y0);

                            position.push(x0+max);
                            position.push(y0-max);

                            position.push(x0);
                            position.push(y0-max);
                        }else{
                            position.push(x0+max);
                            position.push(y0);

                            position.push(x0+max);
                            position.push(y0+max);

                            position.push(x0);
                            position.push(y0+max);
                        }
                    }

                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]++;
                        idx++;
                    }

                    render();
                }
            }else if(rect){
                if(numIdx[nPolygons]==0){   // initialization, get start point
                    position.push(x);
                    position.push(y);

                    numIdx[nPolygons]++;
                    idx++;
                }else if(numIdx[nPolygons]==4){ // a rectangle has been created
                    // delete the last 3 point created for updating, since the cursor is moving
                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]--;
                        idx--;
                        for(let j=0;j<2;j++){
                            position.pop();
                        }
                    }
                }else if(numIdx[nPolygons]==1 || numIdx[nPolygons]==2 || numIdx[nPolygons]==3){ // rectangle han't been created
                    // get the start point
                    x0 = position[position.length-2];
                    y0 = position[position.length-1];

                    // create a rectangle based on start point and current point
                    position.push(x0);
                    position.push(y);

                    position.push(x);
                    position.push(y);

                    position.push(x);
                    position.push(y0);

                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]++;
                        idx++;
                    }
                    render();
                }
            }
        }
    });
}

function render(){
    let colorNormalized = color.map(c => ((c-255)/255)+1);

    gl.useProgram(program);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorNormalized), gl.STATIC_DRAW);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, true, 0, 0);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    for(let i=0;i<=nPolygons;i++){
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIdx[i]);
    }
}