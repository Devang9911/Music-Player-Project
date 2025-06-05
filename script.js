console.log('Running');

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
// song fetch
async function getSongs() {
    let a = await fetch("./songs/");
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(response)
    let as = div.getElementsByTagName("a");
    // console.log(as)
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        // console.log(element)
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

let currentAudio = null;
const playMusic = (track) => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; //reset
    }
    currentAudio = new Audio("/songs/" + track);
    currentAudio.play();
    plays.src = "svg/pause.svg"
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", "").replace(/\.[a-zA-Z0-9]+$/, "").replace(/-/g, " - ").replace(/([a-z])([A-Z])/g, "$1 $2");

    //time update
    currentAudio.addEventListener("timeupdate", () => {
        // console.log(currentAudio.currentTime , currentAudio.duration);
        document.querySelector(".songstart").innerHTML = `${formatTime(currentAudio.currentTime)}`
        document.querySelector(".songend").innerHTML = `${formatTime(currentAudio.duration)}`
        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
        // currentAudio.currentTime = ((currentAudio.duration)*percent)/100;
    })
}

async function main() {
    let currentSong;

    let songs = await getSongs();

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li data-track="${song}">${song.replaceAll("%20", "").replace(/\.[a-zA-Z0-9]+$/, "").replace(/-/g, " - ").replace(/([a-z])([A-Z])/g, "$1 $2")}</li>`;
    }
    // console.log(songUL);
    // event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.innerHTML);
            playMusic(e.getAttribute("data-track"));
        })
    });


    //pause button
    plays.addEventListener("click", () => {
        if (currentAudio.paused) {
            currentAudio.play()
            plays.src = "svg/pause.svg"
        }
        else {
            currentAudio.pause()
            plays.src = "svg/playsong.svg"
        }
    })

    //jump to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        document.querySelector(".circle").style.left = percent;
        currentAudio.currentTime = ((currentAudio.duration) * percent) / 100;
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        if (!currentAudio || !currentAudio.duration) return;

        const seekbar = e.currentTarget;
        const percent = e.offsetX / seekbar.getBoundingClientRect().width;

        // Set audio time and update the UI
        currentAudio.currentTime = percent * currentAudio.duration;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });
}

main();
