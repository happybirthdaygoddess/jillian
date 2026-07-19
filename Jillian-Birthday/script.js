/* =====================================================
   JILLIAN BIRTHDAY WEBSITE
   script.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const letter = document.getElementById("letter");
    const overlay = document.getElementById("overlay");

    const openLetter = document.getElementById("openLetter");
    const closeLetter = document.getElementById("closeLetter");

    /* ==========================================
       LETTER MODAL
    ========================================== */

    function openModal(){

        letter.classList.add("show");
        overlay.classList.add("show");

        document.body.style.overflow = "hidden";

    }

    function closeModal(){

        letter.classList.remove("show");
        overlay.classList.remove("show");

        document.body.style.overflow = "";

    }

    openLetter.addEventListener("click", openModal);

    closeLetter.addEventListener("click", closeModal);

    overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeModal();

        }

    });

    /* ==========================================
       PARALLAX BACKGROUND
    ========================================== */

    const blur1 = document.querySelector(".blur1");
    const blur2 = document.querySelector(".blur2");
    const blur3 = document.querySelector(".blur3");

        window.addEventListener("mousemove",(e)=>{

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blur1.style.transform =
            `translate(${x*-30}px,${y*-30}px)`;

        blur2.style.transform =
            `translate(${x*25}px,${y*25}px)`;

        blur3.style.transform =
            `translate(${x*-15}px,${y*20}px)`;

    });

    /* ==========================================
       PHOTO HOVER EFFECT
    ========================================== */

    const photos = document.querySelectorAll(".photo-card");

    photos.forEach(photo=>{

        photo.addEventListener("mouseenter",()=>{

            photo.style.zIndex="10";

        });

        photo.addEventListener("mouseleave",()=>{

            photo.style.zIndex="1";

        });

    });

    /* ==========================================
       BUTTON RIPPLE
    ========================================== */

    document.querySelectorAll("button").forEach(button=>{

        button.addEventListener("click",(e)=>{

            const circle = document.createElement("span");

            const size = Math.max(
                button.clientWidth,
                button.clientHeight
            );

            const rect = button.getBoundingClientRect();

            circle.style.width = size + "px";
            circle.style.height = size + "px";

            circle.style.left =
                e.clientX - rect.left - size / 2 + "px";

            circle.style.top =
                e.clientY - rect.top - size / 2 + "px";

            circle.classList.add("ripple");

            button.appendChild(circle);
                        setTimeout(()=>{

                circle.remove();

            },600);

        });

    });

});

