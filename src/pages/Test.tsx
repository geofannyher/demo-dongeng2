// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import { textToSpeech } from "../services/ApiService";

// const SpeechTranscriber = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [audioUrl, setAudioUrl] = useState(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     // Check if SpeechRecognition is available in the browser
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition =
//         window.webkitSpeechRecognition || window.SpeechRecognition;
//       const recognitionInstance = new SpeechRecognition();
//       recognitionInstance.continuous = false; // Stop after each phrase
//       recognitionInstance.interimResults = false; // Get final results only
//       recognitionInstance.lang = "id-ID"; // Set language

//       recognitionInstance.onresult = (event) => {
//         const lastTranscript = event.results[0][0].transcript;
//         setTranscript(lastTranscript);
//         sendTranscriptToAPI(lastTranscript); // Send to API once transcription is complete
//       };

//       recognitionInstance.onend = () => {
//         if (isListening) {
//           recognitionInstance.start(); // Restart recognition automatically
//         }
//       };

//       setRecognition(recognitionInstance);
//     } else {
//       alert("Browser tidak mendukung Web Speech API");
//     }
//   }, [isListening]);

//   const sendTranscriptToAPI = async (text: string) => {
//     try {
//       const response = await textToSpeech(text, "AvpfYK43dwo4JbkSVBVe");
//       console.log(response);
//       setAudioUrl(response.data); // Assume API returns an audio URL
//     } catch (error) {
//       console.error("Error sending transcript to API:", error);
//     }
//   };

//   const startListening = () => {
//     if (recognition) {
//       setIsListening(true);
//       recognition.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognition) {
//       setIsListening(false);
//       recognition.stop();
//     }
//   };

//   useEffect(() => {
//     if (audioUrl && audioRef.current) {
//       audioRef.current.play();
//       audioRef.current.onended = () => {
//         if (isListening) {
//           recognition.start(); // Restart recognition after audio finishes
//         }
//       };
//     }
//   }, [audioUrl]);

//   return (
//     <div>
//       <button onClick={startListening} disabled={isListening}>
//         Start Speech
//       </button>
//       <button onClick={stopListening} disabled={!isListening}>
//         Stop Speech
//       </button>
//       <p>Transcription: {transcript}</p>
//       {audioUrl && <audio ref={audioRef} src={audioUrl} />}
//     </div>
//   );
// };

// export default SpeechTranscriber;
