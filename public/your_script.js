// Load MediaPipe hands model
async function loadMediaPipeHands() {
    const hands = new mp.Hands();
    await hands.setOptions({
      maxNumHands: 1, // Set the maximum number of hands to detect
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return hands;
  }
  
  // Initialize the camera and start hand tracking
  async function initCamera() {
    const video = document.createElement('video');
    document.body.appendChild(video);
  
    // Get user media
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  
  // Detect hands in each frame
  async function detectHands(video, hands) {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
  
    canvas.width = video.width;
    canvas.height = video.height;
  
    hands.onResults((results) => {
      // Handle the detected hands (e.g., draw landmarks)
      handleResults(results, ctx);
    });
  
    const handConfig = { selfieMode: false }; // Set to true if the camera is in front-facing mode
  
    hands.setInput(video, handConfig);
    hands.start();
  
    return video;
  }
  
  // Handle the detected hands (you can customize this function)
  function handleResults(results, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((handLandmarks) => {
        drawHandLandmarks(handLandmarks, ctx);
      });
    }
  }
  
  // Main function to start hand tracking
  async function main() {
    // Load MediaPipe hands model
    const hands = await loadMediaPipeHands();
  
    // Initialize the camera
    const video = await initCamera();
  
    // Detect hands in each frame
    await detectHands(video, hands);
  }
  
  // Run the main function
  main();
  