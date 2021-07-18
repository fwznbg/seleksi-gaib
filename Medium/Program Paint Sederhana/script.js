let canvas = document.getElementById("gl-canvas");
let gl;
let program;
// let programSquareRect;

// bernilai true bila sedang berada di mode terkait
let line;
let pen;
let square;
let rect;

let drawTrack = [];
let lineStartPoints = [];

let mouseClicked = false;
let position = [];  // berisi titik koordinat di canvas
let nPolygons = 0;  // jumlah objek polygon yang dibuat
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
    // console.log("pen", pen);
    // console.log("line", line);
    // console.log("square", square);
    // console.log("rectangle", rect);
}

// function init(){
//     initPenLine();
//     initSquareRect();
// }

function init() {
    gl = canvas.getContext("webgl");

    let vertexShaderSource = document.getElementById("vertex-shader").text;
    let fragmentShaderSource = document.getElementById("fragment-shader").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);

    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);

    canvas.addEventListener("mousedown", function(e){ 
        mouseClicked = true;

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
    });
    canvas.addEventListener("mouseup", function(e){
        mouseClicked = false;
        drawTrack = [];
        lineStartPoints = [];
    });

    canvas.addEventListener("mousemove", function(e){
        if(mouseClicked){
            pos = mousePositiontoWebGLcoordiante(e, canvas);
            x =pos.x;
            y = pos.y;
            if(pen){
                if(drawTrack.length==2){
                    let tracks = createLine([drawTrack[0], drawTrack[1]], [x, y]);
                    // let tracks = createLine([0, 0], [x, y]);
                    for(let track of tracks){
                        position.push(track);
                    }
                    
                    for(let i=0; i<4;i++){
                        // jumlah titik untuk current poligon bertambah 1
                        numIdx[nPolygons]++;
                        // jumlah total seluruh titik bertambah 1
                        idx++;
                    }
                    render();

                    drawTrack = [];
                    // console.log(drawTrack[0], drawTrack[1], x, y);
                    drawTrack.push(x);
                    drawTrack.push(y);

                }else{
                    drawTrack.push(x);
                    drawTrack.push(y);
                }
            }else if(line){
                // pada line jumlah titik hanya 2
                // if(numIdx[nPolygons]==2){   
                //     // titik terakhir dihapus dan digantikan titik terbaru
                //     // agar saat cursor di-drag line yang terbentuk mengikuti gerakan cursor
                //     position.pop(); 
                //     position.pop();

                //     position.push(x);
                //     position.push(y);
                // }else{
                //     // menambahkan titik ke array position
                //     position.push(x);   
                //     position.push(y);

                //     // jumlah titik untuk current poligon bertambah 1
                //     numIdx[nPolygons]++;
                //     // jumlah total seluruh titik bertambah 1
                //     idx++;
                // }
                if(numIdx[nPolygons]==4){   
                    // titik terakhir dihapus dan digantikan titik terbaru
                    // agar saat cursor di-drag line yang terbentuk mengikuti gerakan cursor
                    for(let i=0;i<4;i++){
                        position.pop(); 
                        position.pop();
                    }
                    for(let i=0;i<4;i++){
                        // jumlah titik untuk current poligon bertambah 1
                        numIdx[nPolygons]--;
                        // jumlah total seluruh titik bertambah 1
                        idx--;
                    }
                }else if(lineStartPoints.length==2){
                    startX = lineStartPoints[0];
                    startY = lineStartPoints[1];

                    let tracks = createLine([startX,startY], [x,y]);
                    for(let track of tracks){
                        position.push(track);
                        console.log(track)

                    }

                    for(let i=0;i<4;i++){
                        // jumlah titik untuk current poligon bertambah 1
                        numIdx[nPolygons]++;
                        // jumlah total seluruh titik bertambah 1
                        idx++;
                    }
                    render();
                }else if(numIdx[nPolygons]==0){
                    // menambahkan titik ke array position
                    // position.push(x);   
                    // position.push(y);
                    lineStartPoints.push(x);   
                    lineStartPoints.push(y);

                    // jumlah titik untuk current poligon bertambah 1
                    // numIdx[nPolygons]++;
                    // jumlah total seluruh titik bertambah 1
                    // idx++;
                }
            }else if(square){
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
                }else if(numIdx[nPolygons]==1 || numIdx[nPolygons]==2 || numIdx[nPolygons]==3){
                    x0 = position[position.length-2];
                    y0 = position[position.length-1];

                    abs = Math.abs;
                    let max = Math.max(abs(x-x0), abs(y-y0));

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
                }else if(numIdx[nPolygons]==1 || numIdx[nPolygons]==2 || numIdx[nPolygons]==3){
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
                    render();
                }
            }
        }
    });
}

function render(){
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


    // proses draw dilakukan untuk tiap polygon yang telah dibuat
    for(let i=0;i<=nPolygons;i++){
        // if(mode[nPolygons]=="pen" || mode[nPolygons]=="line"){
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIdx[i]);
        // }
    }
}

// function initSquareRect() {
//     gl = canvas.getContext("webgl");

//     let vertexShaderSource = document.getElementById("vertex-shader-square-rect").text;
//     let fragmentShaderSource = document.getElementById("fragment-shader-square-rect").text;

//     let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//     let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//     programSquareRect = createProgram(gl, vertexShader, fragmentShader);

//     gl.clearColor(0, 1, 1, 1)
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
    
//     // renderSquareRect();

//     canvas.addEventListener("mousedown", function(e){ 
//         mouseClicked = true;
//        if(square){
//             nPolygons++;
//             start[nPolygons] = idx;
//             numIdx[nPolygons] = 0;
//             mode[nPolygons] = "square";
//         }else if(rect){
//             nPolygons++;
//             start[nPolygons] = idx;
//             numIdx[nPolygons] = 0;
//             mode[nPolygons] = "rect";
//         }
//     });
//     canvas.addEventListener("mouseup", function(e){
//         mouseClicked = false;
//     })

//     canvas.addEventListener("mousemove", function(e){
//         if(mouseClicked){
//             pos = mousePositiontoWebGLcoordiante(e, canvas);
//             x =pos.x;
//             y = pos.y;
//             // console.log(
//             //     "x: ", x,
//             //     "y: ", y
//             // )
//             if(square){
//                 if(numIdx[nPolygons]==0){
//                     position.push(x);
//                     position.push(y);

//                     numIdx[nPolygons]++;
//                     idx++;
//                 }else if(numIdx[nPolygons]==4){
//                     for(let i=0;i<3;i++){
//                         numIdx[nPolygons]--;
//                         idx--;
//                         for(let j=0;j<2;j++){
//                             position.pop();
//                         }
//                     }
//                 }else{
//                     x0 = position[position.length-2];
//                     y0 = position[position.length-1];

//                     // x1 = Math.abs(x);
//                     // y1 = Math.abs(y);
//                     abs = Math.abs;
//                     let max = Math.max(
//                         abs(x-x0), 
//                         abs(y-y0), 
//                         );

//                     if(x0>x){
//                         if(y0>y){
//                             position.push(x0-max);
//                             position.push(y0);

//                             position.push(x0-max);
//                             position.push(y0-max);

//                             position.push(x0);
//                             position.push(y0-max);
//                         }else{
//                             position.push(x0-max);
//                             position.push(y0);

//                             position.push(x0-max);
//                             position.push(y0+max);

//                             position.push(x0);
//                             position.push(y0+max);
//                         }
//                     }else{
//                         if(y0>y){
//                             position.push(x0+max);
//                             position.push(y0);

//                             position.push(x0+max);
//                             position.push(y0-max);

//                             position.push(x0);
//                             position.push(y0-max);
//                         }else{
//                             position.push(x0+max);
//                             position.push(y0);

//                             position.push(x0+max);
//                             position.push(y0+max);

//                             position.push(x0);
//                             position.push(y0+max);
//                         }
//                     }
//                     for(let i=0;i<3;i++){
//                         numIdx[nPolygons]++;
//                         idx++;
//                     }

//                     renderSquareRect();
//                 }
//             }else if(rect){
//                 if(numIdx[nPolygons]==0){
//                     position.push(x);
//                     position.push(y);

//                     numIdx[nPolygons]++;
//                     idx++;
//                 }else if(numIdx[nPolygons]==4){
//                     for(let i=0;i<3;i++){
//                         numIdx[nPolygons]--;
//                         idx--;
//                         for(let j=0;j<2;j++){
//                             position.pop();
//                         }
//                     }
//                 }else{
//                     x0 = position[position.length-2];
//                     y0 = position[position.length-1];

//                     position.push(x0);
//                     position.push(y);

//                     position.push(x);
//                     position.push(y);

//                     position.push(x);
//                     position.push(y0);

//                     for(let i=0;i<3;i++){
//                         numIdx[nPolygons]++;
//                         idx++;
//                     }
//                     renderSquareRect();
//                 }
//             }
//         }
//     });
// }

// function renderSquareRect(){
//     gl.useProgram(programSquareRect);

//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);
//     resizeCanvas(canvas);
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//     let positionBufferSquareRect = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferSquareRect);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
//     // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

//     let positionAttributeLocationSquareRect = gl.getAttribLocation(programSquareRect, "a_position");
//     gl.enableVertexAttribArray(positionAttributeLocationSquareRect);
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferSquareRect);
//     gl.vertexAttribPointer(positionAttributeLocationSquareRect, 2, gl.FLOAT, false, 0, 0);

//     // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

//     // proses draw dilakukan untuk tiap polygon yang telah dibuat
//     for(let i=0;i<=nPolygons;i++){
//         if(mode[nPolygons]=="square" || mode[nPolygons]=="rect"){
//             gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIdx[i]);
//         }
//     }
// }


function createLine(begin, end){
    // get initial and final pts on a line, return rectangle with width
    var width = 0.003;
    var beta = (Math.PI/2.0) - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
    var delta_x = Math.cos(beta)*width;
    var delta_y = Math.sin(beta)*width;
    return [begin[0] - delta_x, begin[1] + delta_y,
            begin[0] + delta_x, begin[1] - delta_y,
            end[0] + delta_x, end[1] - delta_y,
            end[0] - delta_x, end[1] + delta_y];
}