declare module 'canvas2image' {
    export function saveAsPNG(canvas: HTMLCanvasElement, callback: (err: Error | null, canvas: HTMLCanvasElement) => void): void;
    // Add other necessary declarations as needed
}