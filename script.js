

let video=document.querySelector("video");
let mediaRecorder;
let recordbtn=document.querySelector("#record");
let recDiv=recordbtn.querySelector("div");
let capturebtn=document.querySelector("#capture");
let capDiv=capturebtn.querySelector("div");
let body=document.querySelector("body");
let appiledFilters;
let filters=document.querySelectorAll(".filter");
let zoomInBtn=document.querySelector(".zoom-in")
let zoomOutBtn=document.querySelector(".zoom-out");
let currZoom=1;
let minZoom=1;
let maxZoom=3;
zoomInBtn.addEventListener("click",function(e){
   if(currZoom<maxZoom)
   {
       currZoom=currZoom+0.1;
   }
   video.style.transform=`scale(${currZoom})`;
});
zoomOutBtn.addEventListener("click",function(e){
   if(currZoom>minZoom)
   {
       currZoom=currZoom-0.1;
   }
   video.style.transform=`scale(${currZoom})`;
});

let chunks=[];
let isRecording=false;
recordbtn.addEventListener("click",function(e){
    if(isRecording){
        mediaRecorder.stop();
        isRecording=false;
        recDiv.classList.remove("record-animation");
    }
    else{    
        mediaRecorder.start();
        appiledFilters="";
        removeFilter();
        currZoom=1;
        video.style.transform=`scale(${currZoom})`;
        isRecording=true;
        recDiv.classList.add("record-animation");
    }
});
for(let i=0;i<filters.length;i++){
    filters[i].addEventListener("click",function(e){
        removeFilter();
    appiledFilters = e.currentTarget.style.backgroundColor;
    let div= document.createElement("div");
    div.style.backgroundColor=appiledFilters;
    div.classList.add("filter-div");
    body.append(div);
    });
}
// stopbtn.addEventListener("click",function(){
//     mediaRecorder.stop();
// });
capturebtn.addEventListener("click",function(e){
    // jo bhi screen pe image hai usko save krwane ke liye ye event
    if(isRecording){
        return;
    }
    capDiv.classList.add("capture-animation");
    setTimeout(()=>{
    capDiv.classList.remove("capture-animation")
    },1000);
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0);
    
    if(appiledFilters)
    {
        tool.fillStyle=appiledFilters;
        tool.fillRect(0,0,canvas.width,canvas.height);

    }
    let link=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=link;
    a.download="img.png"
    a.click();
    a.remove();
    canvas.remove
});

/// permission kaise le camera ka uske liye ye sab aur video download kaise kare
navigator.mediaDevices
.getUserMedia({video:true,audio:false})
.then(function(mediaStream){

   mediaRecorder= new MediaRecorder(mediaStream);
   video.srcObject= mediaStream ;
   mediaRecorder.addEventListener('dataavailable',function(e){
     chunks.push(e.data);
   });
   mediaRecorder.addEventListener('stop',function(e){
       let blob= new Blob(chunks,{type:"video/mp4"});
       chunks=[];
       let a=document.createElement("a");
       let url=window.URL.createObjectURL(blob);
       a.href=url;
       a.download="video/mp4";
       a.click();
       a.remove();
   });
})
.catch(function(err){
    console.log(err);
})
function removeFilter(){
    let Filter=document.querySelector(".filter-div");
    if(Filter){
        Filter.remove();
    }
}