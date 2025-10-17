// CONFIG
const CANVAS_W=480, CANVAS_H=640;
const BALL_R=20, BALL_SPEED=6;
const COLORS=7;
const pick=n=>Math.floor(Math.random()*n);

// CANVAS
const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
canvas.width=CANVAS_W; canvas.height=CANVAS_H;
const currCtx=document.getElementById("curr").getContext("2d");
const nextCtx=document.getElementById("next").getContext("2d");

// SPRITE
const bubbleImg=new Image();
bubbleImg.src="bubble-sprites.png";

// STATE
let current={color:pick(COLORS)};
let next={color:pick(COLORS)};
let active=[];
const shooter={x:CANVAS_W/2,y:CANVAS_H-30,angle:-Math.PI/2};

// INPUT
function aim(mx,my){shooter.angle=Math.atan2(my-shooter.y,mx-shooter.x);}
canvas.addEventListener("mousemove",e=>{const r=canvas.getBoundingClientRect();aim(e.clientX-r.left,e.clientY-r.top);});
canvas.addEventListener("click",e=>{const r=canvas.getBoundingClientRect();aim(e.clientX-r.left,e.clientY-r.top);fireBoth();});
canvas.addEventListener("touchstart",e=>{const r=canvas.getBoundingClientRect(),t=e.touches[0];aim(t.clientX-r.left,t.clientY-r.top);fireBoth();},{passive:true});

// FIRE
function fireBoth(){
  const vx=Math.cos(shooter.angle)*BALL_SPEED;
  const vy=Math.sin(shooter.angle)*BALL_SPEED;
  active.push({x:shooter.x,y:shooter.y,dx:vx,dy:vy,color:current.color,alive:true});
  active.push({x:shooter.x,y:shooter.y,dx:vx,dy:vy,color:next.color,alive:true});
  current={color:pick(COLORS)}; next={color:pick(COLORS)}; drawPreview();
}

// UPDATE
function update(){
  for(const b of active){
    if(!b.alive) continue;
    b.x+=b.dx; b.y+=b.dy;
    if(b.x<BALL_R){b.x=BALL_R;b.dx*=-1;}
    if(b.x>CANVAS_W-BALL_R){b.x=CANVAS_W-BALL_R;b.dx*=-1;}
    if(b.y<BALL_R){b.alive=false;}
  }
  active=active.filter(b=>b.alive);
}

// RENDER
function drawBall(g,x,y,i,r=BALL_R){
  const sx=i*40, sy=0;
  g.drawImage(bubbleImg,sx,sy,40,40,x-r,y-r,r*2,r*2);
}
function drawPreview(){
  currCtx.clearRect(0,0,36,36);
  nextCtx.clearRect(0,0,36,36);
  drawBall(currCtx,18,18,current.color,10);
  drawBall(nextCtx,18,18,next.color,10);
}
function render(){
  ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
  ctx.strokeStyle="#1b2a40"; ctx.beginPath(); ctx.moveTo(0,BALL_R); ctx.lineTo(CANVAS_W,BALL_R); ctx.stroke();
  ctx.strokeStyle="#8aa"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(shooter.x,shooter.y);
  ctx.lineTo(shooter.x+Math.cos(shooter.angle)*30, shooter.y+Math.sin(shooter.angle)*30); ctx.stroke();
  for(const b of active) drawBall(ctx,b.x,b.y,b.color);
  ctx.fillStyle="#0b1522"; ctx.fillRect(0,CANVAS_H-18,CANVAS_W,18);
}

// LOOP
drawPreview();
(function loop(){update();render();requestAnimationFrame(loop);})();