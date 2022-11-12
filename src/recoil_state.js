import { atom } from "recoil";

const tokenInfoState = atom({
  key: "tokenInfoState",
  default: {
    access_token: null,
    expires_in: null,
    refresh_token: null,
  },
});

const userState = atom({
  key: "userState",
  default: { id: null, display_name: null },
});

const playlistsState = atom({
  key: "playlistsState",
  default: [],
});

export { tokenInfoState, userState, playlistsState };
