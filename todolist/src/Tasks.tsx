import * as React from 'react';
import { Alert, AlertDetails } from './components/alert/Alert';
import { HelpText } from './components/help-text/HelpText';
import { TodoEventEmitter } from './components/TodoEventEmitter';
import { ApplicationEvents } from './constants';
import { Todos } from './todos/Todos';

export interface Props {}

export const Tasks: React.FC<Props> = () => {
  const [alert, setAlert] = React.useState<AlertDetails>();
  const handleAlert = React.useCallback((alertDetails: AlertDetails) => {
    setAlert(alertDetails);
    window.setTimeout(() => {
      setAlert(undefined);
    }, 7000);
  }, []);

  React.useEffect(() => {
    TodoEventEmitter.on(ApplicationEvents.alert, handleAlert);
    return () => {
      TodoEventEmitter.removeListener(ApplicationEvents.alert, handleAlert);
    };
  }, [handleAlert]);

  return (
    <>
      {alert && (
        <Alert
          alert={alert}
          onClose={() => {
            setAlert(undefined);
          }}
        />
      )}
      <h2>Tasks</h2>
      <HelpText>Use the following page to list your Todos. Use the "New Day" to add a new section for today</HelpText>
      <hr />
      <Todos />
    </>
  );
};

export default Tasks;
