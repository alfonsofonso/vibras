//// main.js by alf

//////////////////////////////////////////   variables  globales   //////////////////////////////


var mainVol=1;
var notaBase=36;// 
var numeroDeOctavas=5;																																																																																																			
var nubes=[]; /// vibes
var numNubes=3;
var maxNubes=3;
var duracion=5;
let duraMax=5;
let	modoMax=4;
var escalas=[//// las encontraras en generators.js de lissajousJS
 "octave",'fifth','tritone',  
 'minor', 'sus2', 'fouths','major', "augmented",

 "minor7",'minor6','dim','minorflat5','sus4',
 'major7','major6','dominant','dominantflat5',

 'hexatonic','wholetone',
 
 'ionian','melodicminor','diminished',
 'pentatonicmajor','pentatonicminor', 'blues','bebopmajor','bebopminor',
 ,'flamenco','altered','bebopdominant','bebopdominantflatnine',
 'chromatic'
];
var aroma="fifth";
var arrMomentos;
var historia=[[numNubes,aroma,duracion]];
var momentoHistorico=0;
var healing=false;
var aleatori=false;
var solapamiento=2;
var nombresNotas=["C", "Db", "D", "Eb", "E","F", "Gb", "G", "Ab", "A", "Bb", "B" ];
var ombak=2;
var ffreq=22;
var velocidad=350 //velocidad del sonido en el medio considerando una temperatura corporal normal 
let cicles=0;
//////////////////////////////////////////     url vars   //////////////////////////////
var jurl = new URL(window.location.href);
const params = new URLSearchParams(jurl.search);
const jbs=params.get('jbs'); // 
const grs=params.get("grs"); // 
const hrs=params.get("hrs");
console.log("jbs,grs,hrs:",jbs,grs,hrs)


//////////////////////////////////////////     main functions   //////////////////////////////


function creaArr(){//segun numNubes / vibes / notas	
	for(var i=0;i<numNubes;i++){
		if(i%2==0){ //media nota
			nubes[i]=new track();
			var d=eval("walk."+yuxtapon(aroma)+"("+notaBase+","+numeroDeOctavas+")");
			nubes[i].beat(duracion*10).notes(d).nl(duracion*(solapamiento+10))
				.adsr(duracion/.3,duracion/.3,.3,duracion/.3).vol(mainVol*0.4/nubes.length).lp(ffreq,10,130)	
		}else{	// la otra media (con ombak)
			nubes[i]=new track();
			var d=eval("walk."+yuxtapon(aroma)+"("+notaBase+","+numeroDeOctavas+")");
			nubes[i].beat(duracion*10).notes(d).nl(duracion*(solapamiento+10))
				.adsr(duracion/.3,duracion/.3,.3,duracion/.3).vol(mainVol*0.4/nubes.length)
				.lp(ffreq,10,130).trans(Math.random()*ombak)
		
		}	
	};	
	console.log("vibes: "+numNubes+" dur: "+duracion+" mode: "+aroma)
	return [numNubes,aroma,duracion]
}


function destruyeArr(){// vacia nubes
	console.log("end vibes: "+nubes.length)
	for(var i=0;i<nubes.length;i++){
		nubes[i].destroy();
		delete nubes[i];
	};	
	nubes=[];
}

dale= function(arr){

	if(healing==true){			//stop
		healing=false;
		document.getElementById('botHeal').style.backgroundColor = "rgba(20,20,100,0.4)";
		document.getElementById('botHeal').style.color = "rgba(20,20,256,1)";

		return
	}else{						//play
		healing=true;
		 document.getElementById('botHeal').style.backgroundColor = "#b8fe1e99";
		 document.getElementById('botHeal').style.color = "rgba(20,20,256,.4)";
		if (arr==undefined||arr=={}){// nueva seccion
			
			if(aleatori){
				aleatoria()
			}
			velSpacial=duracion*1490;//a 10bpm
			historia.push(creaArr());///// aquí la crea!!!!
			momentoHistorico++;
			console.log("nuevo momento: ",momentoHistorico)
		}else{// repito seccion
			arrMomentos.numNubes=numNubes;
			arrMomentos.aroma=aroma;
			arrMomentos[2].duracion=duracion;
			velSpacial=duracion*20000;//a 10bpm
			momentoHistorico=historia.indexOf(arrMomentos);
			creaArr();
			console.log("momentoHistorico= ",momentoHistorico)
		}
	}
}

let ciclSpan = document.getElementById("ciclSpan");
console.log(ciclSpan)

					//////////////////   SLIDERS    //////////				


var duraSlid = document.getElementById("duraSli");  ///////////     ALPHA
var duraSpan = document.getElementById("duraSpan");
duraSlid.addEventListener('input', debounceDura(function(event) {
    console.log("notabase",notaBase);	
  	resetea();
},1000));/// el 1000 es el delay
function debounceDura(func, wait) {
    let timeout;
    return function(...args) {	
		if(duraSlid.value >= duraMax ) {
		this.value = duraMax;
		}
		duracion=parseInt(duraSlid.value);
  		duraSpan.innerText=duracion;
		replega();
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}


var armoSlid = document.getElementById("armoSli");  //////     Armonics
var armoSpan = document.getElementById("armoSpan");
armoSlid.addEventListener('input', debounceArmo(function(event) {
    console.log("armonics",numNubes);
	resetea();
}, 1000));
function debounceArmo(func, wait,notabase) {//para evitar sobredosi
    let timeout;
    return function(...args) {
		if(armoSlid.value >= maxNubes ) {
			armoSlid.value = maxNubes;
			}
		numNubes=parseInt(armoSlid.value);
		armoSpan.innerText=armoSlid.value;
   		replega();
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}


var modoSlid = document.getElementById("modoSli");			/////    Modo
var modoSpan = document.getElementById("modoSpan");
modoSlid.addEventListener('input', debounceModo(function(event) {
	resetea();
},1000));
function debounceModo(func, wait) {
    let timeout;
    return function(...args) {
		if(modoSlid.value >= modoMax ) {
			this.value = modoMax;
			}
 		aroma=escalas[parseInt(modoSlid.value)];
		console.log("aroma")
		modoSpan.innerText=escalas.indexOf(aroma);
		replega();
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

var baseSlid = document.getElementById("baseSli");  //////     estatura
var baseSpan = document.getElementById("baseSpan");
baseSlid.addEventListener('input', debounceBase(function(event) {
    console.log("notabase",notaBase);
	resetea();
}, 1000));
function debounceBase(func, wait,notabase) {//para evitar sobredosi
    let timeout;
    return function(...args) {
		notaBase=parseInt(dameNB(baseSlid.value)+24);
		baseSpan.innerText=baseSlid.value;
   		replega();
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}


var solaSlid = document.getElementById("solaSli");  ///      solapamiento
var solaSpan = document.getElementById("solaSpan");
solaSlid.addEventListener('input', debounceSola(function(event) {
	console.log('solapamiento', solapamiento); 	
	 resetea()
},1000));
function debounceSola(func, wait) {
    let timeout;
    return function(...args) {
		solapamiento=parseInt(solaSlid.value);
  		solaSpan.innerText=solapamiento;
	 	replega();
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}



//////////////////////////////////////////     inicio    //////////////////////////////


function empieza(){// on load
	console.log("empiezo")
	context.resume();
	clock.tempo=100;
}

function initHeal(){/// on Button Vibras click
	if(context.state!="runing"){
		context.resume();
	}
	destruyeArr();
	dale();
}


				//////////////////////////////    helpers   	///////////////////


function resetea(){
	healing=false;
	initHeal()
}

function replega(){
	console.log("replego",stage.children)
	if(stage.children.length==0){return}
	for (let i = 0; i < nubes.length; i++) {
		viaja(stage.children[i],423,-2.1,2,333);
		console.log("stop")
	  }
}

retrocede=function(arr){
	dale(historia[momentoHistorico-1])
}

function aleatoria(){
	numNubes=Math.ceil(Math.random()*maxNubes);
	aroma=escalas[Math.floor(Math.random()*escalas.length)];
	duracion=Math.ceil(Math.random()*duraMax);
	poliSlid.value=numNubes;poliSpan.innerText=numNubes;
	escaSlid.value=escalas.indexOf(aroma);
	escaSpan.innerText=aroma;
	duraSlid.value=duracion;duraSpan.innerText=duracion;
}


volumenSounds=function(volu){
	mainVol=volu;
	for(var i=0;i<numNubes;i++){
	nubes[i].vol(mainVol*0.2/nubes.length)
	}
}

function dameNB(estatura){
	//realizar calculos espina
	let espina=estatura*.6;
	let nume=100*(100/espina)-75;//...
	
	return Math.ceil(nume)/5
}

yuxtapon=function(q){
 return q=q.replace(/\s/g, '');

}

function home(){
	window.open('https://www.plantavibras.com' , '_blank').focus();
	console.log("casa")
}

