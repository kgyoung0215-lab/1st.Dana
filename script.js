let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let musicPlaying = false;

document.addEventListener("DOMContentLoaded", () => {

    bindConfig();

    makeTimeline();

    makeGallery();

    updateCountdown();

    setInterval(updateCountdown, 1000);

    fadeAnimation();

    initButtons();

    initProgressBar();

    initViewer();

    initMusic();

    initKakao();

    bindLocation();

    initMap();

    initNavigation();
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

    // el.innerHTML=
    //     `D-${days}<br>
    //     <small>${hours}h ${minutes}m ${seconds}s</small>`;

    el.innerHTML=
    `
    ${days}일<span class="dday-text"> 남았습니다.</span>`;

}



/* ===========================================
   Gallery
=========================================== */

function makeGallery(){

    const gallery = document.getElementById("gallery");

    if(!gallery) return;

    gallery.innerHTML = "";

    const previewCount = 9; 

    CONFIG.gallery.forEach((item, index) => {

        if(index >= previewCount) return;

        // wrapper 생성
        const wrapper = document.createElement("div");
        wrapper.className = "gallery-item";

        const img = document.createElement("img");
        img.src = item.image;
        img.loading = "lazy";

        wrapper.appendChild(img);

        // 마지막 미리보기면 +N 표시
        if(index === previewCount - 1 && CONFIG.gallery.length > previewCount){

            const more = document.createElement("div");
            more.className = "gallery-more";
            more.textContent = `+${CONFIG.gallery.length - previewCount}`;

            wrapper.appendChild(more);

        }

        wrapper.onclick = () => openViewer(index);

        gallery.appendChild(wrapper);

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

function openViewer(index){

    currentIndex=index;

    updateViewer();

    document
        .getElementById("viewer")
        .classList.add("active");

    document.querySelector(".floating-menu").classList.add("hide");

}

function updateViewer(){

    const item = CONFIG.gallery[currentIndex];

    const img = document.getElementById("viewerImage");

    const title = document.getElementById("viewerTitle");

    const date = document.getElementById("viewerDate");

    const desc = document.getElementById("viewerDesc");

    const count = document.getElementById("viewerCount");

    // 페이드 아웃
    img.style.opacity = 0;

    setTimeout(() => {

        img.src = item.image;

        title.textContent = item.title || "";

        date.textContent = item.date || "";

        desc.textContent = item.description || "";

        count.textContent = `${currentIndex + 1} / ${CONFIG.gallery.length}`;

        // 이미지 로딩 후 페이드 인
        img.onload = () => {
            img.style.opacity = 1;
        };

    }, 120);

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

/* ===========================================
   Progress Bar
=========================================== */

function initProgressBar(){

    const bar=document.getElementById("progressBar");

    window.addEventListener("scroll",()=>{

        const scrollTop=window.scrollY;

        const height=document.documentElement.scrollHeight-window.innerHeight;

        const percent=(scrollTop/height)*100;

        bar.style.width=percent+"%";

    });

}

function initViewer(){

    document.getElementById("closeBtn").onclick=closeViewer;

    document.querySelector(".viewer-bg").onclick=closeViewer;

    document.getElementById("prevBtn").onclick=prevImage;

    document.getElementById("nextBtn").onclick=nextImage;

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeViewer();

        }

        if(e.key==="ArrowLeft"){

            prevImage();

        }

        if(e.key==="ArrowRight"){

            nextImage();

        }

    });

    const viewerImage = document.getElementById("viewerImage");

    viewerImage.addEventListener("touchstart", (e) => {

        touchStartX = e.changedTouches[0].clientX;

    });

    viewerImage.addEventListener("touchend", (e) => {

        touchEndX = e.changedTouches[0].clientX;

        handleSwipe();

    });

}

function handleSwipe(){

    const distance = touchStartX - touchEndX;

    // 너무 조금 움직인 건 무시
    if(Math.abs(distance) < 50){
        return;
    }

    if(distance > 0){

        nextImage();

    }else{

        prevImage();

    }

}

function closeViewer(){

    document
        .getElementById("viewer")
        .classList.remove("active");

    document.querySelector(".floating-menu").classList.remove("hide");

}

function prevImage(){

    currentIndex--;

    if(currentIndex<0){

        currentIndex=CONFIG.gallery.length-1;

    }

    updateViewer();

}

function nextImage(){

    currentIndex++;

    if(currentIndex>=CONFIG.gallery.length){

        currentIndex=0;

    }

    updateViewer();

}

function initMusic(){
    
    const audio = document.getElementById("bgm");

    const btn = document.getElementById("musicBtn");

    btn.addEventListener("click", async () => {

        try{

            if(musicPlaying){

                audio.pause();

                btn.innerHTML = "🔇";

            }else{
                await audio.play();
                btn.innerHTML = "🎵";

            }

            musicPlaying = !musicPlaying;

        }catch(e){
            console.error(e);

        }

    });

}

function initKakao(){

    if(!window.Kakao) return;

    if(!Kakao.isInitialized()){

        Kakao.init(CONFIG.kakao.javascriptKey);

    }

    document
    .getElementById("shareBtn")
    .addEventListener("click",shareKakao);

}

function shareKakao(){

    Kakao.Share.sendCustom({
    templateId: 135204,
    templateArgs: {
        title: "다나의 첫 번째 이야기"
    }
    });

}



function formatCalendarDate(dateString){

    const d = new Date(dateString);

    const yyyy = d.getFullYear();

    const MM = String(d.getMonth()+1).padStart(2,"0");

    const dd = String(d.getDate()).padStart(2,"0");

    const hh = String(d.getHours()).padStart(2,"0");

    const mm = String(d.getMinutes()).padStart(2,"0");

    return `${yyyy}${MM}${dd}T${hh}${mm}00`;

}

function downloadICS(){

    const start = formatICSDate(CONFIG.eventDate);

    const end = formatICSDate(CONFIG.eventEndDate);

    const ics =
        `BEGIN:VCALENDAR
        VERSION:2.0
        BEGIN:VEVENT
        SUMMARY:${CONFIG.title}
        DESCRIPTION:${CONFIG.invitation}
        LOCATION:${CONFIG.address}
        DTSTART:${start}
        DTEND:${end}
        END:VEVENT
        END:VCALENDAR`;

    const blob = new Blob([ics], {type:"text/calendar"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "DanaBirthday.ics";

    link.click();

}

function formatICSDate(dateString){

    const d = new Date(dateString);

    const yyyy = d.getFullYear();

    const MM = String(d.getMonth()+1).padStart(2,"0");

    const dd = String(d.getDate()).padStart(2,"0");

    const hh = String(d.getHours()).padStart(2,"0");

    const mm = String(d.getMinutes()).padStart(2,"0");

    return `${yyyy}${MM}${dd}T${hh}${mm}00`;

}

function bindLocation(){

    document.getElementById("locationName").textContent =
        CONFIG.location.name;

    document.getElementById("locationAddress").textContent =
        CONFIG.location.address;

}

function initMap(){
    
    const position = new kakao.maps.LatLng(

        CONFIG.location.lat,

        CONFIG.location.lng

    );

    const map = new kakao.maps.Map(

        document.getElementById("map"),

        {

            center:position,

            level:3

        }

    );

    const marker = new kakao.maps.Marker({

        position:position

    });

    marker.setMap(map);

}

function initNavigation(){

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    document
        .getElementById("kakaoMapBtn")
        .onclick=openKakaoMap;

    document
        .getElementById("naverMapBtn")
        .onclick=openNaverMap;


    if (!isMobile) {
        document.getElementById("tmapBtn").style.display = "none";
    }else{
        document
            .getElementById("tmapBtn")
            .onclick=openTMap;
        }


}

function openKakaoMap(){

    const url =
        `https://map.kakao.com/link/to/${
            encodeURIComponent(CONFIG.location.name)
        },${CONFIG.location.lat},${CONFIG.location.lng}`;

    window.open(url);

}

function openNaverMap(){

    const url =
        `https://map.naver.com/v5/search/${
            encodeURIComponent(CONFIG.location.address)
        }`;

    window.open(url);

}

function openTMap() {

    const ua = navigator.userAgent.toLowerCase();

    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);

    let scheme = "";

    if (isAndroid) {

        scheme =
            `tmap://route?goalx=${CONFIG.location.lng}` +
            `&goaly=${CONFIG.location.lat}` +
            `&goalname=${encodeURIComponent(CONFIG.location.name)}`;

    } else if (isIOS) {

        scheme =
            `tmap://route?rGoX=${CONFIG.location.lng}` +
            `&rGoY=${CONFIG.location.lat}` +
            `&rGoName=${encodeURIComponent(CONFIG.location.name)}`;

    } else {

        // PC에서는 티맵 홈페이지
        window.open("https://www.tmap.co.kr/", "_blank");
        return;

    }

    // 앱 실행 시도
    window.location.href = scheme;

    // 앱이 없으면 스토어 이동
    setTimeout(() => {

        if (isAndroid) {

            window.location.href =
                "https://play.google.com/store/apps/details?id=com.skt.tmap.ku";

        } else {

            window.location.href =
                "https://apps.apple.com/kr/app/tmap/id431589174";

        }

    }, 1200);

}

async function submitAttendance() {

    const name =
        document.getElementById("attName").value.trim();

    if (!name) {

        alert("성함을 입력해주세요.");
        return;

    }

    const data = {

        name,

        attend:
            document.getElementById("attAttend").value,

        people:
            Number(document.getElementById("attPeople").value),

        message:
            document.getElementById("attMessage").value

    };

    const ok = await window.saveAttendance(data);

    if (ok) {

        alert("참석 여부가 전달되었습니다 😊");

        document.getElementById("attName").value = "";
        document.getElementById("attMessage").value = "";

    } else {

        alert("저장 실패");

    }

}

function saveCalendar() {

    const ua = navigator.userAgent.toLowerCase();

    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isAndroid) {

        openGoogleCalendar();

    } else {

        downloadICS();

    }

}

function openGoogleCalendar() {

    const start = "20260809T020000Z";
    const end = "20260809T050000Z";

    const title = encodeURIComponent("다나 첫 돌잔치");

    const details = encodeURIComponent(
        "다나의 첫 번째 생일에 초대합니다."
    );

    const location = encodeURIComponent(
        "경기도 광명시 일직로 43 리뉴아 GIDC C동 12층"
    );

    const url =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${title}` +
        `&dates=${start}/${end}` +
        `&details=${details}` +
        `&location=${location}`;

    window.open(url, "_blank");

}

function downloadICS() {

    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:다나 첫 돌잔치
DTSTART:20260809T020000Z
DTEND:20260809T050000Z
LOCATION:경기도 광명시 일직로 43
DESCRIPTION:다나의 첫 번째 생일에 초대합니다.
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], {
        type: "text/calendar"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "DanaBirthday.ics";

    a.click();

    URL.revokeObjectURL(url);

}