gsap.registerPlugin(ScrollTrigger, Flip);

if (document.querySelectorAll("[data-anim]")) {
  document.querySelectorAll("[data-anim]").forEach((ada) => {
    ada.classList.add("animation-invisible");
  });
}

const runAnimationOrnament = () => {
  document.querySelectorAll("[data-anim]").forEach((da) => {
    ScrollTrigger.create({
      trigger: da,
      start: da.dataset.animAnchor ? da.dataset.animAnchor : "top bottom",
      toggleActions: "play none none reset",
      onToggle: (self) => {
        if (!self.isActive) {
          if (da.classList.contains("animate-loop")) {
            return da.classList.add("animate-paused");
          } else {
            return null;
          }
        }
        if (da.dataset.loadAnimation) {
          if (da.classList.contains("animate-loop")) {
            return da.classList.remove("animate-paused");
          } else {
            return self.kill();
          }
        }

        if (da.dataset.animDuration)
          da.style.animationDuration = da.dataset.animDuration;

        if (da.dataset.animDelay) {
          setTimeout(() => {
            da.classList.add("has-animate");
            da.classList.remove("animation-invisible");
            da.dataset.loadAnimation = true;
          }, da.dataset.animDelay);
        } else {
          da.classList.add("has-animate");
          da.classList.remove("animation-invisible");
          da.dataset.loadAnimation = true;
        }
      },
    });
  });
};

const runAnimationOrnamentCover = () => {
  document.querySelectorAll(".cover-section [data-anim]").forEach((vs) => {
    ScrollTrigger.create({
      trigger: vs,
      start: "top bottom",
      onToggle: (self) => {
        if (self.isActive) {
          if (vs.dataset.animDuration)
            vs.style.animationDuration = vs.dataset.animDuration;

          if (vs.dataset.animDelay) {
            setTimeout(() => {
              vs.classList.add("has-animate");
              vs.classList.remove("animation-invisible");
              vs.dataset.loadAnimation = true;
              self.kill();
            }, vs.dataset.animDelay);
          } else {
            vs.classList.add("has-animate");
            vs.classList.remove("animation-invisible");
            vs.dataset.loadAnimation = true;
            self.kill();
          }
        } else {
          vs.classList.add("animation-invisible");
          self.kill();
        }
      },
    });
  });
};

const runAnimationLoop = () => {
  document.querySelectorAll("[data-animationloop]").forEach((al) => {
    ScrollTrigger.create({
      trigger: al,
      start: "-10% bottom",
      onToggle: (self) =>
        self.isActive
          ? al.classList.add("animation-loop")
          : al.classList.remove("animation-loop"),
    });
  });
};
const runAnimationWithoutScrollTrigger = () => {
  document.querySelectorAll("[data-anim]").forEach((da) => {
    if (da.dataset.animDelay) {
      setTimeout(() => {
        da.classList.add("has-animate");
        da.classList.remove("animation-invisible");
        da.dataset.loadAnimation = true;
      }, da.dataset.animDelay);
    } else {
      da.classList.add("has-animate");
      da.classList.remove("animation-invisible");
      da.dataset.loadAnimation = true;
    }

    if (da.dataset.animDuration) {
      da.style.animationDuration = da.dataset.animDuration;
    }
  });
};

const runAnimationOrnamentSlide = () => {
  document.querySelectorAll("[data-anim]").forEach((da) => {
    da.classList.add("animation-invisible");
    da.classList.remove("has-animate", "animate-paused");
    da.dataset.loadAnimation = false;

    ScrollTrigger.create({
      trigger: da,
      start: da.dataset.animAnchor ? da.dataset.animAnchor : "top bottom",
      onEnter: () => startAnimation(da),
      onLeave: () => handleLeave(da),
      onEnterBack: () => startAnimation(da),
      onLeaveBack: () => handleLeave(da),
    });
  });

  // Fungsi helper untuk memulai animasi
  const startAnimation = (element) => {
    element.classList.add("has-animate");
    element.classList.remove("animation-invisible", "animate-paused");

    if (element.dataset.animDuration)
      element.style.animationDuration = element.dataset.animDuration;

    if (element.dataset.animDelay) {
      setTimeout(() => {
        element.dataset.loadAnimation = true;
      }, parseInt(element.dataset.animDelay));
    } else {
      element.dataset.loadAnimation = true;
    }
  };

  // Fungsi helper untuk menangani ketika element keluar viewport
  const handleLeave = (element) => {
    if (element.classList.contains("animate-loop")) {
      element.classList.add("animate-paused");
    } else {
      element.classList.remove("has-animate");
      element.classList.add("animation-invisible");
      element.dataset.loadAnimation = false;
    }
  };
};
