/*Final Project for CS50 course on EDX by Andrii Nebylovych. 
*/
var canvas, canvasContext;

var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;
var ballColor = 'white';

var showingWinScreen = false;
var showingLoseScreen = false;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
const BRICK_GAP = 2;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

const SPEED_X_RESET = 5;

var normalPaddleWidth = 100;
var paddleWidth = 100;
var maxPaddleWidth = 1.5 * normalPaddleWidth;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

var mouseX = 0;
var mouseY = 0;

var score = 0;
const BRICK_SCORE = 11;
const BONUS_SCORE = 43;

//TODO

const SHOW_BONUS_PROBABILITY = 0.9;
var ballBonusX = 0;
var ballBonusY = 0;
var showBallBonus = false;
var showNewBonus = true;
var bonusType = 'white';
var bonusColor = 'white';

var bonusGreenActive = false;
var timesGreenBallTouchedPaddle = 0;
var countingTimesGreenBallTouchedPaddle = false;
const TIMES_GREEN_ACTIVE = 2;

var lives = 1;

var showBow = false;
var bullets = 10;
const BULLET_ADDED = 15;

var showBullet = true;
var bulletSpeed = 10;
var bulletArray = [];

var heartPic = document.createElement("img");
var heartPicLoaded = false;
var paddlePic = document.createElement("img");
var paddlePicLoaded = false;
var crossbowPic = document.createElement("img");
var crossbowPicLoaded = false;
var brickPic = document.createElement("img");
var brickPicLoaded = false;
var increasePaddlePic = document.createElement("img");
var increasePaddlePicLoaded = false;
var bombPic = document.createElement("img");
var bombPicLoaded = false;
var decreasePaddlePic = document.createElement("img");
var decreasePaddlePicLoaded = false;


function updateMousePos(evt) {

	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - paddleWidth/2;

	// mouse cheat / hack to test ball in any position
	/*ballX = mouseX;
	ballY = mouseY;
	ballSpeedX = 4;
	ballSpeedY = -4;*/
}

function handleMouseClick(evt){
	console.log('buttom pressed');
	if(showingWinScreen || showingLoseScreen){
		console.log('buttom was pressed!');
		showingWinScreen = false;
		showingLoseScreen = false;
		ballReset();
		brickReset();
		bonusReset();
		livesReset();
		scoreReset();
		orangeBonusReset();
		greenBonusReset();
	}
	else{
		if(showBow){
			bulletLaunch();
		}
	}
}

	
function rowColToArrayIndex(col, row){
	return col + BRICK_COLS * row;
}

function brickReset() {
	bricksLeft = 0;
	var i = 0;
	for(i= 0;i< 3 * BRICK_COLS;i++){
		brickGrid[i] = false;
	}
	for(;i<BRICK_COLS*BRICK_ROWS; i++) {
		brickGrid[i] = true;
		bricksLeft++;
	} // end of for loop
} // end of brickReset func

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', updateMousePos);

	heartPic.onload = function() {
		heartPicLoaded = true;
	}
	heartPic.src = "assets/heart10.png";

	paddlePic.onload = function() {
		paddlePicLoaded = true;
	}
	paddlePic.src = "assets/paddle.png";

	crossbowPic.onload = function() {
		crossbowPicLoaded = true;
	}
	crossbowPic.src = "assets/crossbow.png";

	brickPic.onload = function() {
		crossbowPicLoaded = true;
	}
	brickPic.src = "assets/brick.png";

	increasePaddlePic.onload = function() {
		increasePaddlePicLoaded = true;
	}
	increasePaddlePic.src = "assets/increasePaddle.png";

	bombPic.onload = function() {
		bombPicPicLoaded = true;
	}
	bombPic.src = "assets/bomb.png";

	decreasePaddlePic.onload = function() {
		decreasePaddlePicLoaded = true;
	}
	decreasePaddlePic.src = "assets/decreasePaddle.png";



	brickReset();
	ballReset();

	canvas.addEventListener('mousedown', handleMouseClick);
}

function updateAll() {
	moveAll();
	drawAll();
}

function showBonus(){
	if(showNewBonus == true && showBallBonus == false && Math.random() < SHOW_BONUS_PROBABILITY){
				var typeOfNewBonus = Math.random()
				// green
				if(typeOfNewBonus < 0.2) {
					bonusType = 'green';
					bonusColor = 'green';
				}
				// yellow
				else if(typeOfNewBonus >= 0.2 && typeOfNewBonus < 0.4) {
					bonusType = 'yellow';
					bonusColor = 'yellow';
				}

				else if(typeOfNewBonus >= 0.4 && typeOfNewBonus < 0.6){
					bonusType = 'red';
					bonusColor = 'red';
				}

				else if(typeOfNewBonus >= 0.6 && typeOfNewBonus < 0.8){
					bonusType = 'orange';
					bonusColor = 'orange';
				}

				else if(typeOfNewBonus >= 0.8){
					bonusType = 'purple';
				}

				ballBonusX = canvas.width * Math.random();
				ballBonusY = BRICK_H*BRICK_ROWS;
				showBallBonus= true;			
			} // is it already on the screen
}

function ballMove() {
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX < 0 && ballSpeedX < 0.0) {
		ballSpeedX *= -1;
	}

	if(ballX > canvas.width && ballSpeedX > 0.0) {
		ballSpeedX *= -1;
	}

	if(ballY < 0 && ballSpeedY < 0.0) { //top
		ballSpeedY *= -1;
	}

	if(ballY > canvas.height) { // bottom
		if(lives == 0){
			ballReset();
			brickReset();
			bonusReset();
			livesReset();
			orangeBonusReset();
			greenBonusReset();
			showingLoseScreen = true;
		}
		else{
			lives = lives - 1;
			ballReset();
			bonusReset();
			orangeBonusReset();
			greenBonusReset();		}
	}	
}

function isBrickAtColRow(col, row) {
		if(col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS){

			var brickIndexUnderCoord = rowColToArrayIndex(col, row);

			return brickGrid[brickIndexUnderCoord];
		} else {
			return false;
		}
}

function ballBrickHandling() {
	var ballBrickCol = Math.floor(ballX / BRICK_W);
	var ballBrickRow = Math.floor(ballY / BRICK_H);
	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)
	

	if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

		if(isBrickAtColRow(ballBrickCol, ballBrickRow)) { 
			// show bonus ball
			showBonus();

			if(bonusGreenActive == false) {
				brickGrid[brickIndexUnderBall] = false;
				bricksLeft--;
				score += BRICK_SCORE;

				var prevBallX = ballX - ballSpeedX;
				var prevBallY = ballY - ballSpeedY;

				var prevBallBrickCol = Math.floor(prevBallX / BRICK_W);
				var prevBallBrickRow = Math.floor(prevBallY / BRICK_H);


				var bothTestsFailed = true;
				// side hit
				if(prevBallBrickCol != ballBrickCol) {
					if(isBrickAtColRow(ballBrickCol, ballBrickRow) == false) {
						ballSpeedX *= -1;
						bothTestsFailed = false;
					}
				}

				// top or buttom
				if(prevBallBrickRow != ballBrickRow) {
					if(isBrickAtColRow(ballBrickCol, ballBrickRow) == false) {
						ballSpeedY *= -1;
						bothTestsFailed = false;
					}
				}

				if(bothTestsFailed){ // armpit case, prevents ball from going through;
					ballSpeedX *= -1;
					ballSpeedY *= -1;
				}
			} // end of brick found

			// bonus is active
			else { 
				brickGrid[brickIndexUnderBall] = false;	
				bricksLeft--;
				score += BRICK_SCORE;
			}
		} // if brickundercol
	}  // end of valid col and row
}	// end of ballBrickHandling func

function ballPaddleHandling() {
	var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY+PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX+paddleWidth;

	if(ballY > paddleTopEdgeY && ballY // below the top of paddle
		< paddleBottomEdgeY && ballX // above bottom of paddle
		> paddleLeftEdgeX && ballX // right of the left side of paddle
		< paddleRightEdgeX) { // left of the right of paddle

		ballSpeedY *= -1;

		// how many times green bonus ball touched a paddle
		if(countingTimesGreenBallTouchedPaddle){
			timesGreenBallTouchedPaddle--;			
			if(timesGreenBallTouchedPaddle < 1){
				greenBonusReset();
			}
		}

		var centerOfPaddleX = paddleX + paddleWidth/2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
		ballSpeedX = ballDistFromPaddleCenterX * 0.35;
	} // ball center inside paddle
} // end of ballPaddleHandling

function bulletBrickHandling(){
	if(bulletArray.length > 0){
		for(var i = 0; i < bulletArray.length; i++){
			if(bulletArray[i].bulletActive){
				var bulletBrickCol = Math.floor(bulletArray[i].bulletX / BRICK_W);
				var bulletBrickRow = Math.floor(bulletArray[i].bulletY / BRICK_H);
				var brickIndexUnderBullet = rowColToArrayIndex(bulletBrickCol, bulletBrickRow);
				

				if(bulletBrickCol >= 0 && bulletBrickCol < BRICK_COLS && bulletBrickRow >= 0 && bulletBrickRow < BRICK_ROWS){
					if(isBrickAtColRow(bulletBrickCol, bulletBrickRow)) {
						showBonus();
						brickGrid[brickIndexUnderBullet] = false;
						bricksLeft--;
						score += BRICK_SCORE;
						bulletArray[i].showBullet = false;
						bulletArray[i].bulletActive = false;
					} // checks is the brick is true / exists
				} // checks is it where the bricks are
			} // checks if the bullet is active;
		} // loops over all bullets;
	} // checks if there are bullets in the array;
}

function bulletLaunch(){
	if(bullets > 0){
		// creates a bullet in an array
		bulletArray.push({bulletX: paddleX + paddleWidth/2, bulletY: canvas.height - PADDLE_DIST_FROM_EDGE, showBullet: 'true', bulletActive: 'true'});
		bullets--;
	}
	else{
		showBow = false;
	}
}

function ballBonusMove() {
	var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY+PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX+paddleWidth;

	// speed;
	ballBonusY += 5;

	// does it toches a paddle
	if(ballBonusY > paddleTopEdgeY && ballBonusY // below the top of paddle
		< paddleBottomEdgeY && ballBonusX // above bottom of paddle
		> paddleLeftEdgeX && ballBonusX // right of the left side of paddle
		< paddleRightEdgeX) { // left of the right of paddle
			showBallBonus = false;
			if(bonusType == 'green'){
				bonusGreenActive = true;
				countingTimesGreenBallTouchedPaddle = true;
				timesGreenBallTouchedPaddle += TIMES_GREEN_ACTIVE;
				ballColor = 'green';
				increaseScoreByBonus()
			}
			if(bonusType == 'yellow'){
				increasePaddleWidth();
				increaseScoreByBonus();
			}
			if(bonusType == 'red'){
				decreasePaddleWidth();
				increaseScoreByBonus();
			}
			if(bonusType == 'purple'){
				lives++;
				increaseScoreByBonus();
			}
			if(bonusType == 'orange'){
				showBow = true;
				increaseBulletNumber();
				increaseScoreByBonus();
			}

	} // ball center inside paddle

	if(ballBonusY > canvas.height){
		showBallBonus = false;
		showNewBonus = true;
	}
}

function bulletMove(){
	if(bulletArray.length > 0){
		for(var i = 0; i < bulletArray.length; i++){
			bulletArray[i].bulletY -= bulletSpeed;
		} // loopes through bullets;
	} // check if there are bullets in an array
}

function increasePaddleWidth(){
	if(paddleWidth <= maxPaddleWidth){
		paddleWidth *= 1.5;
	}
}

function decreasePaddleWidth(){
	paddleWidth = 75;
}

function increaseBulletNumber(){
	bullets += BULLET_ADDED;
}

function increaseScoreByBonus(){
	score += BONUS_SCORE;
}

function moveAll(){
	if(showingWinScreen || showingLoseScreen){
		return;
	}

	if(bricksLeft == 0) {
			showingWinScreen = true;
		} // out of bricks

	ballMove();

	ballBrickHandling();

	bulletBrickHandling();

	ballPaddleHandling();

	ballBonusMove();

	bulletMove();
}

function scoreReset(){
	score = 0;
}

function ballReset(){
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = SPEED_X_RESET;
}

function livesReset(){
	lives = 2;
}

function bonusReset(){
	ballColor = 'white';
	paddleWidth = normalPaddleWidth;
}

function orangeBonusReset(){
	showBow = false;
	bullets = 0;
	bulletArray.length = 0;
}

function greenBonusReset(){
	ballColor = 'white';
	bonusGreenActive = false;
	timesGreenBallTouchedPaddle = 0;
	countingTimesGreenBallTouchedPaddle = false;
}

function drawBricks() {

	for(var eachRow=0; eachRow<BRICK_ROWS;eachRow++){
		for(var eachCol=0; eachCol<BRICK_COLS;eachCol++){

			var arrayIndex = BRICK_COLS * eachRow + eachCol;

			if(brickGrid[arrayIndex]) {
				canvasContext.drawImage(brickPic, BRICK_W*eachCol,BRICK_H*eachRow, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP);
				/*colorRect(BRICK_W*eachCol,BRICK_H*eachRow, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, 'red');*/
			} // end of if brickGrid

		} // end of loop for rows

	} // end of for loop for grid
} // end of drawBrick function

function drawBullets() {
	if(bulletArray.length > 0){
		for(var i = 0; i < bulletArray.length; i++){
			if(bulletArray[i].showBullet){
				colorCircle(bulletArray[i].bulletX,bulletArray[i].bulletY, 3, 'orange');
			} // if bullet is true;
		} // loops over bullets;
	} // checks if there are bullets in the array;
}


function drawAll() {
	colorRect(0,0, canvas.width, canvas.height,'black'); // clear screen

	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("You won!",350, 430);
		canvasContext.fillText("Your score: " + score,350, 440);
		canvasContext.fillText("Press left mouse buttom to play again!",350, 450);
		return;
	}

	if(showingLoseScreen) {
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("Well, you need some practice!",350, 430);
		canvasContext.fillText("Try one more time",350, 440);
		canvasContext.fillText("Press left mouse buttom to play again!",350, 450);
		return;
	}

	colorCircle(ballX,ballY, 10, ballColor); // draw ball

	canvasContext.drawImage(paddlePic, paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, paddleWidth, 15); // draw paddle
	/*colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, paddleWidth, PADDLE_THICKNESS,'white'); // draw paddle*/

	// draw bow
	var bowY = canvas.height - PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS;
	if(showBow){
		/*colorRect(paddleX + paddleWidth/2 - 5, bowY + PADDLE_THICKNESS, 10, 40,'white');*/
		canvasContext.drawImage(crossbowPic, paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, paddleWidth, crossbowPic.height);
	}

	drawBricks(); // draw bricks
	drawBullets(); // draw bullets

	// status indicator
	// lives
	canvasContext.drawImage(heartPic, 50 - heartPic.width/2, 27 - heartPic.height/2);
	canvasContext.fillStyle = 'red';
	canvasContext.fillText(lives, 66, 30);

	// adding score
	canvasContext.fillStyle = 'white';
	canvasContext.fillText('score: ' + score, canvas.width - 70, 35);

	// draw bonus ball
	if(showBallBonus){
		if(bonusType == 'purple'){
			canvasContext.drawImage(heartPic, ballBonusX - heartPic.width/2, ballBonusY - heartPic.height/2);

		}
		if(bonusType == 'yellow'){
			canvasContext.drawImage(increasePaddlePic, ballBonusX - 40/2, ballBonusY - 20/2, 40, 20);

		}
		if(bonusType == 'orange'){
			canvasContext.drawImage(crossbowPic, ballBonusX - 40/2, ballBonusY - 20/2, 40, 20);

		}

		if(bonusType == 'green'){
			canvasContext.drawImage(bombPic, ballBonusX - 40/2, ballBonusY - 40/2, 40, 40);

		}

		else if(bonusType == 'red'){
			canvasContext.drawImage(decreasePaddlePic, ballBonusX - 40/2, ballBonusY - 20/2, 40, 20);
		}
	}
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX,textY);
}
