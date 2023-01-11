import React from "react";
import { useRecoilState } from "recoil";
import { selectedGroupIdState } from "../recoil_state";
import { Button } from "@mui/material";
import { CreateGroupInput } from "./CreateGroupInput.react";
import { SyncButton } from "./SyncButton.react";

export const CreateGroup = () => {
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);

  const createGroupClicked = () => {
    setSelectedGroupId("new");
  };

  const cancelClicked = () => {
    setSelectedGroupId("");
  };

  const styledButton = (onClick, text) => (
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 1, my: 1 }}
      onClick={onClick}
    >
      {text}
    </Button>
  );

  const showForm = selectedGroupId === "new";

  return (
    <div width="100%">
      <SyncButton />
      {showForm && (
        <CreateGroupInput sx={{ mx: 1, mt: 1.5, p: 0 }} header={true} />
      )}
      {showForm
        ? styledButton(cancelClicked, "Cancel")
        : styledButton(createGroupClicked, "Create New Group")}
    </div>
  );
};
