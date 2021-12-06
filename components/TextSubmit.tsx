import styled from "styled-components";
import { Button, InputFragment, Mixins } from "@cheapreats/react-ui";

interface SubmitProps {
  /** given text to app*/
  submission?: string;
  /** when clicked */
  onClick?: React.MouseEventHandler;
  onSubmit?: any;
}

export const Submit: React.FC<SubmitProps> = ({
  onSubmit,
  submission,
}): React.ReactElement => {
  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const { name } = event.target as typeof event.target & {
      name: { value: string };
    };
    submission = name.value;
    onSubmit(submission);
  };
  return (
    <Form onSubmit={(evt) => handleSubmit(evt)}>
      <InputFragment
        type="text"
        id="name"
        placeholder="Type your response..."
      ></InputFragment>
      <Button>Submit</Button>
    </Form>
  );
};

const Form = styled.form`
  ${Mixins.flex("row")};
`;

export default Submit;
