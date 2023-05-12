class Sang {
  constructor(artist, tittel, bildeFil, lydfil) {
    this.artist = artist;
    this.tittel = tittel;
    this.bildeFil = bildeFil;
    this.lydfil = lydfil;
  }
}
  
class Playlist {
  constructor(navn, mappe, sanger) {
    this.navn = navn;
    this.mappe = mappe;
    this.sanger = sanger;
    this.currentIndex = 0;
    this.audio = new Audio();
    this.isPlaying = false;
    this.tid = 0;

    this.audio.addEventListener("ended", () => {
      this.SpillNesteSang();
    });
    this.audio.addEventListener("timeupdate", () => {
      let lengde = this.audio.duration;
      let spilt = this.audio.currentTime;
      updateSpillerUI(this.sanger[this.currentIndex].artist, this.sanger[this.currentIndex].tittel, this.sanger[this.currentIndex].bildeFil, spilt, lengde);
    });
  }
  
  SpillSang(index, startTid) {
    if (index >= 0 && index < this.sanger.length) {
      let sang = this.sanger[index];
      if (this.isPlaying){
        this.audio.pause();
      }
      this.audio.src = sang.lydfil;
      this.audio.currentTime = startTid;
      this.audio.play();
      this.isPlaying = true;
      this.currentIndex = index;
      updateSpillerUI(sang.artist, sang.tittel, sang.bildeFil, 0, this.audio.duration);
      
    }
  }
  
  SpillNesteSang() {
    this.tid = 0;
    if (this.currentIndex < this.sanger.length - 1) {
      this.SpillSang(this.currentIndex + 1, this.tid);
    }else{
      this.pause();
    }
  }
  
  SpillForrigeSang() {
    this.tid = 0;
    if (this.currentIndex > 0) {
      this.SpillSang(this.currentIndex - 1, this.tid);
    }
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.tid  = this.audio.currentTime;
    console.log(this.tid);
  }
}

let playlist = new Playlist("Fredriks sanger", "spilleliste/Fred", []);

function loadPlaylistFromJSON(playlist, file) {
  fetch(file)
    .then(response => response.json())
    .then(data => {
      playlist.navn = data.navn;
      playlist.mappe = data.mappe;
      playlist.sanger = [];
      for (let sangData of data.sanger) {
        let sang = new Sang(sangData.artist, sangData.tittel, sangData.bildefil, sangData.lydfil);
        playlist.sanger.push(sang);
      }
      playlist.currentIndex = 0;
      playlist.audio.pause();
      playlist.isPlaying = false;
      playlist.tid = 0;

      let pspc = playlist.sanger[playlist.currentIndex];

      updateSpillerUI(pspc.artist,psps.tittel,pspc.bildeFil,0,playlist.audio.duration);
      winInit();
    })
    .catch(error => console.error(error));
}
function updateSpillerUI(artist, tittel, bildeFil, spilt, lengde) {
  let artistElement = document.querySelector(".artist");
  let tittelElement = document.querySelector(".navn");
  let coverElement = document.querySelector(".cover");
  let spillerElement = document.querySelector(".spiller");
  spillerElement.textContent = `${Math.floor(spilt / 60)}:${Math.floor(spilt % 60).toString().padStart(2, '0')} / ${Math.floor(lengde / 60)}:${Math.floor(lengde % 60).toString().padStart(2, '0')}`;
  artistElement.textContent = artist;
  tittelElement.textContent = tittel;
  coverElement.style.backgroundImage = `url(${bildeFil})`;
  document.body.style.backgroundImage = `url(${bildeFil})`;
  coverElement.style.backgroundSize = "contain";
  coverElement.style.backgroundPosition = "center";
}

window.onload = winInit;
  
 
function winInit(){
  let playButton = document.querySelector("#spill");
  let pauseButton = document.querySelector("#stopp");
  let nextButton = document.querySelector("#neste_sang");
  let prevButton = document.querySelector("#forrige_sang");

  let listButton = document.querySelector("#ListeButton");
  let GymButton = document.querySelector("#GymButton");
  playButton.addEventListener("click", function() {
      if (!playlist.isPlaying) {
        playlist.SpillSang(playlist.currentIndex, playlist.tid);
      }
  });
  pauseButton.addEventListener("click", function() {
    if (playlist.isPlaying) {
      playlist.pause();
      }
  });
  nextButton.addEventListener("click", function() {
    playlist.SpillNesteSang();
  });
  prevButton.addEventListener("click", function() {
    playlist.SpillForrigeSang();
  });
  listButton.addEventListener("click", function(){
    loadPlaylistFromJSON(playlist, "../spillelister/Fred.json");
  });
  GymButton.addEventListener("click", function(){
    loadPlaylistFromJSON(playlist, "../spillelister/Gym.json");
  });
}
