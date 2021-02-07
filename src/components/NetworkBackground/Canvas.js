import React, { useRef, useLayoutEffect } from 'react'

import LinesGenerator from './CreateBackground.js'
import useWindowSize from '../../hooks/useWindowSize.js'

import './canvas.module.css'

function Canvas(props) {
    const targetRef = useRef();
    const [winW, winH] = useWindowSize();
    const dims = { height:winH, width:winW };

    // Listen for screen size changes
    useLayoutEffect(() => {
        if(dims.width > 0 && dims.height > 0){
            // Create a new lines generator
            const linesGen = (new LinesGenerator(targetRef, dims.height, dims.width));
            linesGen.CreateBackground();
        }
    }, [dims])

    return (
        <canvas ref={targetRef} width={dims.width} height={dims.height}></canvas>
    )
}

export default Canvas
