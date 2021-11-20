import { Link } from "react-router-dom";

export const HomeDemo = (): React.ReactElement => {
  return (
    <>
      <Link to="/">Back to home</Link>
      <Link to="page1">Go to page 1</Link>
      {/* <Link to="page2">Go to page 2</Link> */}
    </>
  );
};
