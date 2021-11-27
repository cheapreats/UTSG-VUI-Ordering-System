import styled from 'styled-components';

interface Submit{
    /** given text to app*/
    submission?: string;
    /** when clicked */
    onClick?: React.MouseEventHandler;
    onSubmit?: any;
}


export const Submit: React.FC<Submit> = ({
    onSubmit,
    submission,
}): React.ReactElement => {

    const handleSubmit: React.FormEventHandler = async (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault() 
        
        const {name} = event.target as typeof event.target & {
            name: {value: string}
        }
        submission = name.value
        onSubmit(submission)
      }
    return (
        <Form onSubmit={evt => handleSubmit(evt)}>
        <input type="text" id="name" placeholder="Type your response..." />
        <button type="submit">Submit</button> 
        </Form>
    )
}

const Form = styled.form`
  width: 30;
  margin-left: auto;
  margin-right: auto;
`;

export default Submit;