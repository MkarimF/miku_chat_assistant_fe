import { useEffect, useRef } from "react";
import Live2DCanvas from "./components/Live2DCanvas";

function WebcamStream() {
  const videoRef = useRef(null)
  // const [spokenText, setSpokenText] = useState('')
  const audioRef = useRef(null)

  const speakText = async(text) => {
    try{
      const response = await fetch ('http://127.0.0.1:8000/api/v1/tts/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        throw new Error('miku failed to speak');
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        
        window.dispatchEvent(new CustomEvent("miku:startTalking"))
      }
      audioRef.current.onended = () => {
        window.dispatchEvent(new CustomEvent("miku:stopTalking"))
      }
    } catch (error) {
      console.error("Error speaking text:", error);
    }
  }

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
      <button onClick={() => speakText("Halo, saya Miku! Senang bertemu!")}>
        🔊 Test Suara
      </button>

      <audio ref={audioRef} hidden />
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
