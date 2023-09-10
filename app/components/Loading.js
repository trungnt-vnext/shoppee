"use client"

import { Spin } from "antd";

const Loading = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
        <Spin size="large" />
      </div>
    );
  };
  
  export default Loading;