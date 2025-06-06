<template>
  <div class="text-center mt-3">
    <canvas
      ref="canvas"
      width="260"
      height="260"
      class="border rounded bg-white shadow-sm"
    ></canvas>
    <div class="mt-2">
      <button @click="clearCanvas" class="btn btn-outline-danger btn-sm">Clear</button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
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
        },
        stopDrawing() {
            this.drawing = false;
            this.ctx.beginPath();
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
                    const response = await axios.post('/ocr', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    console.log("OCR Result:", response.data.text);
                    this.result = response.data.text[0];
                    this.$emit('get-ocr-result', this.result);
                } catch (error) {
                    console.error("OCR Error:", error);
                    this.result = "Error processing image";
                }
            }, "image/png");
        },
        async getCanvasBlob() {
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");

            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;

            tempCtx.fillStyle = "white";
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(this.canvas, 0, 0);

            return new Promise((resolve) => {
                tempCanvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/png");
            });
        },
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
    }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>