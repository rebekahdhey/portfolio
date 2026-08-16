function initProjectsAnimation() {

  const spotlightSection = document.querySelector(".spotlight");
  const projectIndex = document.querySelector(".project-index h1");
  const projectImgs = document.querySelectorAll(".project-img");
  const projectImagesContainer = document.querySelector(".project-images");
  const projectNames = document.querySelectorAll(".project-names p");
  const projectNamesContainer = document.querySelector(".project-names");
  const totalProjectCount = projectNames.length;

  const spotlightSectionHeight = spotlightSection.offsetHeight;
  const spotlightSectionPadding = parseFloat(
    getComputedStyle(spotlightSection).padding,
  );
  const projectIndexHeight = projectIndex.offsetHeight;
  const containerHeight = projectNamesContainer.offsetHeight;
  const imagesHeight = projectImagesContainer.offsetHeight;

  const moveDistanceIndex = spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;
  const moveDistanceImages = spotlightSectionHeight - spotlightSectionPadding * 2 - imagesHeight;
  const moveDistanceNames = spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;

  // Pre-measure each image's offset/height once, up front — not every frame.
  const imgMetrics = Array.from(projectImgs).map((img) => ({
    el: img,
    offsetTop: img.offsetTop,
    height: img.offsetHeight,
  }));

  const viewportCenter = window.innerHeight / 2;

  ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 5}`,
    pin: true,
    pinType: "transform",
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const currentIndex = Math.min(
        Math.floor(progress * totalProjectCount) + 1,
        totalProjectCount,
      );
      projectIndex.textContent = `${String(currentIndex).padStart(2, "0")}/${String(totalProjectCount).padStart(2, "0")}`;

      gsap.set(projectIndex, {
        y: progress * moveDistanceIndex,
      });

      const containerY = progress * moveDistanceImages;

      gsap.set(projectImagesContainer, {
        y: containerY,
      });

      // containerTop is where the container's top edge currently sits
      // in the viewport, given its base position + the y offset above.
      const containerTop = spotlightSectionPadding + containerY;

      imgMetrics.forEach(({ el, offsetTop, height }) => {
        const imgTop = containerTop + offsetTop;
        const imgBottom = imgTop + height;

        if (imgTop <= viewportCenter && imgBottom >= viewportCenter) {
          gsap.set(el, { opacity: 1 });
        } else {
          gsap.set(el, { opacity: 0.5 });
        }
      });

      projectNames.forEach((p, index) => {
        const startProgress = index / totalProjectCount;
        const endProgress = (index + 1) / totalProjectCount;
        const projectProgress = Math.max(
          0,
          Math.min(1, (progress - startProgress) / (endProgress - startProgress)),
        );

        gsap.set(p, {
          y: projectProgress * moveDistanceNames,
        });

        gsap.set(p, {
          color: projectProgress > 0 && projectProgress < 1 ? "#000" : "#4a4a4a",
        });
      });
    },
  });
}