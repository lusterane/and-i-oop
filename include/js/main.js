var CONFIG = {
    faceWidth: "100",
    debugMode: true,
}
if(!CONFIG.debugMode){
    document.getElementById("debug_box").style.display="none";
}


var face_asset = document.getElementById("face_asset");
face_asset.width = CONFIG.faceWidth;

// compute size of "face"
var width = window.getComputedStyle(face_asset).width;
var height= window.getComputedStyle(face_asset).height;
let FACE_SIZE = {
    width: parseInt(width.substring(0, width.length-2)),
    height: parseInt(height.substring(0, height.length-2))
};



class Screen {
    constructor() {
        this.window_width = window.innerWidth;
        this.window_height = window.innerHeight;
        this.diagonal_length = 0;
        this.calculateDiagonalLength();
    }

    calculateDiagonalLength(){
        this.diagonal_length = Math.sqrt(Math.pow(this.window_width, 2), Math.pow(this.window_height, 2));
    }
}

let screen = new Screen();

class Face{
    constructor(){
        // mid point of face
        this.mid_point = {
            x_loc: 0,
            y_loc: 0,
        }
        // corner coordinates of face
        this.location = {
            top_left_x: 0,
            top_left_y: 0,
            bottom_right_x: 0,
            bottom_right_y: 0,
        };
        this.rgb_value = {
            r:0,
            g:0,
            b:255,
        }
        this.gradient = {
            gradient_degree: 0,
            toggle_gradient: false,
        }

        this.visible = CONFIG.debugMode;
    }

    // set face on screen
    displayFace(){
        if(!this.visible){
            face_asset.style.opacity = 0;
        }
        this.location.top_left_x = parseInt(Math.random() * (screen.window_width-FACE_SIZE.width - 20));
        this.location.top_left_y = parseInt(Math.random() * (screen.window_height-FACE_SIZE.height - 20));
        this.location.bottom_right_x = this.location.top_left_x + FACE_SIZE.width;
        this.location.bottom_right_y = this.location.top_left_y + FACE_SIZE.height;
        this.mid_point.x_loc = this.location.top_left_x + FACE_SIZE.width/2 + 10;
        this.mid_point.y_loc = this.location.top_left_y + FACE_SIZE.height/2 + 10;

        // set face at location
        face_asset.style.marginLeft = this.location.top_left_x + 'px';
        face_asset.style.marginTop = this.location.top_left_y  + 'px';
    }

    // checks if face is found
    checkFaceFound(x_coor, y_coor){
        if(x_coor <= this.location.bottom_right_x && x_coor >= this.location.top_left_x
            && y_coor <= this.location.bottom_right_y && y_coor >= this.location.top_left_y){
                document.getElementById("found").innerHTML="FOUND: T";

            }
            else{
                document.getElementById("found").innerHTML="FOUND: F";
            }
    }
    
    setBackgroundColor(x_coor, y_coor){
        var dist_to_face = Math.sqrt(Math.pow(this.mid_point.x_loc - x_coor, 2) + Math.pow(this.mid_point.y_loc - y_coor, 2));
        var scaled_dist_to_face = dist_to_face/screen.diagonal_length;

        // scale value of blue
        this.rgb_value.b = scaled_dist_to_face * 255;
        this.rgb_value.r = Math.abs(255-this.rgb_value.b);


        // set background color
        var rgb_str = "rgb(" + this.rgb_value.r + "," + this.rgb_value.g + "," + this.rgb_value.b + ")";
        var pair_rgb_str = "";

        if(this.rgb_value.r>this.rgb_value.b){
            // warm
            pair_rgb_str = "rgb(" + this.rgb_value.r + "," + this.rgb_value.r + "," + 0 + ")";
        }
        else{
            // cold
            pair_rgb_str = "rgb(" + this.rgb_value.r + "," + this.rgb_value.b + "," + this.rgb_value.b + ")";
        }

        this.setGradientDegree();

        document.body.style.backgroundImage = "linear-gradient(" + this.gradient.gradient_degree + "deg," + pair_rgb_str + ", " + rgb_str + ")";
        document.getElementById("debug_color").style.backgroundColor = rgb_str;
        document.getElementById("rgb").innerHTML = "RGB: (" + this.rgb_value.r + ", " + this.rgb_value.g + ", " + this.rgb_value.b + ")";
    }
    setGradientDegree(){
        if(this.gradient.gradient_degree == 360 || this.gradient.gradient_degree == -360){
            this.gradient.gradient_degree = 0;
            this.toggle_gradient = !this.toggle_gradient;
        }
        if(this.toggle_gradient){
            this.gradient.gradient_degree += .5;
        }
        else{
            this.gradient.gradient_degree -= .5;
        }
    }
    // display info in debug
    dump(){
        document.getElementById("face_size").innerHTML="w: " + FACE_SIZE.width + ", l: " + FACE_SIZE.height;
        document.getElementById("face_loc").innerHTML="FACE_MDPT: (" + this.mid_point.x_loc + ", " + this.mid_point.y_loc + ")";
    }
}

let face = new Face();
face.checkFaceFound();
face.displayFace();
face.dump();


(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Use event.pageX / event.pageY here
        face.checkFaceFound(event.pageX, event.pageY);
        document.getElementById("mouse_loc").innerHTML="MOUSE: (" + event.pageX + ", " + event.pageY + ")";
        face.setBackgroundColor(event.pageX, event.pageY);
    }
})();


