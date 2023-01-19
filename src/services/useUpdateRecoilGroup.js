import { useRecoilState } from "recoil";
import { playlistsState, groupsState } from "../recoil_state";

export const useUpdateRecoilGroup = () => {
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  return (playlistId, groupId, updatedGroup, updatedGroupIdsForPlaylist) => {
    //const newGroupIds = [...playlists[playlistId].group_ids, groupId];
    const updatedPlaylist = {
      ...playlists[playlistId],
      group_ids: [...new Set(updatedGroupIdsForPlaylist)],
    };
    const localPlaylists = { ...playlists };
    localPlaylists[playlistId] = updatedPlaylist;
    setPlaylists(localPlaylists);

    const localGroups = { ...groups };
    if (!localGroups[groupId]) {
      throw new Error(
        "Cannot update state: group is missing from state. Group ID: " + groupId
      );
    } else {
      localGroups[groupId] = updatedGroup;
    }
    setGroups(localGroups);
  };
};
