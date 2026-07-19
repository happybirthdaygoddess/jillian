/* ==========================================
   Birthday Cake Decorator
   cake.js
   PART 1 / 3
========================================== */

// --------------------
// Elements
// --------------------

const cake = document.getElementById("cake");
const decorations = document.getElementById("decorations");

const tools = document.querySelectorAll(".tool");

const clearBtn = document.getElementById("clearBtn");
const confettiBtn = document.getElementById("confettiBtn");
const saveBtn = document.getElementById("saveBtn");
const homeBtn = document.getElementById("homeBtn");

// --------------------
// Back Home
// --------------------

homeBtn.addEventListener("click", () => {

    window.location.href = "index.html";

});

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// --------------------
// Variables
// --------------------

let selectedDecoration = null;

// Decoration emojis

const decorationIcons = {

    strawberry:"🍓",

    flower:"🌸",

    heart:"💖",

    star:"⭐",

    candle:"🕯️",

    sprinkle:"✨",

    chocolate:"🍫",

    blueberry:"🫐"

};

// --------------------
// Select Decoration
// --------------------

tools.forEach(button=>{

    button.addEventListener("click",()=>{

        tools.forEach(b=>b.classList.remove("selected"));

        button.classList.add("selected");

        selectedDecoration = button.dataset.item;

    });

});

// --------------------
// Place Decoration
// --------------------

cake.addEventListener("click",(e)=>{

    if(!selectedDecoration) return;

    // Ignore clicks on existing decoration
    if(e.target.classList.contains("decoration")) return;

    const rect = cake.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    addDecoration(x,y,selectedDecoration);

});

// --------------------
// Add Decoration
// --------------------

function addDecoration(x,y,type){

    const item = document.createElement("div");

    item.className = "decoration";

    item.textContent = decorationIcons[type];

    item.style.left = x + "px";

    item.style.top = y + "px";

    item.dataset.type = type;

    decorations.appendChild(item);

    enableDragging(item);

    enableDelete(item);

    // Chocolate drizzle

    if(type==="chocolate"){

        item.style.fontSize="38px";

    }

    // Candle

    if(type==="candle"){

        item.style.fontSize="34px";

    }

    // Sprinkle

    if(type==="sprinkle"){

        createSprinkles(x,y);

        item.remove();

    }

}

// --------------------
// Sprinkle Generator
// --------------------

function createSprinkles(x,y){

    for(let i=0;i<8;i++){

        const s=document.createElement("div");

        s.className="decoration";

        s.textContent="✨";

        s.style.left=(x+random(-18,18))+"px";

        s.style.top=(y+random(-18,18))+"px";

        s.style.fontSize="18px";

        decorations.appendChild(s);

        enableDragging(s);

        enableDelete(s);

    }

}

// --------------------
// Random Helper
// --------------------

function random(min,max){

    return Math.floor(Math.random()*(max-min+1))+min;

}
/* ==========================================
   Birthday Cake Decorator
   cake.js
   PART 2 / 3
========================================== */

// --------------------
// Drag Decorations
// --------------------

function enableDragging(item){

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener("mousedown", startDrag);
    item.addEventListener("touchstart", startDragTouch, {passive:false});

    function startDrag(e){

        dragging = true;

        const rect = item.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);

        item.style.zIndex = 999;
    }

    function drag(e){

        if(!dragging) return;

        const cakeRect = cake.getBoundingClientRect();

        let x = e.clientX - cakeRect.left - offsetX;
        let y = e.clientY - cakeRect.top - offsetY;

        x = Math.max(0, Math.min(x, cakeRect.width - item.offsetWidth));
        y = Math.max(0, Math.min(y, cakeRect.height - item.offsetHeight));

        item.style.left = x + "px";
        item.style.top = y + "px";
    }

    function stopDrag(){

        dragging = false;

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);

        item.style.zIndex = "";
    }

    // ---------- Mobile ----------

    function startDragTouch(e){

        e.preventDefault();

        dragging = true;

        const touch = e.touches[0];

        const rect = item.getBoundingClientRect();

        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        document.addEventListener("touchmove", dragTouch,{passive:false});
        document.addEventListener("touchend", stopTouch);

        item.style.zIndex = 999;
    }

    function dragTouch(e){

        if(!dragging) return;

        e.preventDefault();

        const touch = e.touches[0];

        const cakeRect = cake.getBoundingClientRect();

        let x = touch.clientX - cakeRect.left - offsetX;
        let y = touch.clientY - cakeRect.top - offsetY;

        x = Math.max(0, Math.min(x, cakeRect.width - item.offsetWidth));
        y = Math.max(0, Math.min(y, cakeRect.height - item.offsetHeight));

        item.style.left = x + "px";
        item.style.top = y + "px";
    }

    function stopTouch(){

        dragging = false;

        document.removeEventListener("touchmove", dragTouch);
        document.removeEventListener("touchend", stopTouch);

        item.style.zIndex = "";
    }

}

// --------------------
// Delete Decoration
// --------------------

function enableDelete(item){

    item.addEventListener("dblclick",()=>{

        item.remove();

    });

    item.addEventListener("contextmenu",(e)=>{

        e.preventDefault();

        item.remove();

    });

}

// --------------------
// Clear Cake
// --------------------

clearBtn.addEventListener("click",()=>{

    decorations.innerHTML="";

});

// --------------------
// Keyboard Shortcut
// --------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Delete"){

        if(confirm("Clear all decorations?")){

            decorations.innerHTML="";

        }

    }

});

// --------------------
// Small Bounce Animation
// --------------------

document.addEventListener("click",(e)=>{

    if(!e.target.classList.contains("decoration")) return;

    e.target.animate([
        {transform:"scale(1)"},
        {transform:"scale(1.2)"},
        {transform:"scale(1)"}
    ],{
        duration:200
    });

});
/* ==========================================
   Birthday Cake Decorator
   cake.js
   PART 3 / 3
========================================== */

// --------------------
// Auto Select First Tool
// --------------------

if (tools.length > 0) {
    tools[0].click();
}

// --------------------
// Celebrate Button
// --------------------

confettiBtn.addEventListener("click", () => {

    popup.classList.remove("hidden");

    if (typeof confetti === "function") {

        confetti({
            particleCount: 180,
            spread: 120,
            origin: { y: 0.6 }
        });

        setTimeout(() => {

            confetti({
                particleCount: 120,
                angle: 60,
                spread: 70,
                origin: { x: 0 }
            });

            confetti({
                particleCount: 120,
                angle: 120,
                spread: 70,
                origin: { x: 1 }
            });

        }, 300);

    }

});

// --------------------
// Close Popup
// --------------------

closePopup.addEventListener("click", () => {

    popup.classList.add("hidden");

});

// --------------------
// Save Cake
// --------------------

saveBtn.addEventListener("click", () => {

    alert(
`📸 Screenshot Time!

para masave mo cake mo, edi ano pa:

pag phone:
edi ss mo lang duh tapos send m sakin para ma story q

kung naka laptop or pc:
Press Win + Shift + S

kapag naman mac computer:
Press Cmd + Shift + 4


Happy Birthday Jillian! 🎂💖`
    );

});

// --------------------
// Random Floating Hearts
// --------------------

setInterval(() => {

    const heart = document.createElement("div");

    heart.textContent = "💖";

    heart.style.position = "fixed";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.bottom = "-40px";
    heart.style.fontSize = "24px";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "9999";

    document.body.appendChild(heart);

    heart.animate([
        {
            transform: "translateY(0)",
            opacity: 1
        },
        {
            transform: "translateY(-120vh)",
            opacity: 0
        }
    ], {
        duration: 5000,
        easing: "linear"
    });

    setTimeout(() => {

        heart.remove();

    }, 5000);

}, 900);
