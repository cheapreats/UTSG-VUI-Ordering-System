import styled from "styled-components";
import { Button, InputFragment, Mixins } from "@cheapreats/react-ui";
import { useState } from "react";

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
  const [hasText, setHasText] = useState<boolean>(false);

  const handleChange: React.FormEventHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value)
    if (event.target.value == ""){
      setHasText(false);
    } else {
      setHasText(true);
    }
  };

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const { name } = event.target as typeof event.target & {
      name: { value: string };
    };
    submission = name.value;
    name.value = "";
    setHasText(false);
    onSubmit(submission);
  };

  return (
    <Form onChange={(evt) => handleChange(evt)} onSubmit={(evt) => handleSubmit(evt)}>
      <StyledInputFragment
        type="text"
        id="name"
        placeholder="Type your response..."
      ></StyledInputFragment>
      <StyledButton hasText={hasText} primary={true} disabled={!hasText}>Submit</StyledButton>
    </Form>
  );
};

const Form = styled.form`
  ${Mixins.flex("column")};
  align-items: center;
`;

const StyledInputFragment = styled(InputFragment)`
  width: 50%;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)<{ hasText: boolean }>`
  width: 30%;
  ${({ theme, hasText }): string =>
    hasText ? 
    `` :
    `color: ${theme.colors['primary']};
    background-color: ${theme.colors['background']};`
  }
`;

export default Submit;
