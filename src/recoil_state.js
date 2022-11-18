import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// https://portswigger.net/research/web-storage-the-lesser-evil-for-session-tokens
const { persistAtom } = recoilPersist();

const busyState = atom({
  key: "busyState",
  default: false,
});

const tokenInfoState = atom({
  key: "tokenInfoState",
  default: {
    access_token: null,
    expires_in: null,
    refresh_token: null,
  },
  effects: [persistAtom],
});

const userState = atom({
  key: "userState",
  default: {
    id: null,
    display_name: null,
    product: null,
    image_url: null,
  },
  effects: [persistAtom],
});

const playlistsState = atom({
  key: "playlistsState",
  default: [],
  effects: [persistAtom],
});

export { busyState, tokenInfoState, userState, playlistsState };
