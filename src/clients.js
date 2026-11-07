import mugm from "./assets/clients/mugmv2.jpg";
import tae from "./assets/clients/taejon.jpg";
import { clientChannels } from "../shared/clientChannels.js";

// Public, rounded fallback counts verified through the YouTube API on 2026-11-07.
export const clientsCheckedAt = "2026-11-07";
export const clientsPreviewEnabled = import.meta.env.VITE_CLIENTS_PREVIEW === "true";
const avatars = { MugmV2: mugm, Taejon: tae };
export const clients = clientChannels.map(client => ({ ...client, avatar: avatars[client.handle] }));
