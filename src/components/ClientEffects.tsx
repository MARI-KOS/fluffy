"use client";

import { useEffect } from "react";

export default function ClientEffects() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      document.body.classList.add("hide-next-indicator");
    }

    const loadingScreen = document.getElementById("loading-screen");
    const loadingBar = document.getElementById("loading-bar");
    const pageContainer = document.querySelector("[data-page-container]");
    const body = document.body;

    let loadingTimer: number | undefined;

    if (loadingScreen && loadingBar && pageContainer) {
      let progress = 0;
      loadingTimer = window.setInterval(() => {
        progress += Math.random() * 4;
        if (progress >= 100) {
          progress = 100;
          if (loadingTimer) window.clearInterval(loadingTimer);
          loadingBar.style.width = "100%";

          window.setTimeout(() => {
            loadingScreen.setAttribute("data-hidden", "true");
            pageContainer.setAttribute("data-visible", "true");
            body.classList.add("loaded");
            window.setTimeout(() => {
              loadingScreen.style.display = "none";
            }, 1500);
          }, 600);
        } else {
          loadingBar.style.width = `${progress}%`;
        }
      }, 20);
    } else {
      pageContainer?.setAttribute("data-visible", "true");
      body.classList.add("loaded");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true");
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll("[data-scroll-anim]").forEach((el) => observer.observe(el));

    const canvasContainer = document.getElementById("canvas-container");
    let fxCleanup: (() => void) | undefined;
    if (canvasContainer && !canvasContainer.querySelector("canvas")) {
      import("@/lib/stableFluids")
        .then((mod) => {
          fxCleanup = mod.initStableFluids(canvasContainer);
        })
        .catch((error) => {
          console.warn("Failed to init background FX", error);
        });
    }

    const sliderWrapper = document.getElementById("sliderWrapper");
    const sliderPrev = document.getElementById("sliderPrev");
    const sliderNext = document.getElementById("sliderNext");
    let isAnimating = false;
    let sliderInterval: number | undefined;

    const updateClasses = () => {
      if (!sliderWrapper) return;
      Array.from(sliderWrapper.children).forEach((slide, index) => {
        if (index === 0) slide.setAttribute("data-active", "true");
        else slide.removeAttribute("data-active");
      });
    };

    const startAutoSlide = () => {
      if (sliderInterval) window.clearInterval(sliderInterval);
      sliderInterval = window.setInterval(moveNext, 5000);
    };

    const moveNext = () => {
      if (!sliderWrapper || isAnimating) return;
      isAnimating = true;

      sliderWrapper.style.transition = "transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
      sliderWrapper.style.transform = "translateX(-100%)";

      window.setTimeout(() => {
        sliderWrapper.style.transition = "none";
        sliderWrapper.appendChild(sliderWrapper.firstElementChild as HTMLElement);
        sliderWrapper.style.transform = "translateX(0)";
        updateClasses();
        isAnimating = false;
      }, 800);
    };

    const movePrev = () => {
      if (!sliderWrapper || isAnimating) return;
      isAnimating = true;

      sliderWrapper.style.transition = "none";
      sliderWrapper.prepend(sliderWrapper.lastElementChild as HTMLElement);
      sliderWrapper.style.transform = "translateX(-100%)";

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          sliderWrapper.style.transition = "transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
          sliderWrapper.style.transform = "translateX(0)";
        });
      });

      window.setTimeout(() => {
        updateClasses();
        isAnimating = false;
      }, 800);
    };

    let startX = 0;
    let startY = 0;
    let pointerDown = false;

    const onDown = (event: PointerEvent | TouchEvent) => {
      if (isAnimating) return;
      pointerDown = true;
      const point = "touches" in event ? event.touches[0] : event;
      if (!point) return;
      startX = point.clientX;
      startY = point.clientY;
    };

    const onUp = (event: PointerEvent | TouchEvent) => {
      if (!pointerDown) return;
      pointerDown = false;
      const point = "changedTouches" in event ? event.changedTouches[0] : event;
      if (!point) return;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;

      if (Math.abs(dx) < 45) return;
      if (Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) moveNext();
      else movePrev();
    };

    if (sliderWrapper) {
      sliderWrapper.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      sliderWrapper.addEventListener("touchstart", onDown, { passive: true });
      window.addEventListener("touchend", onUp, { passive: true });
      startAutoSlide();
    }

    const stopPointer = (event: Event) => {
      event.stopPropagation();
    };
    const onPrevClick = (event: Event) => {
      event.preventDefault();
      movePrev();
      startAutoSlide();
    };
    const onNextClick = (event: Event) => {
      event.preventDefault();
      moveNext();
      startAutoSlide();
    };

    if (sliderPrev && sliderNext) {
      sliderPrev.addEventListener("pointerdown", stopPointer);
      sliderNext.addEventListener("pointerdown", stopPointer);
      sliderPrev.addEventListener("click", onPrevClick);
      sliderNext.addEventListener("click", onNextClick);
    }

    const contactForm = document.getElementById("myContactForm") as HTMLFormElement | null;
    const submitHandler = (event: Event) => {
      event.preventDefault();
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyejU2HI-uJ0RX4Z091VWjFhVOI7pmPqpXoWIUY10v1iDJlsHpNvEP8-uR1vNJ1QC84/exec";

      if (!contactForm) return;
      const formData = new FormData(contactForm);
      const data: Record<string, FormDataEntryValue> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const btn = contactForm.querySelector("button");
      const originalText = btn?.innerText ?? "";
      if (btn) {
        btn.innerText = "Sending...";
        btn.setAttribute("disabled", "true");
      }

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then(() => {
          alert("メッセージを送信しました！");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("Error!", error.message);
          alert("送信に失敗しました。");
        })
        .finally(() => {
          if (btn) {
            btn.innerText = originalText;
            btn.removeAttribute("disabled");
          }
        });
    };

    if (contactForm) {
      contactForm.addEventListener("submit", submitHandler);
    }

    return () => {
      document.body.classList.remove("hide-next-indicator");
      if (loadingTimer) window.clearInterval(loadingTimer);
      observer.disconnect();
      fxCleanup?.();

      if (sliderWrapper) {
        sliderWrapper.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        sliderWrapper.removeEventListener("touchstart", onDown);
        window.removeEventListener("touchend", onUp);
      }
      if (sliderInterval) window.clearInterval(sliderInterval);

      if (sliderPrev && sliderNext) {
        sliderPrev.removeEventListener("pointerdown", stopPointer);
        sliderNext.removeEventListener("pointerdown", stopPointer);
        sliderPrev.removeEventListener("click", onPrevClick);
        sliderNext.removeEventListener("click", onNextClick);
      }

      if (contactForm) {
        contactForm.removeEventListener("submit", submitHandler);
      }
    };
  }, []);

  return null;
}
