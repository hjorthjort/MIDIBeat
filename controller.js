function init() {
    var defaultSamples = [
        "http://s1download-universal-soundbank.com/mp3/sounds/4510.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4511.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4514.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8693.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8716.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8717.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8718.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8719.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8721.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8751.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8753.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8754.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8755.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8759.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8760.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8761.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/8762.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4767.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4769.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4770.mp3",
        "http://s1download-universal-soundbank.com/mp3/sounds/4773.mp3"

    ];
    //Create an array with all the key indexes
    var keys = [];
    for (var i = 21; i <= 108; i++) {
        keys.push( i );
    }
    var buttonNumber = 0;

    var beatpad = document.getElementById("beatpad");
    for ( ; buttonNumber < 16; buttonNumber++) {
        beatpad.innerHTML += "<div id='" + buttonNumber + "' class='drumpad' onMouseDown=\"playKey(" + buttonNumber + ")\" onMouseUp=\"setDrumpadInactive(" + buttonNumber +")\">";
        beatpad.innerHTML += "</div>";
        sampleLibrary.setWebSample(buttonNumber, defaultSamples[buttonNumber % defaultSamples.length], true);
    }

    var knobs = document.getElementById("knobs");
    for ( ; buttonNumber < 48; buttonNumber++ ) {
        knobs.innerHTML += "<div class='twist' id='" + buttonNumber + "' onMouseDown='playKey(" + buttonNumber + ")' onMouseUp='setDrumpadInactive(" + buttonNumber + ")'>" +
            "<div class='circlebase type1'></div>" +
            "</div>";
        sampleLibrary.setWebSample(buttonNumber, defaultSamples[buttonNumber % defaultSamples.length], true);
    }

    buttonNumber = 48;
    var pianoContainer = document.getElementById("piano-container");
    for ( keyCount = 0 ; buttonNumber < 110; buttonNumber++, keyCount++ ) {
        var htmlString = "<li>";
        htmlString += "<div class=white id ='" + buttonNumber +"' onMouseDown='playKey(" + buttonNumber + ")' onMouseUp='setDrumpadInactive(" + buttonNumber + ")'></div>";
        if (!(keyCount % 7 == 2 || keyCount % 7 == 6)) {
            sampleLibrary.setWebSample(buttonNumber, defaultSamples[buttonNumber % defaultSamples.length], true);
            buttonNumber++;
            htmlString += "<div class=black id ='" + buttonNumber +"' onMouseDown='playKey(" + buttonNumber + ")' onMouseUp='setDrumpadInactive(" + buttonNumber + ")'></div>";
        }
        htmlString += "</li>";
        pianoContainer.innerHTML += htmlString;
        sampleLibrary.setWebSample(buttonNumber, defaultSamples[buttonNumber % defaultSamples.length], true);
    }
    jQuery("input#fileChooser").change(function () {
        chooseLocal(sampleLibrary.chosenKey);
    });

    setCurrent(0);
}

function setCurrent(keyNumber) {
    var note = calcNoteFromNumber(keyNumber);
    sampleLibrary.chosenKey = keyNumber;
    $('#currentKey').html(note);
}

function dropboxChooser() {
    chooseDropbox(sampleLibrary.chosenKey);
}

function localChooser() {
    document.getElementById("fileChooser").click();
}

function chooseDropbox(buttonNumber) {
    var options = {
        success: function(files) {
            sampleLibrary.setSample(buttonNumber, files[0]);
        },
        multiselect: false,
        linkType: "direct",
        extenstions: ['audio'],
    }
    Dropbox.choose(options);
}

function chooseLocal(buttonNumber) {
    var file = document.getElementById("fileChooser").files[0];
    var value = {};
    value["link"] = window.URL.createObjectURL(file);
    console.log(file);
    value["name"] = file.name;
    sampleLibrary.setSample(buttonNumber, value);
    clearLocal(buttonNumber);
}

function clearLocal(buttonNumber) {
    document.getElementById("fileChooser").value = "";
}

function playKey(key, velocity) {
    velocity = typeof velocity !== 'undefined' ? velocity : 255;
    sampleLibrary.play(key, velocity);
    // setDrumpadInactive(oldKey);  
    setDrumpadActive(key);
    setCurrent(key);
}

function setDrumpadActive(id) {
    var noteNumber = sampleLibrary.chosenKey;
    var sampleName;
    if (sampleLibrary.metadata[noteNumber])
        sampleName = sampleLibrary.metadata[noteNumber].name;
    else
        sampleName = "empty";
    setLcd(noteNumber, sampleName);
    $("#"+id).css("box-shadow", "-1px 0 15px rgba(0, 0, 0, .7) inset");
    $("#"+id).css("-webkit-box-shadow", "-1px 0 15px rgba(0, 0, 0, .7) inset");
    $("#"+id).css("-moz-box-shadow", "-1px 0 15px rgba(0, 0, 0, .7) inset");
    $("#"+id).css("-ms-box-shadow", "-1px 0 15px rgba(0, 0, 0, .7) inset");
}

function setDrumpadInactive(id) {
    $("#"+id).css("box-shadow", "");
    $("#"+id).css("-webkit-box-shadow", "");
    $("#"+id).css("-moz-box-shadow", "");
    $("#"+id).css("-ms-box-shadow", "");
    clearLcd();
}

function webChooser(){

  var url = $('#web-url').val();
  var start = $('#web-url-start').val();
  var stop = $('#web-url-stop').val();
  var keyNum = sampleLibrary.chosenKey;

      if ($('#web-url').val()==="") {
        console.log("no url");
      }
      else {
        chooseWebURL(keyNum, url);
        setStartAndStop(keyNum, start, stop);

      }
}

// (50, 'https://p.scdn.co/mp3-preview/254eae7ce1d3ee59c411bb97f47b5a8fb9a893b3')
function chooseWebURL(keyNum, url){
  sampleLibrary.setWebSample(keyNum, url);
}

function setStartAndStop(key, start, stop){

  if(start>=0 && stop <30){
    sampleLibrary.setStartStop(key, start, stop);
  }
  else {
    console.log("nope");
  }
}

function setLcd(noteNumber, name) {
    var note = calcNoteFromNumber(noteNumber);
    $(noteName).html(note);
    $(fileName).html(name);
}

function clearLcd() {
    $(noteName).empty();
    $(fileName).empty();
}

function calcNoteFromNumber(number) {
    number = number;
    var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var octave = Math.floor(number / 12);
    var note = notes[number % 12];
    return "" + note + octave;
}
