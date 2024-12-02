
export const isFullscreenAllowed = () => document.fullscreenEnabled;

const isFullscreen = () => document.fullscreenElement !== null;

export const toggleFullscreen = async () => {
  if (!isFullscreenAllowed()) {
    throw new Error("Fullscreen is not allowed in this context.");
  }

  const doc = document.documentElement;

  if (!isFullscreen()) {
    try {
      await doc.requestFullscreen();
    } catch (err) {
      console.error("Failed to enter fullscreen mode:", err);
    }
  } else {
    try {
      await document.exitFullscreen();
    } catch (err) {
      console.error("Failed to exit fullscreen mode:", err);
    }
  }
}