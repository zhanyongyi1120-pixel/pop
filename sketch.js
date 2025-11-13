javascript=
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定背景顏色為 e9c46a
  background('#e9c46a');
 
  // 設定圓形的框線粗細為 5
  strokeWeight(5);
  // 設定圓形的框線顏色為 bc6c25
  stroke('#bc6c25');
  // 設定圓形的填色顏色為 0077b6
  fill('#0077b6');
 
  // 計算畫布的中心點
  let centerX = width / 2;
  let centerY = height / 2;
 
  // 圓的直徑為 200，p5.js 的 ellipse() 函式接受的是半徑或直徑，
  // 這裡使用直徑 200
  let diameter = 200;
 
  // 在畫布中心繪製圓形
  ellipse(centerX, centerY, diameter, diameter);
}


// 當視窗大小改變時重新調整畫布大小，以保持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新繪製背景和圓形，以確保它們在中心
  background('#e9c46a');
 
  strokeWeight(5);
  stroke('#bc6c25');
  fill('#0077b6');
 
  let centerX = width / 2;
  let centerY = height / 2;
  let diameter = 200;
 
  ellipse(centerX, centerY, diameter, diameter);
}
let circles = []; // 用來儲存所有圓形物件的陣列
let colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#0077b6']; // 預設的五種顏色，加入 #0077b6
let particles = []; // 爆破粒子
let popSound; // 破裂音效
let score = 0; // 玩家分數


function setup() {
  // 預先載入音效在 preload() 中會處理
  createCanvas(windowWidth, windowHeight);
  background('#e9c46a'); // 沿用之前的背景顏色

  noStroke(); // 設定無框線 (對圓形和方形都有效)

  // 初始化 30 個圓形
  for (let i = 0; i < 30; i++) {
    circles.push(createCircle());
  }
 
  // 設置矩形繪製模式為 CENTER 一次，這樣在 draw 中就不需要一直切換了
  rectMode(CENTER);
}

function preload() {
  soundFormats('mp3', 'wav');
  // 請將 pop.mp3 放在專案根目錄或與 sketch 同路徑
  popSound = loadSound('pop.mp3');
}


function draw() {
  background('#e9c46a'); // 每幀重新繪製背景，以清除之前的圓形

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    // --- 繪製圓形 ---
    fill(circle.color.r, circle.color.g, circle.color.b, circle.alpha);
    ellipse(circle.x, circle.y, circle.diameter, circle.diameter);

    // --- 繪製方形 ---
    fill(255, 255, 255, 150);
    let squareSize = circle.diameter / 5;
    let radius = circle.diameter / 2;
    let offsetAngle = -PI/4;
    let safeOffsetDistance = radius * 0.4;
    let squareCenterX = circle.x + cos(offsetAngle) * safeOffsetDistance;
    let squareCenterY = circle.y + sin(offsetAngle) * safeOffsetDistance;
    rect(squareCenterX, squareCenterY, squareSize, squareSize);

    // 預設不隨機爆破：直接更新位置
    circle.y -= circle.speed;
    if (circle.y < -circle.diameter / 2) {
      circles[i] = createCircle();
      circles[i].y = height + circles[i].diameter / 2;
    }
  }

  // 更新和繪製粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.color.r, p.color.g, p.color.b, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // 重力
    p.alpha -= 5;
    if (p.alpha <= 0) particles.splice(i, 1);
  }

  // 顯示左上文字與右上分數
  textSize(32);
  noStroke();
  fill('#eb6424');
  textAlign(LEFT, TOP);
  text('412730920詹詠詒', 10, 10);
  textAlign(RIGHT, TOP);
  text(score, width - 10, 10);
}


// 函式：創建一個新的圓形物件 (無變動)
function createCircle() {
  let circle = {};
  circle.x = random(width);
  circle.y = random(height, height * 2);
  circle.diameter = random(50, 200);
 
  let c = colors[floor(random(colors.length))];
  circle.color = hexToRgb(c);


  circle.alpha = random(50, 200);
  circle.speed = random(0.5, 3);


  return circle;
}


// 函式：將十六進位顏色字串轉換為 RGB 物件 (無變動)
function hexToRgb(hex) {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}




// 當視窗大小改變時重新調整畫布大小，並重新初始化圓形 (無變動)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#e9c46a');
 
  circles = [];
  for (let i = 0; i < 30; i++) {
    circles.push(createCircle());
  }
}


// 函式：創建爆破效果 - 產生多個粒子向四周散射
function createExplosion(x, y, color, diameter) {
  let particleCount = floor(random(15, 25)); // 每次爆破產生 15-25 個粒子
  for (let i = 0; i < particleCount; i++) {
    let particle = {};
    particle.x = x;
    particle.y = y;
    particle.size = random(3, 8);
    particle.color = color;
    particle.alpha = 200;
    let angle = random(TWO_PI);
    let speed = random(2, 6);
    particle.vx = cos(angle) * speed;
    particle.vy = sin(angle) * speed;
    particles.push(particle);
  }
}

// 在滑鼠按下時檢查是否點中氣球，若點中則爆破並更新分數
function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d <= c.diameter / 2) {
      // 點中氣球，產生爆破
      createExplosion(c.x, c.y, c.color, c.diameter);
      if (popSound && popSound.isLoaded && popSound.isLoaded()) {
        popSound.play();
      } else if (popSound) {
        try { popSound.play(); } catch (e) {}
      }

      // 檢查是否為 #0077b6 顏色
      let target = hexToRgb('#0077b6');
      if (c.color.r === target.r && c.color.g === target.g && c.color.b === target.b) {
        score += 1;
      } else {
        score -= 1;
      }

      // 重生被點中的氣球
      circles[i] = createCircle();
      circles[i].y = height + circles[i].diameter / 2;
      break; // 只處理第一個被點中的氣球
    }
  }
}
