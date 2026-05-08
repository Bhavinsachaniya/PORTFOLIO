
import React, { useRef } from 'react';
import useTextOnPath from '../hooks/useTextOnPath';

interface AnimatedSvgTextProps {
    pathDefinition: string;
    pathId: string;
    text: string;
    filterType: 'blur' | 'distortion';
    filterId: string;
    viewBox: string;
    className?: string;
}

const AnimatedSvgText: React.FC<AnimatedSvgTextProps> = ({
    pathDefinition,
    pathId,
    text,
    filterType,
    filterId,
    viewBox,
    className
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    useTextOnPath(svgRef);

    return (
        <svg
            ref={svgRef}
            className={`svgtext ${className || ''}`}
            data-filter-type={filterType}
            width="120%"
            preserveAspectRatio="xMidYMid meet"
            viewBox={viewBox}
        >
            <path id={pathId} d={pathDefinition} fill="none" />
            <text filter={`url(#${filterId})`}>
                <textPath href={`#${pathId}`}>{text}</textPath>
            </text>
        </svg>
    );
};

export default AnimatedSvgText;
