import React, { useEffect, useRef, useState } from 'react';


export default function AudioHandler({ files }: { files: File[] }): JSX.Element {
  //state declarations, can be used to access file in the future
  const [msgContent, setMsgContent] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  //sets the audio that is uploaded
  useEffect(() => {
    if (files.length > 0) {
      var i = files.length - 1;
      for(; !files[i].name.endsWith(".mp3") && i >= 0; i--);
      if(i == -1) i++;
      const objectURL = URL.createObjectURL(files[i]);
      if (audioRef.current) {
        audioRef.current.src = objectURL;
      }
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [files]);

  //plays the audio that is uploaded 
  return (
    <div>
            <audio ref={audioRef} controls onPlay={() => setMsgContent("Playing...")} onPause={() => setMsgContent("Paused")} onEnded={() => setMsgContent("Playback ended.")} onError={() => setMsgContent("Can't play a non .mp3 file.")}>
            </audio>
            <p>{msgContent}</p>
        </div>
  );
}
