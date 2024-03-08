const video = document.getElementsByClassName('input_video')[0];

const fishStep = 0.25;
const mouthStep = 0.06;
var fishPos = { x:0, y:0, z:0 };
var mouthRot = 0;

function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dist;
}

function moveFish(startPoint, endPoint, stepSize) {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const dz = endPoint.z - startPoint.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (distance <= stepSize)
      return endPoint;

  const nextPoint = {
    x: startPoint.x + (dx / distance) * stepSize,
    y: startPoint.y + (dy / distance) * stepSize,
    z: startPoint.z + (dz / distance) * stepSize
  }
  return nextPoint;
}

function moveMouth(startPoint, endPoint, stepSize) {
  if (Math.abs(endPoint - startPoint) <= stepSize)
      return endPoint;
  if (startPoint > endPoint)
    return startPoint - stepSize;
  if (startPoint < endPoint)
    return startPoint + stepSize; 
}

function onResultsHands(results) {
  if (results.multiHandLandmarks) {
    // console.log(results.multiHandLandmarks);

    basePos = results.multiHandLandmarks[0][0];
    iFingerPos = results.multiHandLandmarks[0][8];
    thumbPos = results.multiHandLandmarks[0][4];

    var x3dFish = document.getElementById('fish');
    const targetfishPos = { x:(basePos.x * 10) - 5, y:(basePos.y * -10) + 5, z:(basePos.z * 10) };
    fishPos = moveFish(fishPos, targetfishPos, fishStep);
    x3dFish.setAttribute("translation", `${fishPos.x} ${fishPos.y} ${fishPos.z}`);
    // console.log("base ");
    // console.log(basePos.x);
    // console.log("fish ");
    // console.log(fishPos.x);

    // finger opening
    const fingerDist = distance(iFingerPos, thumbPos)
    // console.log("finger distance: ");
    // console.log(fingerDist);   //max 0.5?
    var targetMouthRot = (fingerDist / -0.5) * 1.5 + 0.5;
    targetMouthRot = Math.max(-1.5, targetMouthRot);
    targetMouthRot = Math.min(0, targetMouthRot);
    // console.log(targetMouthRot); 
    mouthRot = moveMouth(mouthRot, targetMouthRot, mouthStep);
    var x3dMouth = document.getElementById('mouth');
    x3dMouth.setAttribute("rotation", `0 0 1 ${mouthRot}`);
  }
  else {
    // console.log("nic");
  }
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});
hands.onResults(onResultsHands);

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image: video});
  },
  width: 500,
  height: 400
});
camera.start();
