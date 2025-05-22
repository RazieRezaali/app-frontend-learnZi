<template>
  <div class="recognize-container">
    <h2>Draw a Character</h2>
    <canvas ref="canvas" width="300" height="300" class="drawing-canvas"></canvas>
    <br>
    <button @click="clearCanvas" class="clear-btn">Clear</button>
    <p class="ocr-result">{{ result }}</p>
  </div>
</template>

<script>
export default{
    data() {
        return {
            result: "",  // Store OCR result
            drawing: false,  // Track drawing state
            isSending: false, // Prevent excessive requests while drawing
        };
    },
    mounted() {
        this.setupCanvas();
    },
    methods: {
        setupCanvas() {
            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext("2d");

            this.canvas.addEventListener("mousedown", this.startDrawing);
            this.canvas.addEventListener("mousemove", this.draw);
            this.canvas.addEventListener("mouseup", this.stopDrawing);
            this.canvas.addEventListener("mouseout", this.stopDrawing);
        },
        startDrawing(event) {
            this.drawing = true;
            this.draw(event);  // Start drawing immediately
        },
        draw(event) {
            if (!this.drawing) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            this.ctx.lineWidth = 5;
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = "black";
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);

            // Throttle sending requests while drawing
            if (!this.isSending) {
                this.isSending = true;
                setTimeout(() => {
                    this.sendImage();
                    this.isSending = false;
                }, 1000);  // Send request every 1 second while drawing
            }
        },
        stopDrawing() {
            this.drawing = false;
            this.ctx.beginPath();
            this.sendImage();  // Send image when drawing stops
        },
        async sendImage() {
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");

            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;

            tempCtx.fillStyle = "white";
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(this.canvas, 0, 0);

            tempCanvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append("image", blob, "drawing.png");

                try {
                    const response = await fetch("http://localhost:5000/upload", {
                        method: "POST",
                        body: formData,
                        headers: { "Accept": "application/json" }
                    });

                    const data = await response.json();
                    console.log("OCR Result:", data.text);
                    this.result = data.text[0];
                    this.$emit('get-ocr-result', this.result);
                } catch (error) {
                    console.error("Fetch Error:", error);
                    this.result = "Error processing image";
                }
            }, "image/png");
        },
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
    }
};
</script>

<style scoped>
.recognize-container {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  margin: auto;
  text-align: center;
  background: #fafafa;
}

.drawing-canvas {
  border: 2px dashed #bbb;
  background: white;
  border-radius: 8px;
  cursor: crosshair;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
}

.clear-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-btn:hover {
  background-color: #dc2626;
}

.ocr-result {
  margin-top: 0.75rem;
  font-weight: 500;
  color: #444;
}
</style>