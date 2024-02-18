import { AlertDetails } from "./components/alert/Alert";
import { TodoEventEmitter } from "./components/TodoEventEmitter";

export const enum ApplicationEvents {
  alert = "ALERT",
}

export const enum TodoType {
  Work = "Work",
  Personal = "Personal",
  Weekend = "Weekend",
}

export const enum AlertType {
  ERROR = "error",
  WARNING = "warning",
  INFO = "information",
  SUCCESS = "successful",
}

export type EmitEventHelperType = Omit<AlertDetails, "type">;

export const emitError = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.ERROR, ...data } as AlertDetails);
};

export const emitSuccess = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.SUCCESS, ...data } as AlertDetails);
};

export const emitInfo = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.INFO, ...data } as AlertDetails);
};

export const emitWarning = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.WARNING, ...data } as AlertDetails);
};
