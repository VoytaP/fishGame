export function drawHandLandmarks(handLandmarks, ctx) {
    // Draw hand landmarks on the canvas
    handLandmarks.forEach((landmark) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
  
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  