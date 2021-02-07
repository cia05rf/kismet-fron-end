import React, { useState, useLayoutEffect } from 'react'

import Canvas from './Canvas.js'

function NetworkBackground(props) {
    const [canvasElems, setCanvasElems] = useState([])

    const handleDestroy = () => {
        setCanvasElems((curCanvasElems) => curCanvasElems.slice(0,-1))
    }
    
    const handleCreate = () => {
        setCanvasElems((curCanvasElems) => [...curCanvasElems, <Canvas key={curCanvasElems.length}/>])
    }

    useLayoutEffect(() => {
      function resetBackground() {
        handleDestroy();
        handleCreate();
      }
      window.addEventListener('resize', resetBackground);
      resetBackground();
      return () => window.removeEventListener('resize', resetBackground);
    }, []);
    
    return (
        <>
            {
                canvasElems
            }
        </>
    )
}

export default NetworkBackground
