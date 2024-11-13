import axios from "axios";
export type TElevenlabsProps = {
  text: string;
  uid: string;
  stability: number;
  similarity_boost: number;
  style?: number;
  model_id: string;
  use_speaker_boost?: boolean;
};
export const textToSpeech = async ({
  text,
  similarity_boost,
  stability,
  style,
  uid,
  model_id,
  use_speaker_boost,
}: TElevenlabsProps) => {
  try {
    const result = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${uid}`,
      {
        text,
        model_id,
        voice_settings: {
          stability,
          similarity_boost,
          style,
          use_speaker_boost,
        },
      },
      {
        headers: {
          accept: "audio/mpeg",
          "xi-api-key": "17dd999e77442c6c7e1e7733e6dd7af2",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return result;
  } catch (error) {
    return error;
  }
};
