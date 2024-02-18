import * as React from 'react';
import { Dialog, DialogWidth } from '../components/dialog/Dialog';
import { Property } from '../components/dialog/Property';
import { TodoType } from '../constants';
import { TodoProps } from './Todo';

export interface Props {
  current: TodoProps;
  edit?: boolean;
  onUpdate: (todo: TodoProps) => void;
  onCancel: () => void;
}

export const AddUpdateTodoDialog: React.FC<Props> = (props: Props) => {
  const { current, onUpdate, onCancel, edit = false } = props;
  const [edited, setEdited] = React.useState<TodoProps>(current);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const typeOptions = React.useMemo(() => {
    return [
      { label: "Work", value: TodoType.Work },
      { label: "Personal", value: TodoType.Personal },
      { label: "Weekend", value: TodoType.Weekend },
    ];
  }, []);

  return (
    <Dialog
      title={edit ? "Edit Todo" : "Add New Todo"}
      width={DialogWidth.Medium}
      errorMessage={errorMessage}
      onSubmit={() => {
        const { text } = edited;
        if (!text || text.trim().length === 0) {
          setErrorMessage("Todo text is required.");
        } else {
          onUpdate(edited);
        }
      }}
      onCancel={() => {
        onCancel();
      }}>
      <Property label="Todo Text" required={true}>
        <textarea
          autoFocus={true}
          className="w-full h-full focus:border-none"
          rows={8}
          onChange={(e) => {
            setErrorMessage(undefined);
            setEdited({
              ...current,
              text: e.currentTarget.value,
            });
          }}
          defaultValue={edited.text}
        />
      </Property>

      <Property label="Type">
        <select
          defaultValue={edited.type}
          onChange={(selected) => {
            setEdited({
              ...edited,
              type: selected.target.value as TodoType,
            });
          }}>
          {typeOptions.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </Property>
    </Dialog>
  );
};
