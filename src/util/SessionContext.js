import React from "react";
import axios from "axios";

const SessionContext = React.createContext(null);

const useToken = () => {
  const [session] = React.useContext(SessionContext);
  return session?.token_info?.access_token;
};

const useUser = () => {
  const [session] = React.useContext(SessionContext);
  return session?.user_info;
};

const usePlaylists = () => {
  const [session] = React.useContext(SessionContext);
  console.log("usePlaylists: ", session?.playlists);
  return session?.playlists;
};

const useSession = () => {
  const [session, setSession] = React.useContext(SessionContext);
  //const token = session?.token_info?.access_token;

  const updateSession = (newSession) => {
    setSession({
      ...session,
      ...newSession,
    });
  };

  const updateTokenInfo = (newTokenInfo) => {
    updateSession({
      token_info: {
        // only populate values we will use.
        access_token: newTokenInfo.access_token,
        expires_in: newTokenInfo.expires_in,
        refresh_token: newTokenInfo.refresh_token,
      },
    });
    updateUserInfo(newTokenInfo.access_token);
  };

  const updateUserInfo = (token) => {
    const headers = {
      Authorization: "Bearer " + token,
    };

    fetch("https://api.spotify.com/v1/me", { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.display_name);
        const userChanged = session.user_info.id !== data.id;
        updateSession({
          user_info: {
            display_name: data.display_name,
            id: data.id,
            product: data.product,
          },
        });
        if (userChanged) {
          updateSession({ playlists: [] });
          updatePlaylists(token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePlaylists = (token) => {
    //const userId = session?.user_info?.id;
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const playlists = [];

    const getPlaylists = (endpoint) => {
      axios
        .get(endpoint, { headers })
        .then((response) => {
          console.log(endpoint);
          console.log(response.data);
          populateList(response.data);
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    };

    const populateList = (data) => {
      if (!data) {
        return;
      }
      // const total = data.total;

      // remove podcasts, etc:
      const chunk = data.items.filter((p) => p.type === "playlist");
      const map = chunk.map((p) => {
        return { id: p.id, name: p.name, owner: p.owner.name };
      });
      playlists.push(...map);

      if (data.next) {
        getPlaylists(data.next);
      } else {
        console.log("populateList - playlists", playlists);
        playlists.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
        updateSession({ playlists });
      }
    };

    const limit = 50; // max Spotify allows us to get at a time
    const firstEndpoint = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
    getPlaylists(firstEndpoint);
  };

  return {
    updateTokenInfo,
    updateUserInfo,
    updatePlaylists,
  };
};

const EmptySession = {
  working: false,
  token_info: {
    access_token: null,
    expires_in: null,
    refresh_token: null,
  },
  user_info: {
    display_name: null,
    id: null,
  },
  playlists: [],
};

const SessionProvider = ({ children }) => {
  const [session, setSession] = React.useState(EmptySession);

  return (
    <SessionContext.Provider value={[session, setSession]}>
      {children}
    </SessionContext.Provider>
  );
};

export {
  SessionContext,
  useToken,
  useUser,
  usePlaylists,
  useSession,
  SessionProvider,
};
