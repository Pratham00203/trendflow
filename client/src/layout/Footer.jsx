import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer>
        <Link to='/' className='home-logo'>
          TrendFlow.
        </Link>
        <ul className='d-flex'>
          <li>
            <Link to='/'>Help</Link>
          </li>
          <li>
            <Link to='/'>Privacy</Link>
          </li>
          <li>
            <Link to='/'>Terms</Link>
          </li>
          <li>
            <Link to='/'>About</Link>
          </li>
        </ul>
      </footer>
    </>
  );
}
