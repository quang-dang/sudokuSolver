
// set up global variable
// r : current row, c: current col, board: 9x9 matrix contains sudoku board
var timerEvent;
var r = 0;
var c = 0;
const board = new Array(9);
const rows = new Array(9);
const cols = new Array(9);
const squares = new Array(9);
var speed = 1;
var stillTrying = true;

for (var i = 0; i < 9; i++){
    board[i] = new Array(9).fill(0);
}

for (var i = 0; i < 9; i++){
    rows[i] = new Map();
    cols[i] = new Map();
    squares[i] = new Map();
}
for (var i= 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
        let s = 3*Math.floor(i/3) + Math.floor(j/3)
        if (board[i][j] != 0){
            rows[i].set(board[i][j], [i,j]);
            cols[j].set(board[i][j], [i,j]);
            squares[s].set(board[i][j], [i,j]);
        }
    }
}
const stack = [];
const errorStack = []

// get the next empty cell
function AppendNextRandCToStack(r,c){
    for (let i = r; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (board[i][j]==0){
                stack.push([i,j]);
                return true;
            }
        }
    }
    return false;
}

// function to solve sudoku board
function Solve(){
    RemoveErrorClass();
    if (stack.length == 0){
        window.clearInterval(timerEvent);
        document.getElementById("clearButton").removeAttribute("disabled");
        document.getElementById("submitButton").removeAttribute("disabled");
        return;
    }

    let temp = stack.pop();
    r = temp[0];
    c = temp[1];
    if (!stillTrying){
        RemoveFromMemo(r,c);
    }
    if (board[r][c] < 9){
        board[r][c]++;
        stack.push([r,c]);
        stillTrying = true;
        if (IsValid(r,c)){
            if (!AppendNextRandCToStack(r,c)){
                stack.length = 0;
                window.clearInterval(timerEvent);
                document.getElementById("clearButton").removeAttribute("disabled");
                document.getElementById("submitButton").removeAttribute("disabled");
            }
        }
    }
    else {
        stillTrying = false;
        board[r][c] = 0;
    }
    DisplayCell(r,c);
    return;
}

// Display Cell Value
function DisplayCell(r,c){
    let classNames = "row-" + r +" col-"+c;
    let el = document.getElementsByClassName(classNames)[0];
    if (board[r][c] == 0){
        el.value = "";
    }
    else{
        el.value = board[r][c];
    }
    return;
}

// Check if input is valid
function IsValid(r,c){
    let valid = true;
    if (rows[r].has(board[r][c])){
        errorStack.push(rows[r].get(board[r][c]));
        valid = false;
    }
    if (cols[c].has(board[r][c])){
        errorStack.push(cols[c].get(board[r][c]));
        valid = false;
    }
    let s = 3*Math.floor(r/3) + Math.floor(c/3);
    if (squares[s].has(board[r][c])){
        errorStack.push(squares[s].get(board[r][c]));
        valid = false;
    }
    if (!valid){
        errorStack.push([r,c]);
        AddErrorClass();
        return false;
    }
    rows[r].set(board[r][c], [r,c]);
    cols[c].set(board[r][c], [r,c]);
    squares[s].set(board[r][c], [r,c]);
    return valid;
}

// Remove failed value
function RemoveFromMemo(r,c){
    if (board[r][c] == 0){
        return;
    }
    let s = 3*Math.floor(r/3) + Math.floor(c/3);
    rows[r].delete(board[r][c]);
    cols[c].delete(board[r][c]);
    squares[s].delete(board[r][c]);

}

// main function
function main(){
    document.getElementById("clearButton").setAttribute("disabled","");
    document.getElementById("submitButton").setAttribute("disabled","");
    DisplayBoard();
    if (!AppendNextRandCToStack(0,0)){
        document.getElementById("clearButton").removeAttribute("disabled");
        document.getElementById("submitButton").removeAttribute("disabled");
        return false;
    }
    timerEvent = window.setInterval(Solve, speed);
    return true;
}

// display board
function DisplayBoard(){
    for(var i = 0; i < 9; i++){
        for(var j = 0; j<9; j++){
            let classNames = "row-"+i+" col-"+j;
            let el = document.getElementsByClassName(classNames)[0];
            if (board[i][j]!=0){
                el.value = board[i][j];
            }
        }
    }
}

// make failed cell red
function AddErrorClass(){
    for (let i = 0; i < errorStack.length; i++){
        let tr = errorStack[i][0];
        let tc = errorStack[i][1];
        let cl = "row-"+tr+" col-"+tc;
        let el = document.getElementsByClassName(cl)[0];
        el.classList.add("bg-red");
    }
    return;
}

// remove red background from failed cell
function RemoveErrorClass(){
    for (let i = 0; i < errorStack.length; i++){
        let tr = errorStack[i][0];
        let tc = errorStack[i][1];
        let cl = "row-"+tr+" col-"+tc;
        let el = document.getElementsByClassName(cl)[0];
        el.classList.remove("bg-red");
    }
    errorStack.length = 0;
    return;
}

// set up board
function SetUpBoard(){
    RemoveErrorClass();
    ClearGlobal();
    document.getElementById("errorMessage").innerHTML = "";
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            let cl = "row-"+i+" col-"+j;
            let el = document.getElementsByClassName(cl)[0];
            let v = el.value;
            if (v >= 1 && v <= 9){
                v = parseInt(v,10);
                board[i][j] = v;
                IsValid(i,j);
            }
            else if(v == ""){
                board[i][j] = 0;
            }
            else{
                errorStack.push([i,j]);
            }
        }
    }
    if (errorStack.length > 0){
        AddErrorClass();
        document.getElementById("errorMessage").innerHTML = "Please fix values in red cells.";
    }
    else{
        main();
    }
    return;
}

// reset global variables
function ClearGlobal(){
    for (var i = 0; i < 9; i++){
        board[i] = new Array(9).fill(0);
        rows[i] = new Map();
        cols[i] = new Map();
        squares[i] = new Map();
    }
    errorStack.length = 0;
    stack.length = 0;
}

// clear board
function ClearBoard(){
    ClearGlobal();
    document.getElementById("errorMessage").innerHTML = "";
    for(var i = 0; i < 9; i++){
        for(var j = 0; j<9; j++){
            let classNames = "row-"+i+" col-"+j;
            let el = document.getElementsByClassName(classNames)[0];
            el.value = "";
            el.removeAttribute("disabled");
            el.classList.remove("bg-red");
        }
    }
}