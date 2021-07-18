let canvas = document.getElementById("gl-canvas");
let gl;
let program;
let line;
let pen;
let mouseClicked = false;
let position = [];
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

function init() {
    gl = canvas.getContext("webgl");

    let vertexShaderSource = document.getElementById("vertex-shader").text;
    let fragmentShaderSource = document.getElementById("fragment-shader").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);

    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFER_BIT);

    gl.useProgram(program);

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
        }
    });
    canvas.addEventListener("mouseup", function(e){
        mouseClicked = false;
    })

    canvas.addEventListener("mousemove", function(e){
        if(mouseClicked){
            pos = mousePositiontoWebGLcoordiante(e, canvas);
            if(pen){
                console.log(
                    "x: ", pos.x,
                    "y: ", pos.y
                )
                // menambahkan titik ke array position
                position.push(pos.x);
                position.push(pos.y);

                // jumlah titik untuk current poligon bertambah 1
                numIdx[nPolygons]++;
                // jumlah total seluruh titik bertambah 1
                idx++;
                render();
            }else if(line){
                console.log(
                    "x: ", pos.x,
                    "y: ", pos.y
                )
                // pada line jumlah titik hanya 2
                if(numIdx[nPolygons]==2){   
                    // titik terakhir dihapus dan digantikan titik terbaru
                    // agar saat cursor di-drag line yang terbentuk mengikuti gerakan cursor
                    position.pop(); 
                    position.pop();

                    position.push(pos.x);
                    position.push(pos.y);
                }else{
                    // menambahkan titik ke array position
                    position.push(pos.x);   
                    position.push(pos.y);

                    // jumlah titik untuk current poligon bertambah 1
                    numIdx[nPolygons]++;
                    // jumlah total seluruh titik bertambah 1
                    idx++;
                }
                render();
            }
        }
    })
}

function render(){
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
        gl.drawArrays(gl.LINE_STRIP, start[i], numIdx[i]);
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
    console.log(line);
}