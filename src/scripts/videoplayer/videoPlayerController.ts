import { path } from "../requiredLib";
import VideoPlayer from "./VideoPlayer";
import { playControlsAnimations, startVideoPlayerAnimations, stopVideoPlayerAnimations } from "./videoPlayerControllerAnimation";

const videoElement          = document.querySelector<HTMLVideoElement>("[data-video]")
const poster                = document.querySelector<HTMLImageElement>("[data-poster-video]");
const playControls          = document.querySelector<HTMLDivElement>(".play-controls")
const FullScreenControls    = document.getElementById("full-screen-controls-predownload")
const PictureInPictureControls = document.getElementById("mini-player-controls-id")
const previewImg		= document.querySelector<HTMLImageElement>(".preview-img")
const thumbnailImg	= document.querySelector<HTMLDivElement>(".thumb-img")
const timeLineContainer = document.querySelector<HTMLDivElement>(".timeline-container")
export const videoPlayer = new VideoPlayer(videoElement);



//Timeline
let isScrubbing = false;

function toggleScrubbing(e:MouseEvent){
	console.log()
	const rect = timeLineContainer.getBoundingClientRect();
	const percent = Math.min(Math.max(0,e.x - rect.x),rect.width) / rect.width


	isScrubbing = (e.buttons & 1) === 1 
	document.querySelector<HTMLDivElement>(".video_wrapper").classList.toggle("scrubbing")
	if(isScrubbing){
	videoPlayer.pause()
	}else{
		videoElement.currentTime = percent * videoElement.duration
		if(!videoPlayer.isPlaying.state)
					videoPlayer.play()
	}

	handeTimeLineUpdate(e)
}


function handeTimeLineUpdate(e:MouseEvent){

	const rect = timeLineContainer.getBoundingClientRect();
	const percent = Math.min(Math.max(0,e.x - rect.x),rect.width) / rect.width

	const percentVertical = Math.min(Math.max(0,e.y - rect.y),rect.height) / rect.height
	console.log(percentVertical)
//const previewImgNumber = Math.max(1,Math.floor((percent*videoElement.duration)/10))
//const previewImgSrc= `${previewImgNumber}.jpg`
//previewImg.src = previewImgSrc
//console.log(path.dirname(videoPlayer.SourceStream).split(path.sep).pop())
//console.log(percent)
timeLineContainer.style.setProperty("--preview-position",percent.toString())

if(isScrubbing){
	e.preventDefault()
	//thumbnailImg.src = previewImgSrc;
timeLineContainer.style.setProperty("--progress-position",percent.toString())
}
}

videoElement.addEventListener("timeupdate",()=>{
const percent = videoElement.currentTime / videoElement.duration;	
timeLineContainer.style.setProperty("--progress-position",percent.toString())
})


timeLineContainer.addEventListener("mousemove",handeTimeLineUpdate)

timeLineContainer.addEventListener("mousedown",toggleScrubbing)

document.addEventListener("mouseup",e=>{
	if(isScrubbing){
	toggleScrubbing(e)
	}
	
})

function PlayControls(){
	videoPlayer.toggle();
	console.log(videoPlayer.isPlaying)
	videoPlayer.isPlaying.state ? startVideoPlayerAnimations() : stopVideoPlayerAnimations();
	playControlsAnimations(videoPlayer.isPlaying.state)
}


export const setPoster = (thumbnails: any) => {

	poster.src = thumbnails[thumbnails.length - 1].url;
	poster.dataset.posterVideo = "done";
	document.querySelector(".poster-video").classList.add("poster-done");
	setTimeout(() => {
		document.querySelector(".poster-video").classList.remove("poster-done");
	}, 1000);
};

export const disabledVideoPlayer = () => {
	videoPlayer.pause();
	stopVideoPlayerAnimations();
};
export const enabledVideoPlayer = () => {
	startVideoPlayerAnimations();
	videoPlayer.play();
};

export const toggleFullScreenMode = () => {
    if(document.fullscreenElement === null){
        document.querySelector<HTMLDivElement>(".video_wrapper").requestFullscreen()
    }else{
        document.exitFullscreen()
    }
}

export const togglePictureInPictureMode = () => {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture();
	} else {
	  if (document.pictureInPictureEnabled) {
		videoElement.requestPictureInPicture();
	  }
	}
}
poster.addEventListener("click",PlayControls)

playControls.addEventListener("click",PlayControls)

FullScreenControls.addEventListener("click",toggleFullScreenMode)

PictureInPictureControls.addEventListener("click",togglePictureInPictureMode)

document.addEventListener("fullscreenchange",()=>{
    document.querySelector(".video_wrapper").classList.toggle("controls-full-screen")
//videoElement.classList.toggle("full-screen",document.fullscreenElement)
})


videoElement.addEventListener("click",PlayControls)