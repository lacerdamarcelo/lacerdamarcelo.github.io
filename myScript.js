var accel = 0.1;

var whiteSquare = {
	posX : 575,
	posY : 20,
	velX : 0,
	velY : 0
};

function myMove() {
	var elem = document.getElementById("animate");
	var id = setInterval(frame, 5);
	function frame() {
		if (whiteSquare.posY > 450) {
			//clearInterval(id);
			whiteSquare.velY *= -0.7;
			whiteSquare.posY = 450;
		} else {
			whiteSquare.velY += accel;
			whiteSquare.posX += whiteSquare.velX;
			whiteSquare.posY += whiteSquare.velY;
			elem.style.top = whiteSquare.posY + 'px'; 
			elem.style.left = whiteSquare.posX + 'px'; 
		}
	}
}
