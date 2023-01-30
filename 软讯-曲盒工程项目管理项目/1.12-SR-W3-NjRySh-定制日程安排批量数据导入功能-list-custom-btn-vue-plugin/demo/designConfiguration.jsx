import React from "react";
import App from "../src/App";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    configuration:
      '{"size":"middle", "placeholder": "123", "allowClear": true }',
  };
  return <App {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
