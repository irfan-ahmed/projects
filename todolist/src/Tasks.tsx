import * as React from 'react';
import { HelpText } from './components/help-text/HelpText';
import { Todos } from './todos/Todos';

export interface Props {}

export const Tasks: React.FC<Props> = () => {
  return (
    <>
      <h2>Tasks</h2>
      <HelpText>Use the following page to list your Todos. Use the "New Day" to add a new section for today</HelpText>
      <hr />
      <Todos />
    </>
  );
};

export default Tasks;
