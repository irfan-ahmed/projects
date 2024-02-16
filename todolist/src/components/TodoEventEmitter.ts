import { EventEmitter } from "eventemitter3";

const createEventEmitter = () => {
  const eventEmitter = new EventEmitter();
  return eventEmitter;
};

export const TodoEventEmitter = createEventEmitter();
