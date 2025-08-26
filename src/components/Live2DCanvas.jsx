import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";

function Live2DCanvas() {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const motionRef = useRef(null);
  useEffect(() => {


    if (!containerRef.current) return;
    
    const app = new PIXI.Application({
      backgroundAlpha: 1,
      resizeTo: window,
      antialias: true,   
    });

    containerRef.current.appendChild(app.view);

    const handleStartTalking = () => {
      if (!modelRef.current) return;

      // const motion = modelRef.current.motion("/miku/runtime/motions/miku_07.motion.json");
      // motion.motion("Lipsync",0).start()
      // motion.loop = true;
      // motion.start();
      // motionRef.current = motion;
      // motion.motionManager.stopAllMotions();
    };
    const handleStopTalking = () => {
      if (motionRef.current) {
        motionRef.current.motionManager?.stopAllMotions();
        // motionRef.current.stop();
        // motionRef.current = null;
      }
    };
    Live2DModel.from("/miku/runtime/miku.model3.json")
      .then((model) => {
        modelRef.current = model;
        model.autoUpdate = false;
        model.scale.set(0.5, 0.5);
        model.anchor.set(0.5, 0.5);
        model.position.set(window.innerWidth / 2-10, window.innerHeight / 2-150);
        app.stage.addChild(model);

        app.ticker.add((delta) => {
          model.update(delta * 16.666);
        });
      })
      .catch((e) => {
        console.error("❌ Gagal load model:", e);
      })
      
    window.addEventListener("miku:startTalking", handleStartTalking);
    window.addEventListener("miku:stopTalking", handleStopTalking);
      return () => {
        window.removeEventListener("miku:startTalking", handleStartTalking);
        window.removeEventListener("miku:stopTalking", handleStopTalking);        
        app.destroy(true, { children: true });
      };
  }, []);

  return (
    <>
      <div ref={containerRef} className="w-full h-full"></div>
    </>
  );
}


export default Live2DCanvas;
