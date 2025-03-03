import React from "react";
import { PlayerContext, Track } from "../routes/Layout";
import { CirclePauseIcon, CirclePlayIcon } from "./icons";

type PlayButtonProps = {
  tracks: Track[];
  albumId: string;
  artist: string;
  imageUrl: string;
};

export default function PlayButton({
  tracks,
  albumId,
  artist,
  imageUrl,
}: PlayButtonProps) {
  let { isPlaying, setIsPlaying, currentTrack, setCurrentTrack } =
    React.useContext(PlayerContext);
  const isPlayingCurrentRecord = isPlaying && currentTrack?.albumId === albumId;

  return (
    <button
      type="button"
      className="text-pink-600 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-lg px-10 py-3 text-center inline-flex items-center dark:focus:ring-gray-500 mr-4"
      onClick={() => {
        if (isPlayingCurrentRecord) {
          setIsPlaying(false);
        } else {
          setCurrentTrack({
            ...tracks[0],
            albumId,
            artist,
            imageUrl,
          });

          setIsPlaying(true);
        }
      }}
    >
      {isPlayingCurrentRecord ? (
        <>
          <CirclePauseIcon />
          Pause
        </>
      ) : (
        <>
          <CirclePlayIcon />
          Play
        </>
      )}
    </button>
  );
}
