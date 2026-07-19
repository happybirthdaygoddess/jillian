/* ==========================================
   Shared Music Manager
   music.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const music = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    if (!music || !musicBtn) return;

    const TARGET_VOLUME = 0.15;

    music.volume = TARGET_VOLUME;

    const savedTime = parseFloat(localStorage.getItem("musicTime")) || 0;
    const shouldPlay = localStorage.getItem("musicPlaying") === "true";

    music.currentTime = savedTime;

    if (shouldPlay) {

        music.play().then(() => {

            musicBtn.textContent = "🔇 Pause Music";

        }).catch(() => {

            musicBtn.textContent = "🔊 Play Music";

        });

    } else {

        musicBtn.textContent = "🔊 Play Music";

    }

    musicBtn.addEventListener("click", () => {

        if (music.paused) {

            music.play();

            localStorage.setItem("musicPlaying", "true");

            musicBtn.textContent = "🔇 Pause Music";

        } else {

            music.pause();

            localStorage.setItem("musicPlaying", "false");

            musicBtn.textContent = "🔊 Play Music";

        }

    });

    setInterval(() => {

        localStorage.setItem("musicTime", music.currentTime);

    }, 500);

    window.addEventListener("beforeunload", () => {

        localStorage.setItem("musicTime", music.currentTime);
        localStorage.setItem("musicPlaying", !music.paused);

    });

});