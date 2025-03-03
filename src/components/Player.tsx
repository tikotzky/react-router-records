import * as React from "react";
import { PlayerContext } from "../routes/Layout";

const PlayIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 sm:w-14 sm:h-14"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const PauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 sm:w-14 sm:h-14"
  >
    <path
      fillRule="evenodd"
      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
      clipRule="evenodd"
    />
  </svg>
);

// This app doesn't have real songs, it only has a few songs
// that we will play over and over as the user uses the app.
const MAX_SONGS = 4;

export default function Player() {
  let audioPlayer = React.useRef<HTMLAudioElement>(null);
  let progressRef = React.useRef<number>(0);
  let [songIndex, setSongIndex] = React.useState(4);
  let [progress, setProgress] = React.useState(0);
  let { isPlaying, setIsPlaying, currentTrack } =
    React.useContext(PlayerContext);

  function whilePlaying() {
    if (!audioPlayer.current) return;
    if (audioPlayer.current.duration) {
      const percentage =
        (audioPlayer.current.currentTime * 100) / audioPlayer.current.duration;
      setProgress(percentage);
    }
    progressRef.current = requestAnimationFrame(whilePlaying);
  }

  React.useEffect(() => {
    if (!audioPlayer.current) return;
    const newIndex = (songIndex % MAX_SONGS) + 1;
    audioPlayer.current.src = `/react-router-records/mp3/song${newIndex}.mp3`;
    audioPlayer.current.currentTime = 0;
    audioPlayer.current.play();
    setSongIndex(newIndex);
  }, [currentTrack?.title]);

  React.useEffect(() => {
    if (isPlaying) {
      audioPlayer.current?.play();
      progressRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(progressRef.current);
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (progress >= 99.99) {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [progress]);

  if (currentTrack === null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 c-player">
      <div className="flex-1 bg-gray-200 h-1.5 dark:bg-gray-700">
        <div
          className="bg-pink-500 h-1.5"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="container mx-auto max-w-screen-lg px-3 py-2 sm:px-6 sm:py-4 flex items-center gap-5">
        <img
          src={currentTrack.imageUrl}
          width="60"
          height="60"
          className="block rounded-md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            {currentTrack.title}
          </p>
          <p className="text-xl text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {currentTrack.artist}
          </p>
        </div>
        <audio ref={audioPlayer} src="/react-router-records/mp3/song1.mp3" />
        <div className="flex gap-6 items-center text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 hidden sm:block"
          >
            <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z"></path>
          </svg>

          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? PauseIcon : PlayIcon}
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 hidden sm:block"
          >
            <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
