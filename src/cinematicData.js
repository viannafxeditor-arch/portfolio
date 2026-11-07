import excerpts from "./cinematicExcerpts.json" with { type: "json" };
import minecraftMedia from "./minecraftMedia.json" with { type: "json" };
import newMinecraftMedia from "./minecraftNewMedia.json" with { type: "json" };
const existing = minecraftMedia.map(clip => ({ ...clip, poster: excerpts[clip.videoSrc].poster, thumb: excerpts[clip.videoSrc].poster }));
const minecraft = [...newMinecraftMedia, ...existing].map((clip, index) => ({ ...clip, displayTitle: `Minecraft · ${String(index + 1).padStart(2, "0")}`, sequence: index + 1 }));
export const cinematicClips = minecraft;
export const cinematicHome = minecraft.find(clip => clip.id === "minecraft-clean-transitions");
export const cinematicGames = [{ id: "minecraft", title: "Minecraft", clips: minecraft }];
export const cinematicCopy = {
 ENG: { games: "Minecraft", choose: "Choose your game", close: "Close library", scenes: "Scenes" },
 PTBR: { games: "Minecraft", choose: "Escolha seu jogo", close: "Fechar biblioteca", scenes: "Cenas" },
 ES: { games: "Minecraft", choose: "Elige tu juego", close: "Cerrar biblioteca", scenes: "Escenas" },
};
