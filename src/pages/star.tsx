import { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CakeIcon from "@mui/icons-material/Cake";
import Face6Icon from "@mui/icons-material/Face6";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PaidIcon from "@mui/icons-material/Paid";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AlertSnackbar from "../components/AlertSnackbar/Alertsnackbar";
import VideoRecorder from "../components/VideoRecorder/VideoRecorder";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import {
  chatbot,
  resetChatbot,
  speechToText,
  textToSpeech,
} from "../services/ApiService";
import TypewriterEffect from "../components/TypewriterEffect/TypewriterEffect";
import { cardData } from "../data";

const Star = () => {
  const [startTime, setStartTime] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [startStory, setStartStory] = useState(false);
  const [isLoadingChatResponse, setIsLoadingChatResponse] = useState(false);
  const [newestMessageId, setNewestMessageId] = useState<null | number>(null);

  const [buttonIcon, setButtonIcon] = useState(<MicIcon />);
  const [showVideo, setShowVideo] = useState(false);
  const [voiceId] = useState("AvpfYK43dwo4JbkSVBVe");
  const [model] = useState("gpt-4o");
  const [starName] = useState("naya_dongeng");
  const [results, setResults] = useState<any>([]);
  const [stream, setStream] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const mediaRecorder: any = useRef(null);
  const mimeType = "audio/webm";
  const [selectedIdleVideo, setSelectedIdleVideo] = useState("");
  const BackgroundAudio = useRef<HTMLAudioElement | null>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
      } catch (err: any) {
        console.error("Microphone permission error:", err);
        if (err.name === "NotAllowedError") {
          alert(
            "Microphone access was denied. Please enable it in your browser settings."
          );
        } else if (err.name === "NotFoundError") {
          alert("No microphone was found on your device.");
        } else {
          alert("Error accessing the microphone: " + err.message);
        }
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  useEffect(() => {
    getMicrophonePermission();

    if (isLoadingChatResponse) {
      setButtonIcon(<GraphicEqIcon />);
    } else {
      setButtonIcon(<MicIcon />);
    }
  }, [results, isLoadingChatResponse]);

  useEffect(() => {
    setResults([
      {
        id: 231313,
        result: "Hai... aku Owdi. Kamu siapa?",
        status: "star",
        title: "naya_dongeng",
      },
    ]);
    setNewestMessageId(231313);
  }, []);

  // Randomly pick an idle video when showVideo is false
  useEffect(() => {
    if (showVideo === false) {
      const randomIdleVideo =
        idleVideos[Math.floor(Math.random() * idleVideos.length)];
      setSelectedIdleVideo(randomIdleVideo);
    }
  }, [showVideo]);

  // const addMessage = async (text: string, status: string, title: string) => {
  //   const newMessage = { status, title, result: text, id: Date.now() };
  //   setResults((prevResults: any) => [newMessage, ...prevResults]);
  //   setNewestMessageId(newMessage.id);
  // };

  const addMessage = async (text: string, status: string, title: string) => {
    let cleanText = text;
    if (text.includes("##creepy##")) {
      cleanText = text.replace("##creepy##", "");

      // Memainkan audio latar belakang
      if (!BackgroundAudio.current) {
        setStartStory(true);
        BackgroundAudio.current = new Audio(
          "https://res.cloudinary.com/dcd1jeldi/video/upload/v1730121772/demo-dongeng-bg-music.mp3"
        );
        BackgroundAudio.current.volume = 0.2;
        BackgroundAudio.current.loop = true;
      }
      BackgroundAudio.current.play();
    }

    // Menambahkan pesan baru ke state
    const newMessage = { status, title, result: cleanText, id: Date.now() };
    setResults((prevResults: any) => [newMessage, ...prevResults]);
    setNewestMessageId(newMessage.id);
  };

  const makeApiCall = async (apiFunc: any, errorMessage: string) => {
    try {
      const response = await apiFunc();
      return response;
    } catch (error) {
      console.error(error);
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
      setIsLoadingChatResponse(false);
      setShowVideo(false);
      return null;
    }
  };

  const startRecording = async () => {
    setStartTime(Date.now());
    const media: any = new MediaRecorder(stream, { mimeType: mimeType });
    mediaRecorder.current = media;
    let localAudioChunks: any = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    mediaRecorder.current.start();
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration < 1000) {
        setSnackbarMessage("Please record at least 1 second of audio");
        setOpenSnackbar(true);
        setButtonIcon(<MicIcon />);
        setIsRecording(false);
        return;
      }
      if (audioChunks.length === 0) {
        setIsRecording(false);
        setTimeout(() => {
          setButtonIcon(<MicIcon />);
        }, 3000);
        return;
      }
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = reader.result;
        const speechResponse = await makeApiCall(
          () => speechToText(base64String),
          "Error during speech-to-text processing"
        );

        if (!speechResponse) return;

        const resultText = speechResponse.data;
        await addMessage(resultText, "user", "User");
        setIsLoadingChatResponse(true);

        const chatResponse = await makeApiCall(
          () => chatbot("dev", resultText, starName, model),
          "Error during chatbot processing"
        );
        if (!chatResponse) return;
        const cleanResult = chatResponse.data
          ? chatResponse.data.replace(/```json\n\[\]\n```/g, "")
          : chatResponse.data;

        const resultChat = cleanResult.includes("##creepy##")
          ? cleanResult.replace("##creepy##", "")
          : cleanResult;

        const audioResponse = await makeApiCall(
          () => textToSpeech(resultChat, voiceId),
          "Error during text-to-speech processing"
        );

        if (!audioResponse) return;

        setIsLoadingChatResponse(false);
        setShowVideo(true);

        await addMessage(resultChat, "star", starName);

        // const resultAudioChat = audioResponse;
        const resultAudioChat = audioResponse?.data;
        if (resultAudioChat) {
          const audio = new Audio(resultAudioChat);

          audio.onended = () => {
            setShowVideo(false);
            audio.src = "";
          };

          audio
            .play()
            .then(() => {
              console.log("Audio started playing successfully");
            })
            .catch((e) => {
              console.error("Error playing audio:", e);
            });
        } else {
          setShowVideo(false);
        }

        setShowVideo(true);
      };

      reader.readAsDataURL(audioBlob);
      setAudioChunks([]);
    };
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
      setIsRecording(true);
      setButtonIcon(<GraphicEqIcon />);
    } else {
      stopRecording();
      setIsRecording(false);
      setButtonIcon(<MoreHorizIcon />);
    }
  };

  const handleReset = async () => {
    setIsRecording(false);
    setResults([
      {
        id: 231313,
        result: "Hai... aku Owdi. Kamu siapa?",
        status: "star",
        title: "naya_dongeng",
      },
    ]);
    makeApiCall(
      () => resetChatbot("dev", starName),
      "Error during chatbot reset"
    );
    setOpenSnackbar(!openSnackbar);
    setSnackbarMessage("success reset");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };
  const idleVideos = [
    "https://res.cloudinary.com/dcd1jeldi/video/upload/v1731389998/dongeng-idle.mp4",
  ];
  return (
    <div
      className={`${
        startStory
          ? "bg-black"
          : "bg-gradient-to-r from-orange-700 to-orange-400"
      } flex flex-col items-center min-h-screen transition-all duration-500 ease-in-out`}
    >
      <div className="flex flex-row w-full max-w-screen-xl">
        {/* Left Panel - Chat History */}
        <div className="flex flex-col space-y-5 w-1/4 p-4">
          <div className="text-3xl text-white font-bold">OWDI</div>
          <div className="space-y-2 ">
            <h1 className="text-white text-sm font-semibold">
              Own Digital Companion
            </h1>
            <p className="text-white text-sm font-normal">
              your digital friend who is always ready to help you with your
              daily activities, making life simpler and more fun!
            </p>
          </div>
          <button className="text-white  bg-gradient-to-r flex items-center justify-between px-4 from-orange-600 to-orange-400 font-semibold py-4 rounded-xl border border-orange-600 shadow-lg mb-4">
            Buat Sesi Obrolan Baru <KeyboardArrowRightIcon fontSize="small" />
          </button>

          {/* Riwayat Obrolan */}
          <div className="bg-[#FEE0D9] rounded-xl shadow-lg p-4 w-72">
            <div className="flex items-center justify-between pb-2 border-b border-opacity-50 border-[#FF8B79]">
              <h2 className="font-semibold text-[#333E4F] text-lg">
                Riwayat Obrolan
              </h2>
              <KeyboardArrowDownIcon
                fontSize="small"
                className="text-[#333E4F]"
              />
            </div>
            <ul className="mt-3 text-[#333E4F]">
              <span className="text-xs text-[#A8A8A8]">31 Oktober 2024</span>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Owdi Ceritakan film Angkasa
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Owdi Ceritakan film Sehati Se...
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <span className="text-xs text-[#A8A8A8]">28 Oktober 2024</span>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">Owdi aku sedih</span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Horor kampung setan di Banyuw...
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Center Panel - Main Interaction */}
        <div className="flex flex-col rounded-br-[40px] rounded-bl-[40px] items-center w-1/2 relative  gradient-background">
          {/* Audio Recording */}
          <div className="absolute z-30 gap-2 rounded-[40px] bottom-0 w-full flex justify-center items-center bg-white p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="px-4 py-2 rounded-full w-full"
            />
            <button
              onClick={() => toggleRecording()}
              onContextMenu={(e) => e.preventDefault()}
              className="text-white shadow-xl bg-gradient-to-r flex items-center justify-between px-6 from-orange-600 to-orange-400 font-semibold py-2 rounded-full border border-orange-600"
            >
              <span style={{ pointerEvents: "none" }}>{buttonIcon}</span>
            </button>
          </div>
          <div className="flex justify-center w-full py-4">
            <button className="background-color-btn flex gap-2 items-center justify-center font-semibold text-white px-4 py-2 rounded-full">
              <PaidIcon className="text-yellow-600" fontSize="small" /> 50
              credits tersisa <AddIcon />
            </button>
          </div>
          <div className="relative ">
            {showVideo ? (
              <VideoRecorder
                looping
                videoSrc="https://res.cloudinary.com/dcd1jeldi/video/upload/v1731396204/dongeng-talk.mp4"
              />
            ) : (
              <VideoRecorder looping videoSrc={selectedIdleVideo} />
            )}
          </div>
        </div>

        {/* Right Panel - Chat Section */}
        <div className="flex flex-col w-full p-4 custom-gradient-bg">
          <div className="bg-none p-4">
            {results && results.length > 0 && (
              <div className="overflow-y-auto h-[500px] text-white z-20 flex flex-col justify-center items-center">
                <div className="w-full h-full px-4 space-y-3 overflow-y-auto">
                  {results.map((result: any, _: any) => {
                    const cleanResult = result.result.replace(
                      /```json\n\[\]\n```/g,
                      ""
                    );
                    return (
                      <div
                        className={`w-full   semi-transparent-background px-4 ${
                          result.status === "user"
                            ? "text-right rounded-br-xl rounded-tl-xl rounded-bl-xl"
                            : "text-left rounded-br-xl rounded-tr-xl rounded-bl-xl"
                        }`}
                        key={result.id} // Add a key for each element
                      >
                        <p
                          className={
                            result.status === "user" ? "user-text" : "star-text"
                          }
                        >
                          {result.title == "naya_dongeng" ? "Owdi" : "You"}
                        </p>
                        <div className="content-text">
                          {result.id === newestMessageId ? (
                            <TypewriterEffect text={cleanResult} />
                          ) : (
                            <span
                              className="text-white"
                              dangerouslySetInnerHTML={{
                                __html: cleanResult,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {results && results.length > 1 && (
              <div className="mt-2 flex w-full">
                <button
                  onClick={() => handleReset()}
                  className="w-full rounded-full cursor-pointer px-4 py-2 border-white text-white fo border-2 "
                >
                  Selesaikan Sesi ini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel - Topic Section */}
      {/* <div className="flex flex-col text-color-primary py-6 bg-gradient-to-t from-orange-500 to-orange-600 w-full"> */}
      <div
        className={`${
          startStory
            ? "bg-gray-900"
            : "bg-gradient-to-t from-orange-500 to-orange-600"
        } flex flex-col text-color-primary py-6 transition-all duration-500 ease-in-out w-full`}
      >
        <div className="mb-2 container mx-auto ml-[26rem]">
          <div className="space-y-2">
            <h1 className="text-left font-semibold text-white">
              Mau Owdi ceritakan topik dibawah ini ?
            </h1>
            {/* Topic Buttons */}
            <div className="flex space-x-2 mb-4">
              <button className="bg-blue-900 text-white font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                Semua Topik
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <VideocamIcon fontSize="small" /> Film
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <Face6Icon fontSize="small" /> Film Horor
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <CakeIcon fontSize="small" />
                Resep Makanan
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <ImportContactsIcon fontSize="small" />
                Cerita Anak
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {cardData.map((item, index) => {
            const IconComponent = item.icons;
            return (
              <div key={index}>
                <div className="bg-white w-64 rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt="Topic Image"
                    className="w-full h-36 object-fill"
                  />
                  <div className="p-4 relative">
                    <h3 className="font-bold text-xs mb-2">{item.title}</h3>
                    <div className="flex justify-between items-center text-gray-600">
                      <div className=" absolute -top-3 bg-gray-200 bg-opacity-85 font-semibold rounded-xl px-2">
                        <IconComponent className="mr-2" fontSize="small" />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <span className="text-xs flex items-center gap-1 font-semibold">
                        <PaidIcon
                          fontSize="small"
                          className="text-yellow-600"
                        />{" "}
                        {item.credits} Credit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AlertSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Star;
