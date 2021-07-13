let canvasCube = document.getElementById("canvas1");
let glCube;
let programCube;

let canvasPyramid = document.getElementById("canvas2");
let glPyramid;
let programPyramid;

// slider kubus
let x_cube = document.getElementById("x-cube");
let y_cube = document.getElementById("y-cube");
let z_cube = document.getElementById("z-cube");

// slider pyramid
let x_pyramid = document.getElementById("x-pyramid");
let y_pyramid = document.getElementById("y-pyramid");
let z_pyramid = document.getElementById("z-pyramid");


// mengembalikan sebuah shader 
const createShader = (gl, type, source)=> {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return shader;
}

// mengembalikan sebuah program
const createProgram = (gl, vertex, fragment)=> {
  let program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  return program;
}

// untuk melakukan rotasi
let m4 = {
  // membuat matriks identitas
  create: ()=> {
    return [
      1.0, 0.0, 0.0, 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      0.0, 0.0, 1.0, 0.0, 
      0.0, 0.0, 0.0, 1.0,
    ];
  },
  // matriks rotasi pada sumbu-x dengan masukan dalam radian
  xRotation: (angleInRadians)=> {
    let c = Math.cos(angleInRadians);
    let s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0, 
      0, c, s, 0, 
      0, -s, c, 0, 
      0, 0, 0, 1
    ];
  },
  // matriks rotasi pada sumbu-y dengan masukan dalam radian
  yRotation: (angleInRadians)=> {
    let c = Math.cos(angleInRadians);
    let s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  },
  // matriks rotasi pada sumbu-z dengan masukan dalam radian
  zRotation: (angleInRadians)=> {
    let c = Math.cos(angleInRadians);
    let s = Math.sin(angleInRadians);

    return [
      c, s, 0, 0, 
      -s, c, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ];
  }, 

  // mengembalikan matriks 4x4 hasil perkalian matriks a dan b
  multiply: (a, b)=> {
    let b00 = b[0];
    let b01 = b[1];
    let b02 = b[2];
    let b03 = b[3];
    let b10 = b[4];
    let b11 = b[5];
    let b12 = b[6];
    let b13 = b[7];
    let b20 = b[8];
    let b21 = b[9];
    let b22 = b[10];
    let b23 = b[11];
    let b30 = b[12];
    let b31 = b[13];
    let b32 = b[14];
    let b33 = b[15];
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];
    let a30 = a[12];
    let a31 = a[13];
    let a32 = a[14];
    let a33 = a[15];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
  // mengembalikan matriks hasil rotasi pada sumbu-x
  xRotate: (m, angleInRadians)=> {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },
  // mengembalikan matriks hasil rotasi pada sumbu-y
  yRotate: (m, angleInRadians)=> {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },
  // mengembalikan matriks hasil rotasi pada sumbu-z
  zRotate: (m, angleInRadians)=> {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },
};

// mengembalikan array dengan nilai random (0-1)
const randomColor = ()=> {
  return [Math.random(), Math.random(), Math.random()];
}

// mengubah derajat menjadi radian
const degToRad = (d)=> {
  return (d * Math.PI) / 180;
}

// data vertex kubus
const cubePosition = [
  // Front
  0.5, 0.5, 0.5, 
  0.5, -0.5, 0.5, 
  -0.5, 0.5, 0.5, 
  -0.5, 0.5, 0.5, 
  0.5, -0.5, 0.5,
  -0.5, -0.5, 0.5,

  // Left
  -0.5, 0.5, 0.5, 
  -0.5, -0.5, 0.5, 
  -0.5, 0.5, -0.5, 
  -0.5, 0.5, -0.5, 
  -0.5, -0.5, 0.5, 
  -0.5, -0.5, -0.5,

  // Back
  -0.5, 0.5, -0.5, 
  -0.5, -0.5, -0.5, 
  0.5, 0.5, -0.5, 
  0.5, 0.5, -0.5, 
  -0.5, -0.5,-0.5, 
  0.5, -0.5, -0.5,

  // Right
  0.5, 0.5, -0.5, 
  0.5, -0.5, -0.5, 
  0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 
  0.5, -0.5, 0.5, 
  0.5, -0.5, -0.5,

  // Top
  0.5, 0.5, 0.5, 
  0.5, 0.5, -0.5, 
  -0.5, 0.5, 0.5, 
  -0.5, 0.5, 0.5, 
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,

  // Bottom
  0.5, -0.5, 0.5, 
  0.5, -0.5, -0.5, 
  -0.5, -0.5, 0.5, 
  -0.5, -0.5, 0.5, 
  0.5, -0.5,-0.5, 
  -0.5, -0.5, -0.5,
];

const pyramidPosition = [
    // Front
    -0.5, -0.5, 0.5, 
    0.0, -0.5, 0.5, 
    0.0, 0.5, 0.0, 
    0.5, -0.5, 0.5, 
    0.0, -0.5, 0.5, 
    0.0, 0.5, 0.0, 
  
    // Left
    -0.5, -0.5, 0.5, 
    -0.5, -0.5, -0.5, 
    0.0, 0.5, 0.0, 
    -0.5,-0.5, -0.5, 
    -0.5, -0.5, -0.5, 
    0.0, 0.5, 0.0, 
  
    // Back
    0.5, -0.5, -0.5, 
    0.0, -0.5, -0.5, 
    0.0, 0.5, 0.0, 
    -0.5, -0.5, -0.5, 
    0.0, -0.5, -0.5, 
    0.0, 0.5, 0.0, 
  
    // Right
    0.5, -0.5, 0.5, 
    0.5, -0.5, 0.0, 
    0.0, 0.5, 0.0, 
    0.5, -0.5, -0.5, 
    0.5, -0.5, 0.0,  
    0.0, 0.5, 0.0,
  
    // Bottom
    0.5, -0.5, 0.5, 
    0.5, -0.5, -0.5, 
    -0.5, -0.5, 0.5, 
    -0.5, -0.5, 0.5, 
    0.5, -0.5,-0.5, 
    -0.5, -0.5, -0.5,
];


const init = () => {
  initCube();
  renderCube();
  
  initPyramid();
  renderPyramid();
};

// merender kubus dan pyramid saat slider digeser
x_cube.oninput = ()=>{
  x_cube.nextElementSibling.value = x_cube.value;
  renderCube();
}
y_cube.oninput = ()=>{
  y_cube.nextElementSibling.value = y_cube.value;
  renderCube();
}
z_cube.oninput = ()=>{
  z_cube.nextElementSibling.value = z_cube.value;
  renderCube();
}

x_pyramid.oninput = ()=>{
  x_pyramid.nextElementSibling.value = x_pyramid.value;
  renderPyramid();
}
y_pyramid.oninput = ()=>{
  y_pyramid.nextElementSibling.value = y_pyramid.value;
  renderPyramid();
}
z_pyramid.oninput = ()=>{
  z_pyramid.nextElementSibling.value = z_pyramid.value;
  renderPyramid();
}

const initCube = ()=> {
  // mengenerate warna secara random untuk tiap sisi kubus
  let colorCube = [];
  for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
      colorCube.push(...faceColor);
    }
  }
  
  glCube = canvasCube.getContext("webgl");
  if (!glCube) {
    alert("Not supported");
  }
  
  // membuat shader
  let vertexShaderSource = document.getElementById("vertex-shader-cube").text;
  let fragmentShaderSource = document.getElementById("fragment-shader-cube").text;

  let vertexShader = createShader(glCube, glCube.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(glCube, glCube.FRAGMENT_SHADER, fragmentShaderSource);

  // membuat program
  programCube = createProgram(glCube, vertexShader, fragmentShader);

  let positionBuffer = glCube.createBuffer();
  glCube.bindBuffer(glCube.ARRAY_BUFFER, positionBuffer);
  glCube.bufferData(glCube.ARRAY_BUFFER, new Float32Array(cubePosition), glCube.STATIC_DRAW);

  let colorBuffer = glCube.createBuffer();
  glCube.bindBuffer(glCube.ARRAY_BUFFER, colorBuffer);
  glCube.bufferData(glCube.ARRAY_BUFFER, new Float32Array(colorCube), glCube.STATIC_DRAW);

  const positionAttributeLocation = glCube.getAttribLocation(programCube, "a_position");
  const colorAttributeLocation = glCube.getAttribLocation(programCube, "a_color");

  glCube.enableVertexAttribArray(positionAttributeLocation);
  glCube.bindBuffer(glCube.ARRAY_BUFFER, positionBuffer);
  glCube.vertexAttribPointer(positionAttributeLocation, 3, glCube.FLOAT, false, 0, 0);

  glCube.enableVertexAttribArray(colorAttributeLocation);
  glCube.bindBuffer(glCube.ARRAY_BUFFER, colorBuffer);
  glCube.vertexAttribPointer(colorAttributeLocation, 3, glCube.FLOAT, false, 0, 0);

  glCube.useProgram(programCube);
  glCube.enable(glCube.DEPTH_TEST);

  // resize canvas
  const displayWidthCube = canvasCube.clientWidth;
  const displayHeightCube = canvasCube.clientHeight;
  if (canvasCube.width !== displayWidthCube || canvasCube.height !== displayHeightCube) {
    canvasCube.width = displayWidthCube;
    canvasCube.height = displayHeightCube;
  }
  glCube.viewport(0, 0, glCube.canvas.width, glCube.canvas.height);
}
const renderCube = (x=x_cube.value, y=y_cube.value, z=z_cube.value) => {
  glCube.clear(glCube.COLOR_BUFFER_BIT | glCube.DEPTH_BUFER_BIT);

  const rotation = [degToRad(x), degToRad(y), degToRad(z)];

  let matrix = m4.create();
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);

  const matrixLocation = glCube.getUniformLocation(programCube, "u_matrix");
  glCube.uniformMatrix4fv(matrixLocation, false, matrix);

  glCube.drawArrays(glCube.TRIANGLES, 0, 36);
};

const initPyramid = ()=> {
   // mengenerate warna secara random untuk tiap sisi kubus
   let colorPyramid = [];
   for (let face = 0; face < 5; face++) {
     let faceColor = randomColor();
     for (let vertex = 0; vertex < 6; vertex++) {
      colorPyramid.push(...faceColor);
     }
   }
   
   glPyramid = canvasPyramid.getContext("webgl");
   if (!glPyramid) {
     alert("Not supported");
   }
   
   // membuat shader
   let vertexShaderSource = document.getElementById("vertex-shader-pyramid").text;
   let fragmentShaderSource = document.getElementById("fragment-shader-pyramid").text;
 
   let vertexShader = createShader(glPyramid, glPyramid.VERTEX_SHADER, vertexShaderSource);
   let fragmentShader = createShader(glPyramid, glPyramid.FRAGMENT_SHADER, fragmentShaderSource);
 
   // membuat program
   programPyramid = createProgram(glPyramid, vertexShader, fragmentShader);
 
   let positionBuffer = glPyramid.createBuffer();
   glPyramid.bindBuffer(glPyramid.ARRAY_BUFFER, positionBuffer);
   glPyramid.bufferData(glPyramid.ARRAY_BUFFER, new Float32Array(pyramidPosition), glPyramid.STATIC_DRAW);
 
   let colorBuffer = glPyramid.createBuffer();
   glPyramid.bindBuffer(glPyramid.ARRAY_BUFFER, colorBuffer);
   glPyramid.bufferData(glPyramid.ARRAY_BUFFER, new Float32Array(colorPyramid), glPyramid.STATIC_DRAW);
 
   const positionAttributeLocation = glPyramid.getAttribLocation(programPyramid, "a_position");
   const colorAttributeLocation = glPyramid.getAttribLocation(programPyramid, "a_color");
 
   glPyramid.enableVertexAttribArray(positionAttributeLocation);
   glPyramid.bindBuffer(glPyramid.ARRAY_BUFFER, positionBuffer);
   glPyramid.vertexAttribPointer(positionAttributeLocation, 3, glPyramid.FLOAT, false, 0, 0);
 
   glPyramid.enableVertexAttribArray(colorAttributeLocation);
   glPyramid.bindBuffer(glPyramid.ARRAY_BUFFER, colorBuffer);
   glPyramid.vertexAttribPointer(colorAttributeLocation, 3, glPyramid.FLOAT, false, 0, 0);
 
   glPyramid.useProgram(programPyramid);
   glPyramid.enable(glPyramid.DEPTH_TEST);

     // resize canvas
  const displayWidthPyramid = canvasPyramid.clientWidth;
  const displayHeightPyramid = canvasPyramid.clientHeight;
  if (canvasPyramid.width !== displayWidthPyramid || canvasPyramid.height !== displayHeightPyramid) {
    canvasPyramid.width = displayWidthPyramid;
    canvasPyramid.height = displayHeightPyramid;
  }
  glPyramid.viewport(0, 0, glPyramid.canvas.width, glPyramid.canvas.height);
}

const renderPyramid = (x=x_pyramid.value, y=y_pyramid.value, z=z_pyramid.value) => {
  glPyramid.clear(glPyramid.COLOR_BUFFER_BIT | glPyramid.DEPTH_BUFER_BIT);

  const rotation = [degToRad(x), degToRad(y), degToRad(z)];

  let matrix = m4.create();
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);

  const matrixLocation = glPyramid.getUniformLocation(programPyramid, "u_matrix");
  glPyramid.uniformMatrix4fv(matrixLocation, false, matrix);

  glPyramid.drawArrays(glPyramid.TRIANGLES, 0, 30);
};


window.onload = init;