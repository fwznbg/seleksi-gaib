let canvas = document.getElementById("gl-canvas");
let gl;
let programPenLine;
let programSquareRect;

// bernilai true bila sedang berada di mode terkait
let line;
let pen;
let square;
let rect;

let mouseClicked = false;
let position = [];  // berisi titik koordinat di canvas
let nPolygons = 0;  // jumlah objek polygon yang dibuat
let mode =[];       // berisi mode draw untuk tiap poligon di-index ke-i
let start = [];     // berisi posisi index awal dari poligon di index ke-i
let numIdx = [];    // banyaknya titik pada poligon di index ke-i
let idx = 0;        // jumlah total seluruh titik


window.onload = init;

// mengembalikan sebuah shader 
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    return shader;
  }
  
  // mengembalikan sebuah program
function createProgram(gl, vertex, fragment){
    let program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    return program;
}

// meresize canvas agar tidak stretch
function resizeCanvas(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}


// mengembalikan koordinat cursor pada canvas, asumsi target adalah canvas
function getMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }
 
// mengembalikan koordinat cursor pada canvas setelah dipetakan ke clipspace
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
    pen = document.getElementById("pen").checked;
    line = document.getElementById("line").checked;
    square = document.getElementById("square").checked;
    rect = document.getElementById("rectangle").checked;
    console.log("pen", pen);
    console.log("line", line);
    console.log("square", square);
    console.log("rectangle", rect);
}

function init(){
    initPenLine();
    initSquareRect();
}

function initPenLine() {
    gl = canvas.getContext("webgl");

    let vertexShaderSource = document.getElementById("vertex-shader-pen-line").text;
    let fragmentShaderSource = document.getElementById("fragment-shader-pen-line").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    programPenLine = createProgram(gl, vertexShader, fragmentShader);

    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);

    canvas.addEventListener("mousedown", function(e){ 
        mouseClicked = true;

        if(pen){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
            mode[nPolygons] = "pen";
        }else if(line){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
            mode[nPolygons] = "line";
        }else if(square){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
            mode[nPolygons] = "square";
        }
    });
    canvas.addEventListener("mouseup", function(e){
        mouseClicked = false;
    })

    canvas.addEventListener("mousemove", function(e){
        if(mouseClicked){
            pos = mousePositiontoWebGLcoordiante(e, canvas);
            x =pos.x;
            y = pos.y;
            if(pen){
                // menambahkan titik ke array position
                position.push(x);
                position.push(y);

                // jumlah titik untuk current poligon bertambah 1
                numIdx[nPolygons]++;
                // jumlah total seluruh titik bertambah 1
                idx++;
                renderPenLine();
            }else if(line){
                // pada line jumlah titik hanya 2
                if(numIdx[nPolygons]==2){   
                    // titik terakhir dihapus dan digantikan titik terbaru
                    // agar saat cursor di-drag line yang terbentuk mengikuti gerakan cursor
                    position.pop(); 
                    position.pop();

                    position.push(x);
                    position.push(y);
                }else{
                    // menambahkan titik ke array position
                    position.push(x);   
                    position.push(y);

                    // jumlah titik untuk current poligon bertambah 1
                    numIdx[nPolygons]++;
                    // jumlah total seluruh titik bertambah 1
                    idx++;
                }
                renderPenLine();
            }
        }
    })
}

function renderPenLine(){
    gl.useProgram(programPenLine);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    let positionAttributeLocation = gl.getAttribLocation(programPenLine, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


    // proses draw dilakukan untuk tiap polygon yang telah dibuat
    for(let i=0;i<=nPolygons;i++){
        if(mode[nPolygons]=="pen" || mode[nPolygons]=="line"){
            gl.drawArrays(gl.LINE_STRIP, start[i], numIdx[i]);
        }

    }
}

function initSquareRect() {
    gl = canvas.getContext("webgl");

    let vertexShaderSource = document.getElementById("vertex-shader-square-rect").text;
    let fragmentShaderSource = document.getElementById("fragment-shader-square-rect").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    programSquareRect = createProgram(gl, vertexShader, fragmentShader);

    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    
    // renderSquareRect();

    canvas.addEventListener("mousedown", function(e){ 
        mouseClicked = true;
       if(square){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
            mode[nPolygons] = "square";
        }else if(rect){
            nPolygons++;
            start[nPolygons] = idx;
            numIdx[nPolygons] = 0;
            mode[nPolygons] = "rect";
        }
    });
    canvas.addEventListener("mouseup", function(e){
        mouseClicked = false;
    })

    canvas.addEventListener("mousemove", function(e){
        if(mouseClicked){
            pos = mousePositiontoWebGLcoordiante(e, canvas);
            x =pos.x;
            y = pos.y;
            console.log(
                "x: ", x,
                "y: ", y
            )
            if(square){
                if(numIdx[nPolygons]==0){
                    position.push(x);
                    position.push(y);

                    numIdx[nPolygons]++;
                    idx++;
                }else if(numIdx[nPolygons]==4){
                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]--;
                        idx--;
                        for(let j=0;j<2;j++){
                            position.pop();
                        }
                    }
                }else{
                    x0 = position[position.length-2];
                    y0 = position[position.length-1];

                    // x1 = Math.abs(x);
                    // y1 = Math.abs(y);
                    abs = Math.abs;
                    let max = Math.max(
                        abs(x-x0), 
                        abs(y-y0), 
                        );

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

                    // if(x>=0 && y>=0){
                    //     position.push(x0);
                    //     position.push(max);

                    //     position.push(max);
                    //     position.push(max);

                    //     position.push(x0);
                    //     position.push(max);
                    // }else if(x>=0 && y<=0){
                    //     position.push(x0);
                    //     position.push(max*(-1));

                    //     position.push(max);
                    //     position.push(max*(-1));

                    //     position.push(max);
                    //     position.push(y0);
                    // }else if(x<=0 && y>=0){
                    //     position.push(x0);
                    //     position.push(max);

                    //     position.push(max*(-1));
                    //     position.push(max);

                    //     position.push(max*(-1));
                    //     position.push(y0);
                    // }else if(x<=0 && y<=0){
                    //     position.push(x0);
                    //     position.push(max*(-1));

                    //     position.push(max*(-1));
                    //     position.push(max*(-1));

                    //     position.push(x0);
                    //     position.push(max*(-1));
                    // }

                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]++;
                        idx++;
                    }
                    renderSquareRect();
                }
            }else if(rect){
                if(numIdx[nPolygons]==0){
                    position.push(x);
                    position.push(y);

                    numIdx[nPolygons]++;
                    idx++;
                }else if(numIdx[nPolygons]==4){
                    for(let i=0;i<3;i++){
                        numIdx[nPolygons]--;
                        idx--;
                        for(let j=0;j<2;j++){
                            position.pop();
                        }
                    }
                }else{
                    x0 = position[position.length-2];
                    y0 = position[position.length-1];

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
                    renderSquareRect();
                }
            }

            
        }
    })
}

// let data = [ -0.9533333333333334, 0.952000020345052, -0.9533333333333334, 0.4986666870117188, -0.45999999999999996, 0.4986666870117188, -0.45999999999999996, 0.952000020345052 ]

function renderSquareRect(){
    gl.useProgram(programSquareRect);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let positionBufferSquareRect = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferSquareRect);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    let positionAttributeLocationSquareRect = gl.getAttribLocation(programSquareRect, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocationSquareRect);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferSquareRect);
    gl.vertexAttribPointer(positionAttributeLocationSquareRect, 2, gl.FLOAT, false, 0, 0);

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // proses draw dilakukan untuk tiap polygon yang telah dibuat
    for(let i=0;i<=nPolygons;i++){
        if(mode[nPolygons]=="square" || mode[nPolygons]=="rect"){
            gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIdx[i]);
        }
    }
}

function drawRectOnDrag(){

}