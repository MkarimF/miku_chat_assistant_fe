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

    Live2DModel.from("/miku/runtime/miku.model3.json")
      .then((model) => {
        model.autoUpdate = false;
        model.scale.set(0.25);
        model.anchor.set(0.5, 0.5);
        model.position.set(window.innerWidth / 2, window.innerHeight / 2-150);
        app.stage.addChild(model);

        app.ticker.add((delta) => {
          model.update(delta * 16.666);
        });
      })
      .catch((e) => {
        console.error("❌ Gagal load model:", e);
      });

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);
   const startTalkingMotion = () => {
    if (!modelRef.current) return;
    const motion = modelRef.current.motion("talk");
    motion.loop = true;
    motion.start();
    motionRef.current = motion;
  };

  const stopTalkingMotion = () => {
    if (motionRef.current) {
      motionRef.current.stop();
      motionRef.current = null;
    }
  };

  // Contoh integrasi dengan TTS
  const playTTS = (url) => {
    const audio = new Audio(url);
    startTalkingMotion();
    audio.play();
    audio.onended = () => {
      stopTalkingMotion();
    };
  };

  return (
    <>
      <button onClick={() => playTTS("/audio/wav")}>Play Voice</button>
      <div ref={containerRef} className="w-full h-full"></div>
    </>
  );
}


export default Live2DCanvas;
