import { atom, selector } from "recoil";
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

const tokenSelector = selector({
  key: "tokenSelector",
  get: ({ get, getCallback }) => {
    const tokenInfo = get(tokenInfoState);
    return tokenInfo.access_token;
  },
});

const userState = atom({
  key: "userState",
  default: { id: null, display_name: null },
  effects: [persistAtom],
});

const userIdSelector = selector({
  key: "userIdSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.id;
  },
});

const playlistsState = atom({
  key: "playlistsState",
  default: [],
  effects: [persistAtom],
});

export {
  busyState,
  tokenSelector,
  userIdSelector,
  tokenInfoState,
  userState,
  playlistsState,
};
