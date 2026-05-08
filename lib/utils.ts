
// Map number x from range [a, b] to [c, d]
export const map = (x: number, a: number, b: number, c: number, d: number): number => (x - a) * (d - c) / (b - a) + c;

// Linear interpolation
export const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

// Clamp val within min and max
export const clamp = (val: number, min: number, max: number): number => Math.max(Math.min(val, max), min);

// Viewport size singleton to mimic original vanilla JS behavior
class WindowSize {
    public width: number;
    public height: number;

    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.addEventListeners();
    }

    private update = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    private addEventListeners = () => {
        window.addEventListener('resize', this.update);
    }
}

export const winsize = new WindowSize();
