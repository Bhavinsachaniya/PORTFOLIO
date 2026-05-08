
import React, { useEffect, useRef } from 'react';
import { map, lerp, clamp } from '../lib/utils';
import { winsize } from '../lib/utils';

// Helper class for managing SVG filter primitives, ported from the original JS
class FilterPrimitive {
    private type: string;
    private DOM: { el: SVGElement | null };

    constructor(type: string, id: string) {
        this.type = type;
        const selector = `#${id} > ${this.getPrimitiveType(this.type)}`;
        this.DOM = { el: document.querySelector(selector) };
    }

    private getPrimitiveType(type: string): string {
        const types: { [key: string]: string } = {
            'blur': 'feGaussianBlur',
            'distortion': 'feDisplacementMap'
        };
        return types[type];
    }

    public update(distance: number) {
        if (!this.DOM.el) return;

        const el = this.DOM.el as any; // Using any for easier property access like scale
        const minDeviation = parseFloat(el.dataset.minDeviation) || 0;
        const maxDeviation = parseFloat(el.dataset.maxDeviation) || 10;
        const minScale = parseFloat(el.dataset.minScale) || 0;
        const maxScale = parseFloat(el.dataset.maxScale) || 100;

        const types: { [key: string]: () => void } = {
            'blur': () => el.setAttribute('stdDeviation', `${clamp(map(distance, 0, 400, minDeviation, maxDeviation), minDeviation, maxDeviation)}`),
            'distortion': () => {
                if(el.scale) {
                    el.scale.baseVal = clamp(map(distance, 0, 200, minScale, maxScale), minScale, maxScale);
                }
            }
        };

        if (types[this.type]) {
            types[this.type]();
        }
    }
}

const useTextOnPath = (svgRef: React.RefObject<SVGSVGElement>) => {
    const isVisible = useRef(false);
    const entered = useRef(false);
    const positionY = useRef(0);
    const pathLength = useRef(0);
    const startOffset = useRef({ value: 0, amt: 0.22 });
    const scroll = useRef({ value: 0, amt: 0.17 });
    const animationFrameId = useRef<number>();

    useEffect(() => {
        const svgEl = svgRef.current;
        if (!svgEl) return;
        
        const textEl = svgEl.querySelector('text');
        const textPathEl = svgEl.querySelector('textPath');
        const pathEl = svgEl.querySelector('path');
        if (!textEl || !textPathEl || !pathEl) return;
        
        pathLength.current = pathEl.getTotalLength();
        
        const filterType = svgEl.dataset.filterType;
        const filterAttr = textEl.getAttribute('filter');
        const filterIdMatch = filterAttr ? filterAttr.match(/url\(['"]?#([^'"]*)['"]?\)/) : null;
        const filterId = filterIdMatch ? filterIdMatch[1] : null;
        
        const filterPrimitive = (filterType && filterId) ? new FilterPrimitive(filterType, filterId) : null;

        const computeOffset = () => {
            return map(positionY.current - window.pageYOffset, winsize.height, 0, pathLength.current, -pathLength.current / 2);
        };

        const updateTextPathOffset = () => {
            textPathEl.setAttribute('startOffset', startOffset.current.value.toString());
        };

        const updatePosition = () => {
            const svgRect = svgEl.getBoundingClientRect();
            positionY.current = svgRect.top + window.pageYOffset;
        };
        
        updatePosition();
        startOffset.current.value = computeOffset();
        updateTextPathOffset();
        scroll.current.value = window.pageYOffset;

        const update = () => {
            const currentOffset = computeOffset();
            startOffset.current.value = !entered.current ? currentOffset : lerp(startOffset.current.value, currentOffset, startOffset.current.amt);
            updateTextPathOffset();

            const currentScroll = window.pageYOffset;
            scroll.current.value = !entered.current ? currentScroll : lerp(scroll.current.value, currentScroll, scroll.current.amt);
            
            const distance = Math.abs(scroll.current.value - currentScroll);
            filterPrimitive?.update(distance);

            if (!entered.current) {
                entered.current = true;
            }
        };
        
        // FIX: The callback for requestAnimationFrame receives a timestamp.
        // The function signature has been updated to accept this argument for correctness.
        const renderLoop = (_timestamp: number) => {
            if (isVisible.current) {
                update();
            }
            animationFrameId.current = requestAnimationFrame(renderLoop);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible.current = entry.intersectionRatio > 0;
                if (!isVisible.current) {
                    entered.current = false;
                    // reset
                    update();
                }
            });
        });
        
        observer.observe(svgEl);
        window.addEventListener('resize', updatePosition);
        
        animationFrameId.current = requestAnimationFrame(renderLoop);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePosition);
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [svgRef]);
};

export default useTextOnPath;