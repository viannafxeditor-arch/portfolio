// Discourage native save/cast actions. These UI hints do not provide DRM.
export const videoPresentationProps = {
  controls: false,
  controlsList: "nodownload noremoteplayback noplaybackrate",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  draggable: false,
  onContextMenu: event => event.preventDefault(),
  onDragStart: event => event.preventDefault(),
  style: { WebkitTouchCallout: "none" },
};
