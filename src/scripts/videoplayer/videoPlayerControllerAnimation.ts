
import { AnimationContoller } from '../animations/DownloadAnimationController';

const videoWrapper          = document.querySelector<HTMLDivElement>(".video_details_wrapper")
const activePlayerClass     = "active-player"
const videoPlayerAnimation  = new AnimationContoller(videoWrapper);


export const startVideoPlayerAnimations = () => {
    videoPlayerAnimation.StartAnimation(activePlayerClass);
}

export const stopVideoPlayerAnimations = () => {
    videoPlayerAnimation.ExitAnimation([activePlayerClass]);
}