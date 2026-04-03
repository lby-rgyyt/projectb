import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h2>Oops, something went wrong!</h2>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default NotFoundPage;
