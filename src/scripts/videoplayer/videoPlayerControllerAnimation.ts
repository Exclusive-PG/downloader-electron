
import { AnimationContoller } from '../animations/DownloadAnimationController';

const videoWrapper          = document.querySelector<HTMLDivElement>(".video_details_wrapper")
const activePlayerClass     = "active-player"
const videoPlayerAnimation  = new AnimationContoller(videoWrapper);
const playControls          = document.querySelector<HTMLDivElement>(".play-controls")
const sizeControls          = 30;

export const startVideoPlayerAnimations = () => {
    videoPlayerAnimation.StartAnimation(activePlayerClass);
}

export const stopVideoPlayerAnimations = () => {
    videoPlayerAnimation.ExitAnimation([activePlayerClass]);
}

export const playControlsAnimations = (state:boolean) => {

    playControls.innerHTML = `<ion-icon style="font-size: ${sizeControls}px" name="${!state ? "play" : "pause"}"></ion-icon>`

}

