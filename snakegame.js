//Made by Makayla Haggerty
$(document).ready(function(){
	//define vars
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;
	var cw = 15;
	var d = "right";
	var food;
	var score;
	var color = "red";
	var speed = 130;
//snake array
	var snake_array;
	
//inititlizer
	function init(){
		d = "right";
		createSnake();
		createFood();
		score = 0;
		if(typeof game_loop != "undefined") {
			clearInterval(game_loop);
		}
		game_loop = setInterval(paint, speed);
	}
	init();
//Create Snake 
	function createSnake(){
		var length = 5;
		snake_array = [];
		for(var i = length - 1; i >= 0; i--){
			snake_array.push({x: i, y: 0});
		}
	}
	function createFood(){
		food = {
			x: Math.round(Math.random() * (w-cw) /cw),
			y: Math.round(Math.random() * (h-cw) /cw)
		};
	}
	
	function paint(){
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, w, h);
	
		//movement
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		
		if(d == 'right') nx++;
		else if (d == 'left') nx--;
		else if(d == 'up') ny--;
		else if(d == 'down') ny++;
		//collide code
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)){
			//init();
			$('#final_score').html(score);
			$('#overlay').fadeIn(300);
			return;
		}
		if(nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			createFood();
		}else{
			var tail = snake_array.pop();
			tail.x = nx;
			tail.y = ny;
		}
		snake_array.unshift(tail);
		
		console.log("Length: " + snake_array.length);
		
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		paint_cell(food.x, food.y);
		//score
		checkscore(score);
		$('#score').html('Your Score: ' + score);
	}
	function checkscore(score){
		if(localStorage.getItem('highscore') === null){
			localStorage.setItem('highscore',score);
		}else{
			if(score > localStorage.getItem('highscore')){
				localStorage.setItem('highscore',score);
			}
		}
		$('#highscore').html('High Score: ' + localStorage.highscore);
	}
	function paint_cell(x, y){
		ctx.fillStyle = color;
		ctx.fillRect(x * cw, y * cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x * cw, y * cw, cw, cw);
	}
	function check_collision(x, y, array){
		console.log("Collision check.");
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}
	//controler
	$(document).keydown(function(e){
		var key = e.which;
		if(key == 37 && d != "right") d = "left";
		else if(key == 38 && d != "down") d = "up";
		else if(key == 39 && d != "left") d = "right";
		else if(key == 40 && d != "up") d = "down";
	});
});
function resetScore(){
	localStorage.highscore = 0;
	var highscorediv = document.getElementById('highscore');
	highscorediv.innerHTML = 'High score: 0';
}