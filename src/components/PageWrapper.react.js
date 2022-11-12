import { Nav } from "./Nav.react.js";

import React from "react";

export const PageWrapper = (props) => {
  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="container-inner">{props.children}</div>
      </div>
    </>
  );
};
