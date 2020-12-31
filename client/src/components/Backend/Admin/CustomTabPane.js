import React from "react";
import { TabPane } from "reactstrap";
import UsersTab from "./UsersTab/UsersTab";
import { AdminContenu } from "../../../containers/Backend/Admin/AdminContenu/AdminContenu";
import { AdminStructures } from "../../../containers/Backend/Admin/AdminStructures/AdminStructures";
import Dashboard from "../../../containers/Backend/Dashboard/Dashboard";

const customTabPane = (props) => {
  return (
    <>
      <TabPane tabId="0" className="no-padding">
        <AdminStructures />
      </TabPane>
      <TabPane tabId="1" className="no-padding">
        <AdminContenu />
      </TabPane>
      <TabPane tabId="2">
        <UsersTab {...props} />
      </TabPane>
      <TabPane tabId="3" className="no-padding">
        <Dashboard />
      </TabPane>
    </>
  );
};

export default customTabPane;
