import axios from "axios";

export const speechToText = async (base64Audio: any) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_TTS_STT + "stt",
    {
      model: "whisper-1",
      file_base64: base64Audio,
      temperature: 1,
      language: "id",
    }
  );
  const responseObject = response.data[0];
  return responseObject;
};

export type TElevenlabsProps = {
  text: string;
};

// // Fungsi untuk konversi ArrayBuffer ke Base64
// const arrayBufferToBase64 = (buffer: any) => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   const len = bytes.byteLength;
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// };

// // Fungsi Text-to-Speech menggunakan ElevenLabs API
// export const textToSpeech = async ({ text }: { text: string }) => {
//   try {
//     const result = await axios.post(
//       `https://api.elevenlabs.io/v1/text-to-speech/rWUem4xflCzc0bTEystB`,
//       {
//         text,
//         model_id: "eleven_multilingual_v2",
//         voice_settings: {
//           stability: 0.45,
//           similarity_boost: 0.95,
//           style: 0,
//           use_speaker_boost: true,
//         },
//       },
//       {
//         headers: {
//           accept: "audio/mpeg",
//           "xi-api-key": "17dd999e77442c6c7e1e7733e6dd7af2", // Ganti dengan API Key kamu
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer", // Pastikan response adalah arraybuffer
//       }
//     );

//     // Konversi arraybuffer ke Base64
//     const base64Audio = arrayBufferToBase64(result.data);

//     // Buat data URL untuk MP3
//     const audioSrc = `data:audio/mpeg;base64,${base64Audio}`;

//     // Putar audio
//     const audio = new Audio(audioSrc);
//     audio.play();

//     return result;
//   } catch (error) {
//     console.error("Error during text-to-speech conversion:", error);
//     return error;
//   }
// };

export const textToSpeech = async (text: string, voice_id: string) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_TTS_STT + "tts",
    {
      voice_id: voice_id,
      message: text,
    }
  );
  const responseObject = response.data[0];
  return responseObject;
};

export const chatbot = async (
  id: string,
  text: string,
  star: string,
  model: string
) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_CHAT + "chat",
    {
      id: id,
      star: star,
      model: model,
      message: text,
    }
  );

  return response.data;
};

export const resetChatbot = async (id: string, star: string) => {
  const data = {
    id: id,
    star: star,
  };

  const config = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  axios
    .post(import.meta.env.VITE_APP_API_CHAT + "reset", data, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};
