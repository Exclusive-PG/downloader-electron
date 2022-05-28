
export default class VideoPlayer{

    private player:HTMLVideoElement

    constructor(player:HTMLVideoElement){
        this.player = player;
        console.log(this.player)
    }

    public play(){
        this.player.paused && this.player.play();
    }
    public pause(){
        !this.player.paused && this.player.pause();

    }
    public toggle(){
        this.player.paused ? this.player.play() : this.player.pause();
    }
    public setSourceStream(source:string){
        this.player.src = source;
    }
}