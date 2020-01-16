var face_asset = document.getElementById("face_asset");

var width = window.getComputedStyle(face_asset).width;
var height= window.getComputedStyle(face_asset).height;
let FACE_SIZE = {
    width: parseInt(width.substr(0, width.length-2)),
    height: parseInt(height.substring(0, height.length-2)),
};


class Face{
    constructor(){
        this.max_width = window.innerWidth;
        this.max_height = window.innerHeight;
        this.visible = false;
        this.x_var = 0, this.y_var = 0;
        this.location = {
            top_left_x: 0,
            top_left_y: 0,
            bottom_right_x: 0,
            bottom_right_y: 0,
        };
    }

    printLocationOfFace(){
        window.console.log("FACE: (" + this.x_var + ", " + this.y_var + ")");
    }
    
    calculateLocation(){
        this.x_var = parseInt(Math.random() * (this.max_width-FACE_SIZE.width - 20));
        this.y_var = parseInt(Math.random() * (this.max_height-FACE_SIZE.height - 20));
        this.location.top_left_x = this.x_var;
        this.location.top_left_y = this.y_var;
        this.location.bottom_right_x = this.x_var + FACE_SIZE.width;
        this.location.bottom_right_y = this.y_var + FACE_SIZE.height;
    }

    checkLocationFace(x_loc, y_loc){
        if(x_loc <= this.location.bottom_right_x && x_loc >= this.location.top_left_x
            && y_loc <= this.location.bottom_right_y && y_loc >= this.location.top_left_y){
                window.console.log("found");
            }
    }

    setFaceLocation(){
        face_asset.style.marginLeft = this.x_var + 'px';
        face_asset.style.marginTop = this.y_var + 'px';
    }
}

let face = new Face();
face.calculateLocation();
face.setFaceLocation();
face.printLocationOfFace();


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
        face.checkLocationFace(event.pageX, event.pageY);
        window.console.log("(" + event.pageX + ", " + event.pageY + ")");
    }
})();
