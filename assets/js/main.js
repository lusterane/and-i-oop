const FACE_SIZE = 250; //px


class Face{
    constructor(){
        this.max_width = window.innerWidth;
        this.max_height = window.innerHeight;
        this.visible = false;
        this.face_asset = document.getElementById("face_asset");
    }

    sayHi(){
        alert(this.x_var);
    }

    setFaceLocation(){
        var x_var = Math.random() * (this.max_width-FACE_SIZE - 20);
        var y_var = Math.random() * (this.max_height-FACE_SIZE - 20);
        this.face_asset.style.marginLeft = x_var + 'px';
        this.face_asset.style.marginTop = y_var + 'px';
    }
}

let face = new Face();
face.setFaceLocation();
