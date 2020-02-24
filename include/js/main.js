/* CHECK MOBILE */
window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

$(document).ready(function() {
    if(!window.mobilecheck){
        $('#mobile-warning').css('display', 'block');
    }
});

/* SITE CODE */

var CONFIG = {
	faceWidth: "100",
	debugMode: false,
};
if (!CONFIG.debugMode) {
	document.getElementById("debug_box").style.display = "none";
}

var face_asset = document.getElementById("face_asset");
face_asset.width = CONFIG.faceWidth;

// compute size of "face"
var width = window.getComputedStyle(face_asset).width;
var height = window.getComputedStyle(face_asset).height;
let FACE_SIZE = {
	width: parseInt(width.substring(0, width.length - 2)),
	height: parseInt(height.substring(0, height.length - 2))
};

class Screen {
	constructor() {
		this.window_width = window.innerWidth;
		this.window_height = window.innerHeight;
		this.max_distance = 0;
		this.screen_midpoint = {
			x_loc: 0,
			y_loc: 0
        };
        this.hoveringFace = false;
		this.init();
	}
	init() {
		this.calculateMidpoint();
	}

	// only for midpoint of screen
	calculateMidpoint() {
		this.screen_midpoint.x_loc = this.window_width / 2 - FACE_SIZE.width + 30;
		this.screen_midpoint.y_loc = this.window_height / 2 - FACE_SIZE.height + 20;
	}
}

let screen = new Screen();

class Face {
	constructor() {
		// mid point of face
		this.mid_point = {
			x_loc: 0,
			y_loc: 0
		};
		// corner coordinates of face
		this.location = {
			top_left_x: 0,
			top_left_y: 0,
			bottom_right_x: 0,
			bottom_right_y: 0
		};
		this.rgb_value = {
			r: 0,
			g: 0,
			b: 255
		};

		this.max_distance = -1;
		this.face_clicked = false;
		this.init();
	}
	init() {
		this.setVisible(CONFIG.debugMode, "face_asset");
		this.setVisible(CONFIG.debugMode, "win_message");
		this.displayFace();
		this.calculateMaxDistance();
		this.dump();
	}
	setVisible(isVisible, element) {
		if (isVisible) {
			$("#" + element).css("opacity", 1);
		} else {
			$("#" + element).css("opacity", 0);
		}
	}

	// calculates max distance from face possible
	calculateMaxDistance() {
		var corner_arrs = [
			{
				// left_top_corner
				x: 0,
				y: 0
			},
			{
				// left_bottom_corner
				x: 0,
				y: screen.window_height
			},
			{
				// right_top_corner
				x: screen.window_width,
				y: 0
			},
			{
				// right_bottom_corner
				x: screen.window_width,
				y: screen.window_height
			}
		];
		for (let i = 0; i < corner_arrs.length; i++) {
			this.max_distance = Math.max(
				calculateDistance(
					corner_arrs[i].x,
					corner_arrs[i].y,
					this.mid_point.x_loc,
					this.mid_point.y_loc
				),
				this.max_distance
			);
		}
	}

	// set face on screen
	displayFace() {
		this.location.top_left_x = parseInt(
			Math.random() * (screen.window_width - FACE_SIZE.width - 20)
		);
		this.location.top_left_y = parseInt(
			Math.random() * (screen.window_height - FACE_SIZE.height - 20)
		);
		this.location.bottom_right_x = this.location.top_left_x + FACE_SIZE.width;
        this.location.bottom_right_y = this.location.top_left_y + FACE_SIZE.height;
		this.mid_point.x_loc = this.location.top_left_x + FACE_SIZE.width / 2 + 10;
		this.mid_point.y_loc = this.location.top_left_y + FACE_SIZE.height / 2 + 10;

		// set face at location
		face_asset.style.marginLeft = this.location.top_left_x + "px";
		face_asset.style.marginTop = this.location.top_left_y + "px";
	}

	// checks if hovering over face	
    checkFaceHovering(x_coor, y_coor){
        if(x_coor <= this.location.bottom_right_x && x_coor >= this.location.top_left_x
            && y_coor <= this.location.bottom_right_y && y_coor >= this.location.top_left_y){
                document.getElementById("found").innerHTML="FOUND: T";
                this.hoveringFace = true;
            }
            else{
                document.getElementById("found").innerHTML="FOUND: F";
                this.hoveringFace = false;
            }
    }

	updateBackgroundColor(x_coor, y_coor) {
		var dist_to_face = calculateDistance(
			this.mid_point.x_loc,
			this.mid_point.y_loc,
			x_coor,
			y_coor
		);
		var scaled_dist_to_face = dist_to_face / this.max_distance;
		// scale value of blue
		this.rgb_value.b = scaled_dist_to_face * 255;
		this.rgb_value.r = Math.abs(255 - this.rgb_value.b);

		// set background color
		var rgb_str =
			"rgb(" + this.rgb_value.r + "," + this.rgb_value.g + "," + this.rgb_value.b + ")";
		var pair_rgb_str = "";

		if (this.rgb_value.r > this.rgb_value.b) {
			// warm
			pair_rgb_str = "rgb(" + this.rgb_value.r + "," + this.rgb_value.r + "," + 0 + ")";
		} else {
			// cold
			pair_rgb_str =
				"rgb(" + this.rgb_value.r + "," + this.rgb_value.b + "," + this.rgb_value.b + ")";
		}

		document.getElementById("background").style.backgroundImage =
			"linear-gradient(45deg," + rgb_str + "," + pair_rgb_str + ")";
		document.getElementById("debug_color").style.backgroundColor = rgb_str;
		document.getElementById("rgb").innerHTML =
            "RGB: (" + this.rgb_value.r + ", " + this.rgb_value.g + ", " + this.rgb_value.b + ")";
        document.getElementById("info_ok_btn").style.backgroundImage =
        "linear-gradient(45deg," + rgb_str + "," + pair_rgb_str + ")";
	}

	// display info in debug
	dump() {
		document.getElementById("face_size").innerHTML =
			"w: " + FACE_SIZE.width + ", l: " + FACE_SIZE.height;
		document.getElementById("face_mdpt").innerHTML =
            "FACE_MDPT: (" + this.mid_point.x_loc + ", " + this.mid_point.y_loc + ")";
        document.getElementById("face_loc").innerHTML = "FACE_LOC(tl.x, tl.y, br.x, br.y): (" + this.location.top_left_x + ", " + this.location.top_left_y + ", " + this.location.bottom_right_x + ", " + this.location.bottom_right_y + ")";
	}

    // win condition
	foundFace() {
		if (!this.face_clicked) {
			this.face_clicked = true;
			this.setVisible(true, "face_asset");
			this.moveFace(1000);
		}
	}

	moveFace(duration) {
		$("#face_asset").animate(
			{
				marginLeft: screen.screen_midpoint.x_loc - 100,
				marginTop: screen.screen_midpoint.y_loc - 100,
				width: "+=200"
			},
			duration
		);
	}

	// emoji
	// lit 🥵
	// hot 🔥
	// cold ❄️
	changeEmoji(type, level) {
		let emoji = "";
		for (let i = 0; i < level; i++) {
			if (type == "lit") {
				emoji += "🥵";
			} else if (type == "hot") {
				emoji += "🔥";
			} else if (type == "cold") {
				emoji += "❄️";
			}
		}

		$("#emoji-text").text(emoji);
	}

	updateEmojiIndicator(x_coor, y_coor) {
		var dist_to_face = calculateDistance(
			this.mid_point.x_loc,
			this.mid_point.y_loc,
			x_coor,
			y_coor
		);
		var scaled_distance = (dist_to_face / this.max_distance) * 100;
        if (this.hoveringFace) {
			this.changeEmoji("lit", 3);
		}
		else if (scaled_distance > 94) {
			this.changeEmoji("cold", 3);
		} else if (scaled_distance > 80) {
			this.changeEmoji("cold", 2);
		} else if (scaled_distance > 64) {
			this.changeEmoji("cold", 1);
		} else if (scaled_distance > 48) {
			this.changeEmoji("hot", 1);
		} else if (scaled_distance > 20) {
			this.changeEmoji("hot", 2);
		} else if (scaled_distance > 2) {
			this.changeEmoji("hot", 3);
		}
	}
}

let face = new Face();

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

			event.pageX =
				event.clientX +
				((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
				((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
			event.pageY =
				event.clientY +
				((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
				((doc && doc.clientTop) || (body && body.clientTop) || 0);
		}

		// Use event.pageX / event.pageY here
		document.getElementById("mouse_loc").innerHTML =
			"MOUSE: (" + event.pageX + ", " + event.pageY + ")";
        face.updateBackgroundColor(event.pageX, event.pageY);
        face.checkFaceHovering(event.pageX, event.pageY);
        face.updateEmojiIndicator(event.pageX, event.pageY);
	}
})();

function calculateDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
