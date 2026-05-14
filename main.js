import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs";

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const loadingOverlay = document.getElementById("loading-overlay");
const statusBadge = document.getElementById("status-badge");
const statusIndicatorText = document.getElementById("status-indicator-text");
const retakeBtn = document.getElementById("retake-btn");
const langToggle = document.getElementById("lang-toggle");
const bottomSheet = document.getElementById("bottom-sheet");

const i18n = {
    en: {
        heightPlaceholder: "175",
        heightLabel: "Height:",
        heightUnit: "cm",
        preparing: "Preparing...",
        stepBack: "Step back into the frame.",
        standBack: "Stand back so your whole body is visible,<br/>and extend your arms straight to the sides.",
        standBackSide: "Make sure your whole body is visible from the side.",
        perfectHold: (timeLeft) => `Perfect.<br/>Hold still... ${timeLeft}`,
        turnSide: "Turn 90°, look straight, and let arms hang slightly away from your body.",
        scanComplete: "Scan Complete",
        scanning: "SCANNING",
        ready: "READY",
        captured: "CAPTURED",
        shoulder: "Shoulder",
        chest: "Chest",
        waist: "Waist",
        inseam: "Inseam",
        armLength: "Arm Length",
        saveMeasurements: "Save Measurements",
        retakeScan: "Retake Scan",
        loading: "Loading Model...",
        errorLoading: "Error loading model",
        enterHeight: "Please enter your height above to begin."
    },
    he: {
        heightPlaceholder: "175",
        heightLabel: 'גובה:',
        heightUnit: 'ס"מ',
        preparing: "מתכונן...",
        stepBack: "אנא חזור אחורה למסגרת.",
        standBack: "עמוד לאחור כך שכל גופך יכנס למסגרת,<br/>ופרוס את זרועותיך לצדדים.",
        standBackSide: "וודא שכל גופך גלוי מהצד.",
        perfectHold: (timeLeft) => `מושלם.<br/>הישאר ללא תזוזה... ${timeLeft}`,
        turnSide: "הסתובב/י 90 מעלות, מבט קדימה, וידיים רפויות מעט רחוקות מהגוף.",
        scanComplete: "הסריקה הושלמה",
        scanning: "סורק",
        ready: "מוכן",
        captured: "נקלט",
        shoulder: "כתפיים",
        chest: "חזה",
        waist: "מותניים",
        inseam: "אורך רגל",
        armLength: "אורך זרוע",
        saveMeasurements: "שמור מידות",
        retakeScan: "סרוק מחדש",
        loading: "טוען מודל...",
        errorLoading: "שגיאה בטעינת המודל",
        enterHeight: "אנא הזן את הגובה שלך כדי להתחיל."
    }
};

let currentLang = "he";

const setLanguage = (lang) => {
    currentLang = lang;
    const t = i18n[lang];
    document.body.dir = lang === "he" ? "rtl" : "ltr";

    document.getElementById("user-height").placeholder = t.heightPlaceholder;
    document.getElementById("lbl-height").textContent = t.heightLabel;
    document.getElementById("lbl-cm").textContent = t.heightUnit;
    document.querySelectorAll(".lbl-res-cm").forEach(el => el.textContent = t.heightUnit);
    document.getElementById("lbl-shoulder").textContent = t.shoulder;
    document.getElementById("lbl-chest").textContent = t.chest;
    document.getElementById("lbl-waist").textContent = t.waist;
    document.getElementById("lbl-inseam").textContent = t.inseam;
    document.getElementById("lbl-arm").textContent = t.armLength;
    document.getElementById("btn-save-text").textContent = t.saveMeasurements;
    document.getElementById("btn-retake-text").textContent = t.retakeScan;
    document.getElementById("loading-text").textContent = t.loading;

    if (!webcamRunning && !hasCaptured && instructionHeader.textContent !== t.errorLoading) {
        instructionHeader.textContent = t.preparing;
    }

    langToggle.textContent = lang === "he" ? "🇺🇸 EN" : "🇮🇱 עב";
};

langToggle.addEventListener("click", () => {
    setLanguage(currentLang === "en" ? "he" : "en");
});
const viewfinderWrapper = document.getElementById("viewfinder-wrapper");
const flashOverlay = document.getElementById("flash-overlay");
const instructionHeader = document.getElementById("instruction-header");

const heightInput = document.getElementById("user-height");
const resShoulders = document.getElementById("res-shoulders");
const resChest = document.getElementById("res-chest");
const resWaist = document.getElementById("res-waist");
const resInseam = document.getElementById("res-inseam");
const resArm = document.getElementById("res-arm");

let poseLandmarker = null;
let webcamRunning = false;
let isReadyToScan = false;
let lastVideoTime = -1;
let countdownStartTime = null;
const COUNTDOWN_DURATION_MS = 3000;
let hasCaptured = false;

let scanPhase = 'FRONT';
let frontWidthChest = 0;
let frontWidthWaist = 0;
let frontShoulderPixels = 0;
let frontInseamPixels = 0;
let frontArmPixels = 0;
let ratio = 1;

const COLOR_SKELETON = "#39FF14";

// Create Pose Landmarker
const initializeMediaPipe = async () => {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "./public/pose_landmarker_full.task",
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
            outputSegmentationMasks: false,
        });
        loadingOverlay.classList.add("fade-out");
        enableCamera();
    } catch (error) {
        console.error("Error initializing MediaPipe:", error);
        instructionHeader.textContent = i18n[currentLang].errorLoading;
    }
};

const enableCamera = async () => {
    if (!poseLandmarker) return;

    try {
        const constraints = {
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
        webcamRunning = true;
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
};

const checkReadyToScan = (landmarks) => {
    if (scanPhase === 'SIDE') {
        const isLeftSideVisible = (landmarks[11] && landmarks[11].visibility > 0.6) && 
                                  (landmarks[23] && landmarks[23].visibility > 0.6) && 
                                  (landmarks[27] && landmarks[27].visibility > 0.6);
        const isRightSideVisible = (landmarks[12] && landmarks[12].visibility > 0.6) && 
                                   (landmarks[24] && landmarks[24].visibility > 0.6) && 
                                   (landmarks[28] && landmarks[28].visibility > 0.6);
        return isLeftSideVisible || isRightSideVisible;
    }

    // 11: left shoulder, 12: right shoulder
    // 13: left elbow, 14: right elbow
    // 15: left wrist, 16: right wrist
    // 27: left ankle, 28: right ankle

    const requiredIndices = [11, 12, 13, 14, 15, 16, 23, 24, 27, 28];
    for (let i of requiredIndices) {
        if (!landmarks[i] || landmarks[i].visibility < 0.6) {
            return false;
        }
    }

    // Check T-Pose
    const lS = landmarks[11], rS = landmarks[12];
    const lW = landmarks[15], rW = landmarks[16];

    const yTolerance = 0.15;
    const tPoseLeft = Math.abs(lW.y - lS.y) < yTolerance;
    const tPoseRight = Math.abs(rW.y - rS.y) < yTolerance;

    const xDistanceLeft = Math.abs(lW.x - lS.x);
    const xDistanceRight = Math.abs(rW.x - rS.x);
    const armsExtended = xDistanceLeft > 0.15 && xDistanceRight > 0.15;

    return tPoseLeft && tPoseRight && armsExtended;
};

const calculateDistance = (p1, p2, width, height) => {
    const dx = (p1.x - p2.x) * width;
    const dy = (p1.y - p2.y) * height;
    return Math.sqrt(dx * dx + dy * dy);
};

const captureFrontMeasurements = (landmarks) => {
    const actualHeightCm = parseFloat(heightInput.value) || 175;
    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;

    const nose = landmarks[0];
    const leftEye = landmarks[2];
    const rightEye = landmarks[5];
    const eyeNoseDist = calculateDistance(nose, { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 }, vWidth, vHeight);
    const topOfHeadY = ((leftEye.y + rightEye.y) / 2) * vHeight - (eyeNoseDist * 3);
    const lowestAnkleY = Math.max(landmarks[27].y, landmarks[28].y) * vHeight;

    const detectedHeightPixels = lowestAnkleY - topOfHeadY;
    if (detectedHeightPixels > 0) {
        ratio = actualHeightCm / detectedHeightPixels;
    }

    frontShoulderPixels = calculateDistance(landmarks[11], landmarks[12], vWidth, vHeight);

    const lChest = { x: landmarks[11].x, y: landmarks[11].y + 0.05 };
    const rChest = { x: landmarks[12].x, y: landmarks[12].y + 0.05 };
    frontWidthChest = calculateDistance(lChest, rChest, vWidth, vHeight);

    frontWidthWaist = calculateDistance(landmarks[23], landmarks[24], vWidth, vHeight);

    const crotch = {
        x: (landmarks[23].x + landmarks[24].x) / 2,
        y: (landmarks[23].y + landmarks[24].y) / 2
    };
    const avgAnkle = {
        x: (landmarks[27].x + landmarks[28].x) / 2,
        y: (landmarks[27].y + landmarks[28].y) / 2
    };
    frontInseamPixels = calculateDistance(crotch, avgAnkle, vWidth, vHeight);

    const leftArmPixels = calculateDistance(landmarks[11], landmarks[15], vWidth, vHeight);
    const rightArmPixels = calculateDistance(landmarks[12], landmarks[16], vWidth, vHeight);
    frontArmPixels = (leftArmPixels + rightArmPixels) / 2;
};

const calculateFinalMeasurements = (sideLandmarks) => {
    const vWidth = video.videoWidth;

    // Depth from side scan
    const torsoIndices = [11, 12, 23, 24]; // shoulders and hips
    let minX = Math.min(...torsoIndices.map(i => sideLandmarks[i].x));
    let maxX = Math.max(...torsoIndices.map(i => sideLandmarks[i].x));

    // Add a multiplier because landmarks are inside the body
    let depthChestPixels = (maxX - minX) * vWidth * 2.0;
    let depthWaistPixels = depthChestPixels * 0.9;

    // Fallback if they are perfectly aligned
    if (depthChestPixels < frontWidthChest * 0.3) {
        depthChestPixels = frontWidthChest * 0.6;
        depthWaistPixels = frontWidthWaist * 0.6;
    }

    // Circumference = PI * sqrt(2 * ((Width/2)^2 + (Depth/2)^2))
    const calculateEllipse = (width, depth) => {
        return Math.PI * Math.sqrt(2 * (Math.pow(width / 2, 2) + Math.pow(depth / 2, 2)));
    };

    const chestCircumferencePixels = calculateEllipse(frontWidthChest, depthChestPixels);
    const waistCircumferencePixels = calculateEllipse(frontWidthWaist, depthWaistPixels);

    resShoulders.textContent = (frontShoulderPixels * ratio).toFixed(1);
    resChest.textContent = (chestCircumferencePixels * ratio).toFixed(1);
    resWaist.textContent = (waistCircumferencePixels * ratio).toFixed(1);
    resInseam.textContent = (frontInseamPixels * ratio).toFixed(1);
    resArm.textContent = (frontArmPixels * ratio).toFixed(1);
};

const predictWebcam = async () => {
    if (canvasElement.width !== video.videoWidth) {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
    }

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            const heightVal = parseFloat(heightInput.value);
            const isHeightValid = !isNaN(heightVal) && heightVal > 0;

            if (hasCaptured) {
                canvasCtx.restore();
                return;
            }

            if (!isHeightValid) {
                instructionHeader.textContent = i18n[currentLang].enterHeight;
                statusBadge.style.opacity = "0";
                canvasCtx.restore();
                return;
            }

            if (!result.landmarks || result.landmarks.length === 0) {
                statusBadge.classList.remove("badge-gold");
                viewfinderWrapper.classList.remove("aura-glow", "border-scan-white-pulse", "border-scan-green");
                viewfinderWrapper.classList.add("border-scan-red");
                instructionHeader.textContent = i18n[currentLang].stepBack;
                statusBadge.style.opacity = "1";
                statusIndicatorText.textContent = i18n[currentLang].scanning;
                countdownStartTime = null;
            } else {
                const landmarks = result.landmarks[0];
                isReadyToScan = checkReadyToScan(landmarks);

                if (isReadyToScan) {
                    if (countdownStartTime === null) {
                        countdownStartTime = performance.now();
                    }

                    const timeElapsed = performance.now() - countdownStartTime;
                    const timeLeft = Math.ceil((COUNTDOWN_DURATION_MS - timeElapsed) / 1000);

                    if (timeLeft > 0) {
                        instructionHeader.innerHTML = i18n[currentLang].perfectHold(timeLeft);
                        statusBadge.classList.add("badge-gold");
                        viewfinderWrapper.classList.remove("aura-glow", "border-scan-red", "border-scan-green");
                        viewfinderWrapper.classList.add("border-scan-white-pulse");
                        statusIndicatorText.textContent = i18n[currentLang].ready;
                    } else {
                        if (scanPhase === 'FRONT') {
                            captureFrontMeasurements(landmarks);
                            scanPhase = 'SIDE';
                            countdownStartTime = null;
                            isReadyToScan = false;

                            instructionHeader.textContent = i18n[currentLang].turnSide;
                            statusBadge.classList.remove("badge-gold");
                            viewfinderWrapper.classList.remove("aura-glow", "border-scan-red", "border-scan-white-pulse", "border-scan-green");
                            statusIndicatorText.textContent = i18n[currentLang].scanning;

                            flashOverlay.classList.add("flash-active");
                            setTimeout(() => flashOverlay.classList.remove("flash-active"), 150);

                            canvasCtx.restore();
                            return;
                        }

                        instructionHeader.textContent = i18n[currentLang].scanComplete;
                        statusBadge.classList.remove("badge-gold");
                        viewfinderWrapper.classList.remove("aura-glow", "border-scan-red", "border-scan-white-pulse");
                        viewfinderWrapper.classList.add("border-scan-green");
                        statusIndicatorText.textContent = i18n[currentLang].captured;

                        // Flash animation and background darken
                        flashOverlay.classList.add("flash-active");
                        setTimeout(() => flashOverlay.classList.remove("flash-active"), 150);
                        document.body.classList.add("bg-darken");

                        calculateFinalMeasurements(landmarks);
                        hasCaptured = true;
                        video.pause();
                        webcamRunning = false;

                        setTimeout(() => {
                            viewfinderWrapper.style.display = "none";
                            if (video.srcObject) {
                                video.srcObject.getTracks().forEach(track => track.stop());
                            }

                            // Show bottom sheet
                            bottomSheet.classList.remove("translate-y-[150%]", "translate-y-[200%]");
                            bottomSheet.classList.add("translate-y-0");

                            document.body.classList.add("scroll-enabled");
                        }, 1000);

                        // Solid skeleton line for captured state
                        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                        // Draw the video as an anonymous, futuristic shadow
                        canvasCtx.save();
                        // Apply heavy filters: blur destroys facial features, grayscale & contrast create a solid shape
                        canvasCtx.filter = 'blur(12px) grayscale(100%) contrast(300%) brightness(50%)';
                        // Make it semi-transparent so it blends with the CSS digital grid behind it
                        canvasCtx.globalAlpha = 0.35;
                        canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                        canvasCtx.restore(); // Resets filters and alpha back to normal

                        const drawingUtils = new DrawingUtils(canvasCtx);
                        drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                            color: COLOR_SKELETON,
                            lineWidth: 2
                        });
                        drawingUtils.drawLandmarks(landmarks, {
                            radius: 3,
                            color: COLOR_SKELETON,
                            lineWidth: 0
                        });

                        const tempCanvas = document.createElement("canvas");
                        tempCanvas.width = video.videoWidth;
                        tempCanvas.height = video.videoHeight;
                        const tempCtx = tempCanvas.getContext("2d");
                        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

                        const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.9);

                        fetch('/save-frame', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ image: dataUrl })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    console.log('Frame saved to server:', data.filename);
                                } else {
                                    console.error('Error saving frame:', data.message);
                                }
                            })
                            .catch(err => console.error('Fetch error:', err));

                        canvasCtx.restore();
                        return; // exit the loop
                    }
                } else {
                    countdownStartTime = null;
                    statusBadge.classList.remove("badge-gold");
                    viewfinderWrapper.classList.remove("aura-glow", "border-scan-white-pulse", "border-scan-green");
                    viewfinderWrapper.classList.add("border-scan-red");
                    instructionHeader.innerHTML = scanPhase === 'FRONT' ? i18n[currentLang].standBack : i18n[currentLang].turnSide;
                    statusBadge.style.opacity = "1";
                    statusIndicatorText.textContent = i18n[currentLang].scanning;
                }

                // Normal scanning skeleton
                if (!hasCaptured) {
                    // Draw the video as an anonymous, futuristic shadow
                    canvasCtx.save();
                    // Apply heavy filters: blur destroys facial features, grayscale & contrast create a solid shape
                    canvasCtx.filter = 'blur(12px) grayscale(100%) contrast(300%) brightness(50%)';
                    // Make it semi-transparent so it blends with the CSS digital grid behind it
                    canvasCtx.globalAlpha = 0.35;
                    canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                    canvasCtx.restore(); // Resets filters and alpha back to normal

                    const drawingUtils = new DrawingUtils(canvasCtx);
                    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                        color: COLOR_SKELETON,
                        lineWidth: 2
                    });
                    drawingUtils.drawLandmarks(landmarks, {
                        radius: 2,
                        color: COLOR_SKELETON,
                        lineWidth: 2
                    });
                }
            }
            canvasCtx.restore();
        });
    }

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
};

retakeBtn.addEventListener("click", () => {
    hasCaptured = false;
    isReadyToScan = false;
    countdownStartTime = null;
    scanPhase = 'FRONT';

    // Hide bottom sheet and reset states
    bottomSheet.classList.remove("translate-y-0");
    bottomSheet.classList.add("translate-y-[200%]");
    document.body.classList.remove("bg-darken");
    viewfinderWrapper.style.display = "";
    viewfinderWrapper.classList.remove("aura-glow", "border-scan-green", "border-scan-white-pulse", "border-scan-red");
    statusBadge.classList.remove("badge-gold");

    document.body.classList.remove("scroll-enabled");

    resShoulders.textContent = "--";
    resChest.textContent = "--";
    resWaist.textContent = "--";
    resInseam.textContent = "--";
    resArm.textContent = "--";

    instructionHeader.textContent = i18n[currentLang].preparing;
    statusBadge.style.opacity = "1";
    statusIndicatorText.textContent = i18n[currentLang].scanning;

    enableCamera();
});

setLanguage("he"); // default
initializeMediaPipe();
