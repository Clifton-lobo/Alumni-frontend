import { useEffect } from "react";
import { connectSocket } from "./socket/socket";
import { useDispatch } from "react-redux";
import {
  addIncomingRequest,
  removeIncomingRequest,
  addAcceptedConnection,
  removeAcceptedConnection,
} from "./src/store/user-view/ConnectionSlice";

function SocketInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("connection_request", (data) => {
      dispatch(addIncomingRequest(data));
    });

    socket.on("connection_accepted", (data) => {
      dispatch(addAcceptedConnection(data));
    });

    socket.on("connection_rejected", (data) => {
      dispatch(removeIncomingRequest(data.connectionId));
    });

    socket.on("connection_removed", (data) => {
      dispatch(removeAcceptedConnection(data.connectionId));
    });

    // return () => {
    //   socket?.disconnect();
    // };
    useEffect(() => {
      if (!token) return;
      const socket = connectSocket(token);

      return () => disconnectSocket();
    }, [token]);

  }, [dispatch]);

  return null;
}

export default SocketInitializer;
