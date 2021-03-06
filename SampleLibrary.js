function SampleLibrary() {
    this.chosenKey = 1;
    this.samples = {};
    this.metadata = {};
    //this.start = 0;
    //this.stop = 30;

}
SampleLibrary.prototype.setSample = function(key, value) {
    if (value) {
        this.samples[key] = new Audio(value.link);
    }
    this.metadata[key] = value;
}

SampleLibrary.prototype.setWebSample = function(key, value) {
    var newName = 'Web: ' + value.replace(/^.*(\/.*\/)/g, '');
    var valueObject = {
        link: value,
        name: newName,
    };
    this.setSample(key, valueObject);
}


SampleLibrary.prototype.play = function (key, velocity) {
    var audio = this.samples[key];
    audio.volume = velocity/255;
    this.chosenKey = key;

    if(audio.hasOwnProperty('start')){
      console.log("yesss");
      audio.play();
      int = setInterval(function() {
            if (audio.currentTime > audio.stop) {
                audio.pause();
                clearInterval();
            }
      	}, 10);
      audio.currentTime = audio.start;
    }

    if (!audio.hasOwnProperty('start')) {
        audio.currentTime = 0;
		    audio.play();
    }

}

SampleLibrary.prototype.setStartStop = function (key, start, stop){
  this.samples[key].start = start;
  this.samples[key].stop = stop;
}

SampleLibrary.setVolume = function (newVol) {
    var sample = this.samples[this.chosenKey];
    if (sample) {
        sample.volume = newVol;
    }
}
