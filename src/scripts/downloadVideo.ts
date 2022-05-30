import { videoInfo } from "ytdl-core";
import Config from "./../config/config";
import { AnimationContoller, AnimationDownloadingContoller } from "./animations/DownloadAnimationController";
import { path, ytdl, fs } from "./requiredLib";
import { validateYotubeLinkType } from "./types/types";
import { ManipulateDOM } from "./manipulateDOM";
import VideoPlayer from "./videoplayer/VideoPlayer";
import { playControlsAnimations, startVideoPlayerAnimations, stopVideoPlayerAnimations } from "./videoplayer/videoPlayerControllerAnimation";

const OUPUT_DATA_PERCENT_DOWNLOAD = document.querySelector<HTMLDivElement>(".download-data");
const INPUT_FIELD_FOR_VIDEO_ID = document.querySelector<HTMLInputElement>(".searchId");
const PROGRESS_CURRENT_ELEMENT = document.querySelector<HTMLDivElement>(".progress-current");
const ANIMATION_ELEMENT = document.querySelector<HTMLDivElement>(".dl");
const SEARCH_BUTTON = document.querySelector<HTMLDivElement>(".btn-search");
const YOUTUBE_VALIDATE_LINK = "https://www.youtube.com/watch?v=";
const SEPARATE_SYMBOLS = "v=";

const configSetup = new Config();
const animationDownloadingContoller = new AnimationDownloadingContoller(ANIMATION_ELEMENT);
const downloadScreen = new AnimationContoller(document.querySelector(".download_screen"));
const incorrectUrlOrId = new AnimationContoller(document.querySelector(".search__input"));
const errorMsgSearchInput = new AnimationContoller(document.querySelector(".error_msg_search_input"));
const manipulateDOM = new ManipulateDOM();
const videoElement = document.querySelector<HTMLVideoElement>("[data-video]")
const videoPlayer = new VideoPlayer(videoElement);
const poster = document.querySelector<HTMLImageElement>("[data-poster-video]");
const playControls          = document.querySelector<HTMLDivElement>(".play-controls")

const { config } = configSetup.configDownloadFiles;
console.log(configSetup.configDownloadFiles.config);

export const initDownloaderVideo = async (VideoId: string) => {
	await ytdl.getInfo(`${YOUTUBE_VALIDATE_LINK}${VideoId}`).then((data: videoInfo) => {
		console.log(data);

		const { videoDetails } = data;

		configSetup.createDirectory();
		configSetup.createPlaylist();

		let generatedPath = configSetup.generatedPath(data);
		let video = ytdl(videoDetails.video_url, { filter: "audioandvideo" });

		console.log(generatedPath);

		animationDownloadingContoller.StartAnimation("run");
		//DOWNLOAD VIDEO
		video.pipe(fs.createWriteStream(generatedPath));

		video.once("response", () => {});

		//LISTENING ALL CHUNKS VIDEO
		video.on("progress", (chunkInBytes: number, totalBytesDownloaded: number, totalBytes: number) => {
			console.log(`${Math.round(totalBytesDownloaded / 1024 / 1024)}/${Math.round(totalBytes / 1024 / 1024)}`);
			let resultInPercents: number = (totalBytesDownloaded / totalBytes) * 100;
			animationDownloadingContoller.startHeightProgressBar(PROGRESS_CURRENT_ELEMENT, resultInPercents);
			animationDownloadingContoller.outputStatusInPercents(OUPUT_DATA_PERCENT_DOWNLOAD, resultInPercents);
		});

		//LISTENING END DOWNLOAD VIDEO
		video.on("end", () => {
			console.log("файл скачан");
			animationDownloadingContoller.EndAnimation("done");
			setTimeout(() => {
				animationDownloadingContoller.ExitAnimation(["run", "done"]);
				animationDownloadingContoller.refreshHeightProgress(PROGRESS_CURRENT_ELEMENT);
			}, 1500);
			setTimeout(() => {
				downloadScreen.ExitAnimation(["show_progress"]);
			}, 2000);

			setTimeout(() => {
				videoPlayer.setSourceStream(path.resolve(generatedPath));
				enabledVideoPlayer();
			}, 2500);

			console.log(path.resolve(generatedPath));
		});
	});
};

const validateYotubeLink = (fullUrl: string, id: string): validateYotubeLinkType => {
	if (!ytdl.validateURL(fullUrl)) {
		console.log(`Incorrect video url : ${fullUrl}`);
		return {
			state: false,
			msg: "Incorrect video url",
		};
	}

	if (!ytdl.validateID(id)) {
		console.log("Incorrect video id");
		return {
			state: false,
			msg: "Incorrect video id",
		};
	}

	return {
		state: true,
		msg: "Ok",
	};
};

//event : () => search video by click
//SEARCH_BUTTON.addEventListener("click", () => initDownloaderVideo(INPUT_FIELD_FOR_VIDEO_ID.value));

SEARCH_BUTTON.addEventListener("click", () => {
	let isValid = validateYotubeLink(`${YOUTUBE_VALIDATE_LINK}${INPUT_FIELD_FOR_VIDEO_ID.value}`, INPUT_FIELD_FOR_VIDEO_ID.value);
	manipulateDOM.toggleElement(SEARCH_BUTTON, { state: false });

	if (isValid.state) {
		setTimeout(() => {
			ytdl.getInfo(`${YOUTUBE_VALIDATE_LINK}${INPUT_FIELD_FOR_VIDEO_ID.value}`).then((data: videoInfo) => {
				console.log(data);
				setPoster(data.videoDetails.thumbnails);
				document.querySelector(".name-video").textContent = data.videoDetails.title;
				manipulateDOM.toggleElement(SEARCH_BUTTON, { state: true });
				setTimeout(() => {
					disabledVideoPlayer();
					downloadScreen.StartAnimation("show_progress");
					initDownloaderVideo(INPUT_FIELD_FOR_VIDEO_ID.value);
				}, 1000);
			});
		}, 1000);
	} else {
		document.querySelector(".error_msg_search_input").textContent = isValid.msg;
		incorrectUrlOrId.StartAnimation("incorrect_url_or_id");
		errorMsgSearchInput.StartAnimation("slide_bottom");
		setTimeout(() => {
			incorrectUrlOrId.ExitAnimation(["incorrect_url_or_id"]);
			errorMsgSearchInput.ExitAnimation(["slide_bottom"]);
			manipulateDOM.toggleElement(SEARCH_BUTTON, { state: true });
		}, 800);
	}
});


//videoElement.addEventListener("click",PlayControls)

poster.addEventListener("click",PlayControls)

playControls.addEventListener("click",PlayControls)

function PlayControls(){
	videoPlayer.toggle();
	
	console.log(videoPlayer.isPlaying)
	videoPlayer.isPlaying.state ? startVideoPlayerAnimations() : stopVideoPlayerAnimations();
	playControlsAnimations(videoPlayer.isPlaying.state)
}







//event : () => change input link if appropriate
INPUT_FIELD_FOR_VIDEO_ID.addEventListener("input", () => {
	if (INPUT_FIELD_FOR_VIDEO_ID.value.includes(YOUTUBE_VALIDATE_LINK)) {
		let res = INPUT_FIELD_FOR_VIDEO_ID.value.split(SEPARATE_SYMBOLS);
		INPUT_FIELD_FOR_VIDEO_ID.value = res[1];
	}
});

const setPoster = (thumbnails: any) => {

	poster.src = thumbnails[thumbnails.length - 1].url;
	poster.dataset.posterVideo = "done";
	document.querySelector(".poster-video").classList.add("poster-done");
	setTimeout(() => {
		document.querySelector(".poster-video").classList.remove("poster-done");
	}, 1000);
};

const disabledVideoPlayer = () => {
	videoPlayer.pause();
	stopVideoPlayerAnimations();
};
const enabledVideoPlayer = () => {
	startVideoPlayerAnimations();
	videoPlayer.play();
};
// .then(()=>{
//     fs.readdir((dirSave:any,err:Error, files:any) => {
//         files.forEach((file:any) => {
//           console.log(file);
//         });
//       });
// })
//    const absolutePath = path.resolve( folder, file );
