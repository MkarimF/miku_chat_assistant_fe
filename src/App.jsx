import { useEffect, useRef } from "react";
import Live2DCanvas from "./components/Live2DCanvas";

function WebcamStream() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Gagal akses kamera:", err);
      });
  }, []);

  return (
    <div className="absolute top-0 left-0 p-4 z-10">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="rounded-xl shadow-lg"
        style={{ transform: "scaleX(-1)", width: "300px" }}
      />
    </div>
  );
}

function App() {
  return (
    
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <WebcamStream />
      <Live2DCanvas />
    </div>
  );
}

export default App;
