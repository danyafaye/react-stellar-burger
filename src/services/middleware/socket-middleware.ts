import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import type { Middleware } from 'redux';

export type TWSActionTypes<S = unknown, R = unknown> = {
  wsInit: ActionCreatorWithPayload<string>;
  wsClose: ActionCreatorWithoutPayload;
  wsSendMessage?: ActionCreatorWithPayload<S>;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
};

export const socketMiddleware = <S, R>(wsActions: TWSActionTypes<S, R>): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const { wsInit, wsSendMessage, onOpen, onClose, onError, onMessage, wsClose } =
        wsActions;

      if (wsInit.match(action)) {
        if (socket) {
          socket.close();
        }

        socket = new WebSocket(action.payload);

        socket.onopen = () => {
          dispatch(onOpen());
        };

        socket.onerror = () => {
          dispatch(onError('WebSocket error'));
        };

        socket.onmessage = (event: MessageEvent<unknown>) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data as string) as R;
            dispatch(onMessage(parsedData));
          } catch (_) {
            dispatch(onError('Data parsing error'));
          }
        };

        if (wsClose?.match(action)) {
          socket?.close();
        }
      }

      if (socket) {
        if (wsSendMessage?.match(action)) {
          socket.send(JSON.stringify(action.payload));
        }

        if (onClose.match(action)) {
          socket.close();
          socket = null;
        }
      }

      return next(action);
    };
  };
};
