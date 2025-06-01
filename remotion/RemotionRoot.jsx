import { Composition } from 'remotion';
import RemotionVideo from '../app/dashboard/_components/RemotionVideo';

export default function RemotionRoot() {
  return (
    <>
      <Composition
        id="RemotionVideo"
        component={RemotionVideo}
        width={452}
        height={652}
        fps={30}
        durationInFrames={900}
        defaultProps={{
          script: [],
          audioFileUrl: "",
          captions: [],
          imageList: [],
          setDurationinFrames: () => {},
        }}
      />
    </>
  );
}
