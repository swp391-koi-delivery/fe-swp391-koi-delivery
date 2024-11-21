import React, { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
function useRealTime(callback) {
  const WS_URL = "http://14.225.220.122:8080/websocket";
    // const WS_URL = "http://localhost:8080/websocket";
  const socket = new SockJS(WS_URL);
  const stomp = Stomp.over(socket);

  useEffect(() => {
    const onConnected = () => {
      console.log("WebSocket connected");
      stomp.subscribe(`/topic/general`, (message) => {
        console.log(message);
        callback && callback(message);
      });
      stomp.subscribe(`/topic/orders`, (message) => {
        console.log(message);
        callback && callback(message);
      });
    };
    stomp.connect({}, onConnected, null);
  }, []);

  
  return <></>;
}

export default useRealTime;
