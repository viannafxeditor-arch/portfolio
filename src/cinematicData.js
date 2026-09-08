import folderMedia from "./falloutFolderMedia.json" with { type: "json" };
import imported from "./cinematicImports.json" with { type: "json" };
import excerpts from "./cinematicExcerpts.json" with { type: "json" };
import additionalMedia from "./additionalMedia.json" with { type: "json" };
import covers from "./gameCovers.json" with { type: "json" };

const fallout4Clips = [75, 141, 149, 88, 364].map((number) => ({
  id: `ambient-${number}`,
  title: `Ambient ${number}`,
  sourceFilename: `Ambient ${number}.mp4`,
  videoSrc: `/media/ambient-${number}.mp4`,
  poster: `/media/ambient-${number}.jpg`,
  thumb: `/media/ambient-${number}.jpg`,
  fps: [141, 149].includes(number) ? 120 : 60,
  hasAudio: number !== 364,
}));

const numbered = (clips, name) => clips.map((clip, index) => ({ ...clip, displayTitle: `${name} · ${String(index + 1).padStart(2, "0")}`, sequence: index + 1 }));
const withPreviewPoster = clip => ({ ...clip, poster: excerpts[clip.videoSrc].poster, thumb: excerpts[clip.videoSrc].poster });
const fallout4 = numbered([...fallout4Clips, ...imported.fallout4, ...folderMedia["fallout-4"]].map(withPreviewPoster), "Fallout 4");
const fallout76 = numbered([...additionalMedia.fallout76, ...folderMedia["fallout-76"]].map(withPreviewPoster), "Fallout 76");
const cyberpunk = numbered(imported.cyberpunk.map(withPreviewPoster), "Cyberpunk");
const rdr2 = numbered(imported.rdr2.map(withPreviewPoster), "Red Dead Redemption 2");

export const cinematicClips = [
  fallout4.find(clip => clip.id === "ambient-75"),
  cyberpunk.find(clip => clip.id === "cyberpunk-20260906-14411025-00000209"),
  rdr2.find(clip => clip.id === "rdr2-1"),
  fallout76.find(clip => clip.id === "fallout76-ambient-23"),
  fallout4.find(clip => clip.id === "ambient-296"),
  cyberpunk.find(clip => clip.id === "cyberpunk-3"),
  rdr2.find(clip => clip.id === "rdr2-3"),
  fallout76.find(clip => clip.id === "fallout76-ambient-20"),
  rdr2.find(clip => clip.id === "rdr2-2"),
];

export const cinematicGames = [
  { id: "cyberpunk", title: "Cyberpunk", clips: cyberpunk },
  { id: "red-dead-redemption-2", title: "Red Dead Redemption 2", clips: rdr2 },
  { id: "fallout-4", title: "Fallout 4", clips: fallout4 },
  { id: "fallout-76", title: "Fallout 76", clips: fallout76 },
].filter(game => game.clips.length).map(game => ({ ...game, cover: covers[game.id]?.cover }));

export const cinematicCopy = {
  ENG: { games: "Choose your world", choose: "Choose your game", close: "Close library", scenes: "Scenes" },
  PTBR: { games: "Escolha seu universo", choose: "Escolha seu jogo", close: "Fechar biblioteca", scenes: "Cenas" },
  ES: { games: "Elige tu universo", choose: "Elige tu juego", close: "Cerrar biblioteca", scenes: "Escenas" },
};
