// request MIDI access
var entradas=[];
var salidas=[];
var MIDIkeyChannel=144;
var MIDIKnobChannel=176;
var MIDIButtonChannel=137;//153;
var encoders=false;




function bus1message(m){// IAC message
  var data = m.data;

  if(data[0]==144){
    if(data[2]==64||data[2]==0){return}
    var v=Math.round((data[2]/256+0.5)*1000)/1000;
    //ponVisual(data[1],data[2]);
  }else {}//paranota
}

function onMIDIMessage(m){ /// midi keyboard message

  data = m.data;

  if(mapping){
    mapea(m);///// MAPEANDO
        return
  }

  if(data[0]==MIDIkeyChannel){// toco teclas
    //if(data[2]==64){return}
    if(data[2]==0) {
    //  paranota(data[1])
    }else{
      tocanota(data[1],data[2])
      ponVisual(data[1],data[2]);
    }
  }else if(data[0]==MIDIKnobChannel){// toco otras cosas

    mueveknob(m);////////////////////   MUEVE KNOB  /////////
  }else if(data[0]==128){
    //paranota(data[1])
  }else if(data[0]==MIDIButtonChannel){
    mueveknob(m)
  }else{
      //console.log("unIdentified midi data: "+data);   NYAPAA!!
        m.data[0]=MIDIButtonChannel;                 
      mueveknob(m)
  }
  console.log("data: "+data)
}
