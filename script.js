document.addEventListener("DOMContentLoaded", () => {

    bindConfig();

    makeGallery();

    updateCountdown();

    setInterval(updateCountdown, 1000);

    fadeAnimation();

    initButtons();

    makeTimeline();

});



/* ===========================================
   CONFIG 적용
=========================================== */

function bindConfig(){

    setText("childName", CONFIG.childName);
    setText("dateText", CONFIG.dateText);
    setText("quote", CONFIG.quote);

    setText("invitationText", CONFIG.invitation);
    setText("storyText", CONFIG.story);

    setText("scheduleDate", CONFIG.dateText);
    setText("scheduleTime", CONFIG.timeText);
    setText("scheduleHall", CONFIG.hall);

}



function setText(id,value){

    const el=document.getElementById(id);

    if(el){

        el.innerText=value;

    }

}



/* ===========================================
   D-Day
=========================================== */

function updateCountdown(){

    const target=new Date(CONFIG.eventDate);

    const now=new Date();

    const diff=target-now;

    const el=document.getElementById("countdown");

    if(!el)return;

    if(diff<0){

        el.innerHTML="🎉 D-Day";

        return;

    }

    const days=Math.floor(diff/(1000*60*60*24));

    const hours=Math.floor(diff/(1000*60*60)%24);

    const minutes=Math.floor(diff/(1000*60)%60);

    const seconds=Math.floor(diff/1000%60);

    el.innerHTML=
        `D-${days}<br>
        <small>${hours}h ${minutes}m ${seconds}s</small>`;

}



/* ===========================================
   Gallery
=========================================== */

function makeGallery(){

    const gallery=document.getElementById("gallery");

    if(!gallery)return;

    gallery.innerHTML="";

    CONFIG.gallery.forEach(src=>{

        const img=document.createElement("img");

        img.src=src;

        img.loading="lazy";

        img.onclick=()=>openViewer(src);

        gallery.appendChild(img);

    });

}



/* ===========================================
   Fade
=========================================== */

function fadeAnimation(){

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{
        threshold:.15
    });

    document.querySelectorAll(".fade").forEach(el=>{

        observer.observe(el);

    });

}



/* ===========================================
   BUTTON
=========================================== */

function initButtons(){

    const phoneButtons=document.querySelectorAll("[data-phone]");

    phoneButtons.forEach(btn=>{

        btn.onclick=()=>{

            location.href="tel:"+btn.dataset.phone;

        }

    });

}



/* ===========================================
   IMAGE VIEWER
=========================================== */

function openViewer(src){

    let viewer=document.getElementById("viewer");

    if(!viewer){

        viewer=document.createElement("div");

        viewer.id="viewer";

        viewer.innerHTML=`

        <div class="viewer-bg"></div>

        <img>

        `;

        document.body.appendChild(viewer);

        viewer.onclick=()=>viewer.remove();

    }

    viewer.querySelector("img").src=src;

    
}

function makeTimeline(){
    const wrap=document.getElementById("timeline");

    if(!wrap) return;

    wrap.innerHTML="";

    CONFIG.timeline.forEach(item=>{

        wrap.innerHTML += `

        <div class="timeline-item fade">

            <div class="timeline-dot"></div>

            <div class="timeline-card">

                <span class="timeline-date">
                    ${item.date} 
                </span>

                <h3>
                    ${item.title}
                </h3>
                <img src="${item.image}" />   
                <p>
                    ${item.description}
                </p>

            </div>

        </div>

        `;

    });
    fadeAnimation();

}