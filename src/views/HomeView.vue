<template>
  
  <canvas id="Person"></canvas>
  <button class="btn btn1" >hturjn;n;n;</button>
  <button class="btn btn2">htu</button>
  <button class="btn btn3">h</button>
</template>


<script>
export default {
  data() {
    return {
      x: 50,
      y: window.innerHeight - window.innerHeight/4,
      width: window.innerHeight/4,
      height: window.innerHeight/4,
      speed: 10,
      windowX: 0,
      windowY: 0,
      isJump: false,
      jumpCount: 10,
      // jumpStartTime: 0,
      left: false,
      right: false,
      // initialY:0,
      checker: false,
      animCount: 0,
      ctx: null,
      // buttonBottomY: 0,
      shouldStop: false,
      stopX: 0, 
      JumpBtn: 0,
      lastFrameTime: Date.now(),
      images: {
        walkL: [new Image(), new Image()],
        walkR: [new Image(), new Image()],
        stand: new Image(),
        background: new Image()
      }
    };
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initGame();
      this.updateCanvasSize();
      window.addEventListener('resize', () => {
         clearTimeout(this.resizeTimer);
         this.resizeTimer = setTimeout(this.updateCanvasSize, 100);
      });
      

    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('click',this.handleMouse);
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  },
  methods: {
    initGame() {
      var canvas = document.getElementById('Person');
      this.ctx = canvas.getContext('2d');
      this.images.walkL[0].src = require('@/assets/4.png');
      this.images.walkL[1].src = require('@/assets/5.png');
      this.images.walkR[0].src = require('@/assets/1.png');
      this.images.walkR[1].src = require('@/assets/2.png');
      this.images.stand.src = require('@/assets/0.png');
      this.images.background.src = require('@/assets/Пирамиды.jpg');

      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('click',this.handleMouse)
      requestAnimationFrame(this.gameLoop);
    },
    
    
    updateCharacterPosition() {
      this.width = window.innerHeight/4
      this.height = window.innerHeight/4
      this.y = window.innerHeight - window.innerHeight / 4;
      if (this.x > this.windowX - this.width) {
        this.x = this.windowX - this.width;
    }},

    updateCanvasSize() {
      //let newWindowX = document.documentElement.clientWidth;
      this.windowX =  window.innerWidth;
      //console.log(this.windowX);
      
      this.windowY = window.innerHeight;
      var canvas = document.getElementById("Person");
      canvas.width = this.windowX;
      canvas.height = this.windowY;
      // console.log(this.y)
      // console.log(this.windowY)
      this.updateCharacterPosition();
    },
    // updateCanvasSize() {
    //   //this.windowX = screen.availHeight > 0 ? screen.availHeight : window.innerHeight;
    //   this.windowX = window.innerWidth;
    //   console.log(this.windowX)
    //   this.windowY = window.innerHeight;
    //   var canvas = document.getElementById("Person");
    //   canvas.width = this.windowX;
    //   canvas.height = this.windowY;
    //   this.updateCharacterPosition();
      
    // },
    gameLoop() {
      var now = Date.now();
      var delta = now - this.lastFrameTime;

      if (delta > 16) { 
        this.update();
        this.draw();
        this.lastFrameTime = now;
      }

      requestAnimationFrame(this.gameLoop);
    },
    update() {
      
      if (this.shouldStop) {
        if ((this.left && this.x <= this.stopX) || (this.right && this.x >= this.stopX || this.stopX > this.windowX)) {
          this.left = false;
          this.right = false;
          this.shouldStop = false;
          if (this.checker){
            // console.log("то что надо")
            this.isJump = true;
            this.checker = false;
            // this.jumpStartTime = Date.now();
          }
        }
      }
      if (this.left && this.x > 0) {
        this.x -= this.speed;
      } 
      else if (this.right && this.x < (this.windowX - this.width)) {
        this.x += this.speed;
      }
      if (this.isJump) {
        if(this.JumpBtn == 0){
          if (this.jumpCount >= -10) {
            let thrust = 0.5 * this.jumpCount * this.jumpCount;
            
            if (this.jumpCount < 0) {
              this.y += thrust;
            } else {
              this.y -= thrust;
            }
            this.jumpCount -= 1;
          } else {
            this.isJump = false;
            this.jumpCount = 10;
          }
        } 
        else{
          var JumpSpeedUp = Math.abs(this.JumpBtn) / 0.8 + 4;
          var JumpSpeedDown = Math.abs(this.JumpBtn) / 0.8 - 4;
          let currentTimeUp = 0;
          let currentTimeDown = 0;

          var tempUp = 0;
          var tempDown = 0;

          let isJumpingUp = true;

          const interval = setInterval(() => {
            if (isJumpingUp && currentTimeUp <= 0.8) {
              this.y -= JumpSpeedUp * currentTimeUp - 10 * Math.pow(currentTimeUp, 2) / 2 - tempUp;
              tempUp = JumpSpeedUp * currentTimeUp - 10 * Math.pow(currentTimeUp, 2) / 2;
              currentTimeUp += 0.1;
            } else if (!isJumpingUp && currentTimeDown <= 0.8) {
              this.y += JumpSpeedDown * currentTimeDown + 10 * Math.pow(currentTimeDown, 2) / 2 - tempDown;
              tempDown = JumpSpeedDown * currentTimeDown + 10 * Math.pow(currentTimeDown, 2) / 2;
              currentTimeDown += 0.1;
            } else {
              if (isJumpingUp) {
                isJumpingUp = false;
                currentTimeDown = 0;
                tempDown = 0;
              } else {
                clearInterval(interval);
              }
            }
          }, 20);
          this.isJump = false;
          this.JumpBtn = 0;
        }
      }
    },

    draw() {
    this.ctx.clearRect(0, 0, this.windowX, this.windowY);
    this.ctx.drawImage(this.images.background, 0, 0, this.windowX, this.windowY);

    if (this.left || this.right) {
      let walkImg = this.left ? this.images.walkL[Math.floor(this.animCount / 5) % 2]
      : this.images.walkR[Math.floor(this.animCount / 5) % 2];
      this.ctx.drawImage(walkImg, this.x, this.y, this.width, this.height);
      this.animCount++;
      }
      else {
        this.ctx.drawImage(this.images.stand, this.x, this.y, this.width, this.height);
      }
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        this.left = true;
        this.right = false;
      } 
      else if (event.key === 'ArrowRight') {
        this.right = true;
        this.left = false;
      } 
      else if (event.key === 'ArrowUp' && !this.isJump) {
        this.isJump = true;
        this.jumpCount = 10;  
      }
    },

    handleKeyUp(event) {
      if (event.key === 'ArrowLeft') {
      this.left = false;
    }
    else if (event.key === 'ArrowRight') {
      this.right = false;
      }
    },
    handleMouse(event) {
      var btn = event.target.closest('.btn');
      if (btn) {
        console.log("ну почти");
        this.checker = true;
        var rect = btn.getBoundingClientRect();
        var buttonBottomY = rect.bottom;
        this.JumpBtn =  buttonBottomY - this.y;
        // this.initialY = this.y; 
       
      }
      var canvas = document.getElementById('Person');
      var rect = canvas.getBoundingClientRect();
      var mouseX = event.clientX - rect.left;
      if (mouseX  < (this.windowX - this.width/2) && mouseX - (this.width/2) > 0){
        this.stopX = mouseX - this.width/2;
      }
      else if (mouseX >= (this.windowX - this.width/2)){
        this.stopX = this.windowX - this.width;
      }
      else{
        this.stopX = mouseX;
      }
      this.shouldStop = true;

      if (this.x > mouseX) {
        this.left = true;
        this.right = false;
      } else if (this.x < mouseX) {
        this.right = true;
        this.left = false;
      }
    },

  }
};
</script>

<style>
 canvas{
  /* position: absolute; */
  position: fixed;
  left: 0;
  
 }
 /* ::-webkit-scrollbar {
    width: 0;
  } */
 button{
  position: absolute;
  height: 20px;
  /* z-index: 3; */
  
 }
 .btn1{
  margin-top: 5vw;
 }
 .btn2{
  margin-top: 10vw;
  margin-right: 30vw;
 }
 .btn3{
  margin-top: 15vw;
  margin-left: 30vw;
 }
</style>