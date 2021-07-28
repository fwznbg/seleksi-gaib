let canvas = document.getElementById("gl-canvas");
let gl;
let matrixLocation;
let normalAttLoc;

let program;

let x_translation = document.getElementById("x-translation");
let y_translation = document.getElementById("y-translation");
let z_translation = document.getElementById("z-translation");

let x_rotation = document.getElementById("x-rotation");
let y_rotation = document.getElementById("y-rotation");
let z_rotation = document.getElementById("z-rotation");

let x_scaling = document.getElementById("x-scale");
let y_scaling = document.getElementById("y-scale");
let z_scaling = document.getElementById("z-scale");

let translation = [x_translation.value, y_translation.value, z_translation.value];
let rotation = [x_rotation.value, y_rotation.value, z_rotation.value];
let scaling = [x_scaling.value, y_scaling.value, z_scaling.value];

x_translation.oninput = function(){
    this.nextElementSibling.value = this.value;
    translation[0] = this.value;
    render();
}

y_translation.oninput = function(){
    this.nextElementSibling.value = this.value;
    translation[1] = this.value;
    render();
}

z_translation.oninput = function(){
    this.nextElementSibling.value = this.value;
    translation[2] = this.value;
    render();
}

x_rotation.oninput = function(){
    this.nextElementSibling.value = this.value;
    rotation[0] = this.value;
    render();
}

y_rotation.oninput = function(){
    this.nextElementSibling.value = this.value;
    rotation[1] = this.value;
    render();
}

z_rotation.oninput = function(){
    this.nextElementSibling.value = this.value;
    rotation[2] = this.value;
    render();
}

x_scaling.oninput = function(){
    this.nextElementSibling.value = this.value;
    scaling[0] = this.value;
    render();    
}

y_scaling.oninput = function(){
    this.nextElementSibling.value = this.value;
    scaling[1] = this.value;
    render();
}

z_scaling.oninput = function(){
    this.nextElementSibling.value = this.value;
    scaling[2] = this.value;
    render();
}

// array of vertices
let positions = [
    /* TOP */
    // top
    // left
    -0.5, 0.5, -0.5,
    -0.4, 0.5, -0.4,
    -0.5, 0.5, 0.5,

    -0.5, 0.5, 0.5,
    -0.4, 0.5, -0.4,
    -0.4, 0.5, 0.4,

    // right
    0.4, 0.5, -0.4,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,

    0.4, 0.5, -0.4,
    0.5, 0.5, 0.5,
    0.4, 0.5, 0.4,

    // back
    -0.4, 0.5, -0.4,
    -0.5, 0.5, -0.5,
    0.4, 0.5, -0.4,

    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.4, 0.5, -0.4,

    // front
    -0.5, 0.5, 0.5,
    -0.4, 0.5, 0.4,
    0.4, 0.5, 0.4,    

    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.4, 0.5, 0.4,

    // bottom
    // left
    -0.4, 0.4, -0.4,
    -0.5, 0.4, -0.5,
    -0.5, 0.4, 0.5,

    -0.4, 0.4, -0.4,
    -0.5, 0.4, 0.5,
    -0.4, 0.4, 0.4,

    // right
    0.5, 0.4, -0.5,
    0.4, 0.4, -0.4,
    0.5, 0.4, 0.5,

    0.5, 0.4, 0.5,
    0.4, 0.4, -0.4,
    0.4, 0.4, 0.4,

    // back
    -0.5, 0.4, -0.5,
    -0.4, 0.4, -0.4,
    0.4, 0.4, -0.4,

    0.5, 0.4, -0.5,
    -0.5, 0.4, -0.5,
    0.4, 0.4, -0.4,

    // front
    -0.4, 0.4, 0.4,
    -0.5, 0.4, 0.5,
    0.4, 0.4, 0.4,    

    -0.5, 0.4, 0.5,
    0.5, 0.4, 0.5,
    0.4, 0.4, 0.4,

    // inside
    // right
    0.4, 0.4, -0.4,
    0.4, 0.5, 0.4,
    0.4, 0.4, 0.4,

    0.4, 0.4, -0.4,
    0.4, 0.5, -0.4,
    0.4, 0.5, 0.4,

    // left
    -0.4, 0.5, 0.4,
    -0.4, 0.4, -0.4,
    -0.4, 0.4, 0.4,

    -0.4, 0.5, -0.4,
    -0.4, 0.4, -0.4,
    -0.4, 0.5, 0.4,

    // front
    -0.4, 0.5, 0.4,
    -0.4, 0.4, 0.4,
    0.4, 0.5, 0.4,

    0.4, 0.5, 0.4,
    -0.4, 0.4, 0.4,
    0.4, 0.4, 0.4,

    // back
    -0.4, 0.4, -0.4,
    -0.4, 0.5, -0.4,
    0.4, 0.5, -0.4,

    -0.4, 0.4, -0.4,
    0.4, 0.5, -0.4,
    0.4, 0.4, -0.4,

    // outside
    // right
    0.5, 0.5, -0.5,
    0.5, 0.4, -0.5,
    0.5, 0.5, 0.5,

    0.5, 0.5, 0.5,
    0.5, 0.4, -0.5,
    0.5, 0.4, 0.5,

    // // left
    -0.5, 0.4, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,

    -0.5, 0.4, -0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.4, 0.5,

    // front
    -0.5, 0.4, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,

    -0.5, 0.4, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.4, 0.5,

    // back
    -0.5, 0.5, -0.5,
    -0.5, 0.4, -0.5,
    0.5, 0.5, -0.5,

    0.5, 0.5, -0.5,
    -0.5, 0.4, -0.5,
    0.5, 0.4, -0.5,
    
    /* BOTTOM */
    // top
    // left
    -0.4, -0.5, -0.4,
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,

    -0.4, -0.5, -0.4,
    -0.5, -0.5, 0.5,
    -0.4, -0.5, 0.4,

    // right
    0.5, -0.5, -0.5,
    0.4, -0.5, -0.4,
    0.5, -0.5, 0.5,

    0.5, -0.5, 0.5,
    0.4, -0.5, -0.4,
    0.4, -0.5, 0.4,

    // back
    -0.5, -0.5, -0.5,
    -0.4, -0.5, -0.4,
    0.4, -0.5, -0.4,

    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    0.4, -0.5, -0.4,

    // front
    -0.4, -0.5, 0.4,
    -0.5, -0.5, 0.5,
    0.4, -0.5, 0.4,    

    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.4, -0.5, 0.4,

    // bottom
    // left
    -0.5, -0.4, -0.5,
    -0.4, -0.4, -0.4,
    -0.5, -0.4, 0.5,

    -0.5, -0.4, 0.5,
    -0.4, -0.4, -0.4,
    -0.4, -0.4, 0.4,

    // right
    0.4, -0.4, -0.4,
    0.5, -0.4, -0.5,
    0.5, -0.4, 0.5,

    0.4, -0.4, -0.4,
    0.5, -0.4, 0.5,
    0.4, -0.4, 0.4,

    // back
    -0.4, -0.4, -0.4,
    -0.5, -0.4, -0.5,
    0.4, -0.4, -0.4,

    -0.5, -0.4, -0.5,
    0.5, -0.4, -0.5,
    0.4, -0.4, -0.4,

    // front
    -0.5, -0.4, 0.5,
    -0.4, -0.4, 0.4,
    0.4, -0.4, 0.4,    

    0.5, -0.4, 0.5,
    -0.5, -0.4, 0.5,
    0.4, -0.4, 0.4,

    // inside
    // right
    0.4, -0.5, 0.4,
    0.4, -0.4, -0.4,
    0.4, -0.4, 0.4,

    0.4, -0.5, -0.4,
    0.4, -0.4, -0.4,
    0.4, -0.5, 0.4,

    // left
    -0.4, -0.4, -0.4,
    -0.4, -0.5, 0.4,
    -0.4, -0.4, 0.4,

    -0.4, -0.4, -0.4,
    -0.4, -0.5, -0.4,
    -0.4, -0.5, 0.4,

    // front
    -0.4, -0.4, 0.4,
    -0.4, -0.5, 0.4,
    0.4, -0.5, 0.4,

    -0.4, -0.4, 0.4,
    0.4, -0.5, 0.4,
    0.4, -0.4, 0.4,

    // back
    -0.4, -0.5, -0.4,
    -0.4, -0.4, -0.4,
    0.4, -0.5, -0.4,

    0.4, -0.5, -0.4,
    -0.4, -0.4, -0.4,
    0.4, -0.4, -0.4,

    // outside
    // right
    0.5, -0.4, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,

    0.5, -0.4, -0.5,
    0.5, -0.5, 0.5,
    0.5, -0.4, 0.5,

    // // left
    -0.5, -0.5, -0.5,
    -0.5, -0.4, -0.5,
    -0.5, -0.5, 0.5,

    -0.5, -0.5, 0.5,
    -0.5, -0.4, -0.5,
    -0.5, -0.4, 0.5,

    // front
    -0.5, -0.5, 0.5,
    -0.5, -0.4, 0.5,
    0.5, -0.5, 0.5,

    0.5, -0.5, 0.5,
    -0.5, -0.4, 0.5,
    0.5, -0.4, 0.5,

    // back
    -0.5, -0.4, -0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,

    -0.5, -0.4, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.4, -0.5,

    // RIGHT FRONT PILLAR
    // right
    0.5, -0.4, 0.5,
    0.5, 0.4, 0.5,
    0.5, -0.4, 0.4,

    0.5, 0.4, 0.5,
    0.5, 0.4, 0.4,
    0.5, -0.4, 0.4,

    // left
    0.4, -0.4, 0.4, 
    0.4, 0.4, 0.4, 
    0.4, -0.4, 0.5, 

    0.4, 0.4, 0.4, 
    0.4, 0.4, 0.5, 
    0.4, -0.4, 0.5, 

    // front
    0.4, -0.4, 0.5,
    0.4, 0.4, 0.5,
    0.5, -0.4, 0.5,

    0.5, -0.4, 0.5, 
    0.4, 0.4, 0.5, 
    0.5, 0.4, 0.5,

    // back
    0.4, 0.4, 0.4,
    0.4, -0.4, 0.4,
    0.5, -0.4, 0.4,

    0.4, 0.4, 0.4, 
    0.5, -0.4, 0.4, 
    0.5, 0.4, 0.4,

    // RIGHT BACK PILLAR
    // right
    0.5, -0.4, -0.4,
    0.5, 0.4, -0.4,
    0.5, -0.4, -0.5,

    0.5, 0.4, -0.4,
    0.5, 0.4, -0.5,
    0.5, -0.4, -0.5,

    // left
    0.4, -0.4, -0.5, 
    0.4, 0.4, -0.5, 
    0.4, -0.4, -0.4, 

    0.4, 0.4, -0.5, 
    0.4, 0.4, -0.4, 
    0.4, -0.4, -0.4, 

    // front
    0.4, -0.4, -0.4,
    0.4, 0.4, -0.4,
    0.5, -0.4, -0.4,

    0.4, 0.4, -0.4, 
    0.5, 0.4, -0.4,
    0.5, -0.4, -0.4, 

    // back
    0.4, 0.4, -0.5,
    0.4, -0.4, -0.5,
    0.5, -0.4, -0.5,

    0.5, 0.4, -0.5,
    0.4, 0.4, -0.5, 
    0.5, -0.4, -0.5, 

    // LEFT FRONT PILLAR
    // left
    -0.5, -0.4, 0.5,
    -0.5, -0.4, 0.4,
    -0.5, 0.4, 0.5,

    -0.5, 0.4, 0.4,
    -0.5, 0.4, 0.5,
    -0.5, -0.4, 0.4,

    // right
    -0.4, 0.4, 0.4, 
    -0.4, -0.4, 0.4, 
    -0.4, -0.4, 0.5, 

    -0.4, 0.4, 0.5, 
    -0.4, 0.4, 0.4, 
    -0.4, -0.4, 0.5, 

    // front
    -0.4, 0.4, 0.5,
    -0.4, -0.4, 0.5,
    -0.5, -0.4, 0.5,

    -0.4, 0.4, 0.5, 
    -0.5, -0.4, 0.5, 
    -0.5, 0.4, 0.5,

    // back
    -0.4, -0.4, 0.4,
    -0.4, 0.4, 0.4,
    -0.5, -0.4, 0.4,

    -0.5, -0.4, 0.4, 
    -0.4, 0.4, 0.4, 
    -0.5, 0.4, 0.4,

    // LEFT BACK PILLAR
    // left
    -0.5, 0.4, -0.4,
    -0.5, -0.4, -0.4,
    -0.5, -0.4, -0.5,

    -0.5, 0.4, -0.5,
    -0.5, 0.4, -0.4,
    -0.5, -0.4, -0.5,

    // right
    -0.4, 0.4, -0.5, 
    -0.4, -0.4, -0.5, 
    -0.4, -0.4, -0.4, 

    -0.4, 0.4, -0.4, 
    -0.4, 0.4, -0.5, 
    -0.4, -0.4, -0.4, 

    // front
    -0.4, 0.4, -0.4,
    -0.4, -0.4, -0.4,
    -0.5, -0.4, -0.4,

    -0.5, -0.4, -0.4, 
    -0.5, 0.4, -0.4,
    -0.4, 0.4, -0.4, 

    // back
    -0.4, -0.4, -0.5,
    -0.4, 0.4, -0.5,
    -0.5, -0.4, -0.5,

    -0.5, -0.4, -0.5, 
    -0.4, 0.4, -0.5, 
    -0.5, 0.4, -0.5,
];

// array of normals for evvery vertices
let normals = new Float32Array([
    /* TOP */
    // top
    // left
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // right
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // back
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // front
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // bottom
    // left
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // right
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // back
     0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // front
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // inside
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // outside
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    
    /* BOTTOM */
    // bottom
    // left
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // right
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // back
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // front
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // top
    // left
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // right
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // back
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // front
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,


    // inside
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // outside
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // RIGHT FRONT PILLAR
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // RIGHT BACK PILLAR
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /// front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // back
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // LEFT FRONT PILLAR
    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0, 
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0, 

     /// front
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
 
     // back
    0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,

    // LEFT BACK PILLAR
    // left
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0, 

    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0, 

     /// front
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
 
     // back
    0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
]);

let colors = [];

function colorPicker(){
    return document.getElementById("color").value;
}

// convert hex values to rgb
function hexToRgb(hex){
    let g = parseInt(hex.slice(3, 5), 16);
    let r = parseInt(hex.slice(1, 3), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = normalizeRGB(r);
    g = normalizeRGB(g);
    b = normalizeRGB(b);

    return {r, g, b};
}

// convert rgb (0-255) to (0-1)
function normalizeRGB(c){
    return ((c-255)/255)+1;
}

function initColor(){
    const  rgb = hexToRgb(colorPicker());
    colors.push(rgb.r, rgb.g, rgb.b, 1);    
}

function updateColor(){
    colors = [];

    const  rgb = hexToRgb(colorPicker());
    colors.push(rgb.r, rgb.g, rgb.b, 1);

    render();
}

function init(){
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Not supported");
    }

    let vertexShaderSource = document.getElementById("vertex").text;
    let fragmentShaderSource = document.getElementById("fragment").text;

    let vertexShader =  createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader =  createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    let posAttLoc = gl.getAttribLocation(program, "a_position");
    normalAttLoc = gl.getAttribLocation(program, "a_normal");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");
    
    gl.enableVertexAttribArray(posAttLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(posAttLoc, 3, gl.FLOAT, false, 0, 0);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    resizeCanvas(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    initColor();

    render();
}

function render(){
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(normalAttLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttLoc, 3, gl.FLOAT, false, 0, 0);

    let colorUniformLoc = gl.getUniformLocation(program, "u_color");
    let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
   
    gl.uniform4fv(colorUniformLoc, colors);

    let lightDirection = [0.8, 0.9, 1];
    gl.uniform3fv(reverseLightDirectionLocation, normalize(lightDirection));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let matrix = createM4Identity();
    matrix = translateM4(matrix, translation[0], translation[1], translation[2]);
    matrix = rotateM4x(matrix, rotation[0]);
    matrix = rotateM4y(matrix, rotation[1]);
    matrix = rotateM4z(matrix, rotation[2]);
    matrix = scaleM4(matrix, scaling[0], scaling[1], scaling[2]);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    let count = positions.length/3;
    gl.drawArrays(gl.TRIANGLES, 0, count);
}

window.onload = init;

// return a shader
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    // return shader;
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  }
  
  // return a shader program
function createProgram(gl, vertex, fragment){
    let program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    // return program;
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
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

// return a "matrix" identity
function createM4Identity(){
    return [
        1, 0, 0, 0,
        0, 1, 0, 0, 
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]
}

// multiply 4x4 matrix
function multiplyM4(a, b){
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
}

// return translated 4x4 matrix 
function translateM4(matrix, x, y, z){
    const translation = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
    ];

    return multiplyM4(matrix, translation);
}

// return rotated 4x4 matrix on x-axis 
function rotateM4x(matrix, angle){
    let angleInRad = degreeToRadian(angle);

    let c = Math.cos(angleInRad);
    let s = Math.sin(angleInRad);

    const xRotation = [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
    ];

    return multiplyM4(matrix, xRotation);
}

// return rotated 4x4 matrix on y-axis 
function rotateM4y(matrix, angle){
    let angleInRad = degreeToRadian(angle);

    let c = Math.cos(angleInRad);
    let s = Math.sin(angleInRad);

    const yRotation = [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
    ];

    return multiplyM4(matrix, yRotation);
}

// return rotated 4x4 matrix on z-axis 
function rotateM4z(matrix, angle){
    let angleInRad = degreeToRadian(angle);

    let c = Math.cos(angleInRad);
    let s = Math.sin(angleInRad);

    const zRotation = [
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];

    return multiplyM4(matrix, zRotation);
}

// return scaled 4x4 matrix 
function scaleM4(matrix, x, y, z){
    const scaling = [
        x, 0, 0, 0,
        0, y, 0, 0, 
        0, 0, z, 0,
        0, 0, 0, 1,
    ]
    
    return multiplyM4(matrix, scaling);
}

// normalize a vector
function normalize(vector){
    let length = Math.sqrt(Math.pow(vector[0], 2), Math.pow(vector[1], 2), Math.pow(vector[2], 2));
    let result = [0, 0, 0];
    if(length > 0.00001){
        result[0] = vector[0]/length;
        result[1] = vector[1]/length;
        result[2] = vector[2]/length;
    }
    return result;
}

// convert degree to radian
function degreeToRadian(deg){
    return deg * (Math.PI/80) 
}