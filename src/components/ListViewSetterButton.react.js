import { MANAGE_GROUPS, MANAGE_PLAYLISTS } from "../constants/ViewConstants";
import { useRecoilState, useRecoilValue } from "recoil";
import { viewState, groupsState } from "../recoil_state";
import { Button, Link } from "@mui/material";

export const ListViewSetterButton = (props) => {
  const groups = useRecoilValue(groupsState);
  const [, setView] = useRecoilState(viewState);
  const setListView = () => {
    if (Object.keys(groups).length > 0) {
      setView(MANAGE_GROUPS);
    } else {
      setView(MANAGE_PLAYLISTS);
    }
  };
  if (props.component === "link") {
    // setting component="button" below makes it so the cursor changes on hover, the way it does for abutton.
    return (
      <Link component="button" onClick={setListView}>
        {props.children}
      </Link>
    );
  }

  return (
    <Button variant={props.variant} sx={props.sx} onClick={setListView}>
      {props.children}
    </Button>
  );
};
