const VideoRecorder = ({
  videoSrc,
  looping,
}: {
  videoSrc: string;
  looping: boolean;
}) => {
  return (
    <>
      <video
        src={videoSrc}
        controls={false}
        className="rounded-br-[40px] rounded-bl-[40px] max-w-xl mx-auto height-large width-large"
        style={{
          width: "600px",
          height: "800px",
          objectFit: "cover",
          // objectPosition: "53% 100%",
        }}
        autoPlay={true}
        loop={looping}
        muted={true}
      />
    </>
  );
};

export default VideoRecorder;
