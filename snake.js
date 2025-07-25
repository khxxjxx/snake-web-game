const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
let snake, direction, food, score, game, gameOver;

function resetGame() {
    snake = [{x: 9 * box, y: 10 * box}];
    direction = null;
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    score = 0;
    gameOver = false;
    if (game) clearInterval(game);
    draw();
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 400, 400);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4caf50" : "#8bc34a";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff5252";
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;
    else if (!direction) return; // 방향이 정해지지 않았으면 움직이지 않음

    // Game over conditions
    if (
        head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(game);
        gameOver = true;
        //alert('Game Over! Your score: ' + score); // alert 제거
        setTimeout(() => {
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = "#fff";
            ctx.font = "36px Arial";
            ctx.fillText("Game Over!", 100, 200);
            ctx.font = "24px Arial";
            ctx.fillText("점수: " + score, 150, 240);
            ctx.font = "18px Arial";
            ctx.fillText("방향키를 누르면 재시작", 100, 280);
        }, 50);
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 390);
}

function startGame(e) {
    if (!direction && ['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)) {
        if (e.key === 'ArrowLeft') direction = 'LEFT';
        else if (e.key === 'ArrowUp') direction = 'UP';
        else if (e.key === 'ArrowRight') direction = 'RIGHT';
        else if (e.key === 'ArrowDown') direction = 'DOWN';
        if (!game) game = setInterval(draw, 100);
    }
}

document.addEventListener('keydown', e => {
    if (['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)) {
        if (gameOver) {
            resetGame();
            startGame(e);
        } else if (direction === null) {
            startGame(e);
        } else {
            if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
            else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
            else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
            else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
        }
    }
});

document.getElementById('restart').onclick = function() {
    resetGame();
};

resetGame(); // 최초 실행