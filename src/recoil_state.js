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

const sortedPlaylistsState = selector({
  key: "sortedPlaylistsState",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    return Object.values(playlists).sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  },
});

const groupsState = atom({
  key: "groupsState",
  default: {},
  effects: [persistAtom],
});

export {
  viewState,
  tokenInfoState,
  userState,
  playlistsState,
  sortedPlaylistsState,
  groupsState,
};
