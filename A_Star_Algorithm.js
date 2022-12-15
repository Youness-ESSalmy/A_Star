var startPoint = {
	x : 0,
	y : 0,
	cell : null
}
var goalPoint = {
	x : 0,
	y : 0,
	cell : null
}

var mazeMatrix;

function createMaze(){
	startPoint.cell = null;
	goalPoint.cell = null;
	if(typeof(maze) !== "undefined"){
		maze.parentNode.removeChild(maze);
	}
	var cellWidth = document.getElementById("cellWidth");
	var table = document.createElement("table");
	table.setAttribute("id","maze");
	document.body.appendChild(table);
	var x = parseInt((window.innerHeight - 100) / parseInt(cellWidth.value));
	var y = parseInt(window.innerWidth / parseInt(cellWidth.value));
	for(var i = 0;i<x;i++){
		var row = table.insertRow(i);
		for(var j = 0;j<y;j++){
			var cell = row.insertCell(j);
			cell.style.width = cellWidth.value + "px";
			cell.style.height = cellWidth.value + "px";
			cell.setAttribute("onclick","cellClick(this)");
			cell.setAttribute("onmouseover","hoverClick(this)");
		}
	}
	mazeMatrix = new Array(x).fill(null).map(() => new Array(y).fill(true));
}
var obstacleColor = "black" , startColor = "purple", goalColor = "green", nodeColor = "white";
var cellType = document.getElementById("cellType");
var hovClick = false; var BlankClick = false;
function cellClick(cell){
	BlankClick = !(cell.style.backgroundColor == obstacleColor);
	if(cellType.value=="start"){
		if(startPoint.cell !== null){
			startPoint.cell.style.backgroundColor=nodeColor;
		}
		cell.style.backgroundColor = startColor;
		startPoint.cell = cell;
	}else if(cellType.value=="goal"){
		if(goalPoint.cell !== null){
			goalPoint.cell.style.backgroundColor=nodeColor;
		}
		cell.style.backgroundColor = goalColor;
		goalPoint.cell = cell;
	}else if(!hovClick){
		cell.style.backgroundColor = (cell.style.backgroundColor == obstacleColor) ? nodeColor : obstacleColor;
		switch(cell){
			case startPoint.cell:
				startPoint.cell = null
				break;
			case goalPoint.cell:
				goalPoint.cell = null;
				break;
		}
	}
		hovClick = !hovClick;
}
function hoverClick(cell){
	if(hovClick && cellType.value=="obstacle"){
		cell.style.backgroundColor = BlankClick ? obstacleColor : nodeColor;
		if(cell == startPoint.cell){
			startPoint.cell = null;
		}
		if(cell == goalPoint.cell){
			goalPoint.cell = null;
		}
	}
}

////////////////////////////////////////////////////

var counter = 0, closed = new Array(), solution = new Array();
var counter = 0;
function A_star(){
	solution = [];

var rows = document.querySelectorAll("#maze tr");
	for(var i = 0;i<rows.length;i++){
		var cells = rows[i].querySelectorAll("td");
		for(var j =0;j<cells.length;j++){
			switch(cells[j].style.backgroundColor){
				case nodeColor:
					mazeMatrix[i][j] = true;
					break;
				case obstacleColor:
					mazeMatrix[i][j] = false;
					break;
				case startColor:
					startPoint.x = i;
					startPoint.y = j;
					mazeMatrix[i][j] = true;
					break;
				case goalColor:
					goalPoint.x = i;
					goalPoint.y = j;
					mazeMatrix[i][j] = true;
					break;
			}
		}
	}

	function distance(sx,sy,gx,gy){
		return Math.sqrt(Math.pow(sx-gx,2) + Math.pow(sy-gy,2))*10;
	}

	var open = new Array(), closed = new Array();
	open.push({
		x:startPoint.x, 
		y:startPoint.y, 
		f_cost:0,
		h_cost:0,
		g_cost:0,
		Px:startPoint.x,
		Py:startPoint.y
	});
	open[0].g_cost = distance(open[0].x,open[0].y,startPoint.x,startPoint.y);
	open[0].h_cost = distance(open[0].x,open[0].y,goalPoint.x,goalPoint.y);
	open[0].f_cost = open[0].h_cost + open[0].g_cost;

	var current = new Object;
	do {
		if(open.length == 0){
			console.log("no solution found");
			console.log(open);
			return ;
		}
		current = open[0];
		var index = 0;
		for(var i = 0;i<open.length;i++){
			if(open[i].f_cost <= current.f_cost){
				if(open[i].f_cost < current.f_cost || open[i].h_cost < current.h_cost ){
					current = open[i];
					index = i;
				}
			}
		}
		closed.push(current);
		/*var closNum = document.createTextNode(counter + ", ");
		document.querySelectorAll("#maze tr")[current.x].querySelectorAll("td")[current.y].appendChild(closNum);*/
		if(index == open.length - 1){
			open.pop();
		}else{
			open[index] = open.pop();
		}
		document.querySelectorAll("#maze tr")[current.x].querySelectorAll("td")[current.y].style.backgroundColor = "red";

		for(var i = -1;i<2;i++){
			var x = current.x + i;
			for(var j=-1;j<2;j++){
				var y = current.y + j;
				if(!(i == 0 && j == 0) && (x >= 0 && y >= 0 && x < mazeMatrix.length && y < mazeMatrix[0].length) && mazeMatrix[x][y]){
					var existsInOpen = false;
					for(var ii = 0;ii<open.length;ii++){
						if(open[ii].x == x && open[ii].y == y){
							existsInOpen = true;
							break;
						}
					}
					if(existsInOpen){
						continue;
					}
					var existsInClosed = false;
					for(var ii = 0;ii<closed.length;ii++){
						if(closed[ii].x == x && closed[ii].y == y){
							existsInClosed = true;
							break;
						}
					}
					if(existsInClosed){
						continue;
					}
					var node = {
						x:x, 
						y:y, 
						f_cost:distance(x,y,startPoint.x,startPoint.y) + distance(x,y,goalPoint.x,goalPoint.y),
						g_cost:distance(x,y,startPoint.x,startPoint.y),
						h_cost:distance(x,y,goalPoint.x,goalPoint.y),
						Px:current.x, 
						Py:current.y
					}
					open.push(node);
					document.querySelectorAll("#maze tr")[x].querySelectorAll("td")[y].style.backgroundColor = "yellow";
				}	
			}
		}
	}while(!(current.x == goalPoint.x && current.y == goalPoint.y));

	function solutionFx(x){
		if(x == 0){
			return ;
		}
		solution.push(closed[x]);
		for(var i = 0 ;i<closed.length;i++){
			if(closed[i].x == closed[x].Px && closed[i].y == closed[x].Py){
				if(x == closed.length - 1){
					closed.pop();
				}else{
					closed[x] = closed.pop();
				}
				solutionFx(i);
				break;
			}
		}
	}
	solutionFx(closed.length -1);
	for(var i = 0;i<solution.length;i++){
		document.querySelectorAll("#maze tr")[solution[i].x].querySelectorAll("td")[solution[i].y].style.backgroundColor = "blue";
	}
}
