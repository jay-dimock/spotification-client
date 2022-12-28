import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ABOUT } from "./constants/ViewConstants";

// https://portswigger.net/research/web-storage-the-lesser-evil-for-session-tokens
const { persistAtom } = recoilPersist();

const viewState = atom({
  key: "viewState",
  default: ABOUT,
  effects: [persistAtom],
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
  default: {},
  effects: [persistAtom],
});

const selectedPlaylistIdState = atom({
  key: "selectedPlaylistIdState",
  default: "",
});

const groupsState = atom({
  key: "groupsState",
  default: {},
  effects: [persistAtom],
});

const selectedGroupIdState = atom({
  key: "selectedGroupIdState",
  default: "",
});

export {
  viewState,
  tokenInfoState,
  userState,
  playlistsState,
  selectedPlaylistIdState,
  groupsState,
  selectedGroupIdState,
};
