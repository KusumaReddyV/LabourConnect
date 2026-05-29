import { Link } from 'react-router-dom';

export default function Start() {
  return (
    <div className="start-page">
      <Link to="/" className="back-arrow" aria-label="Go back">
        &#x2190;
      </Link>
      <div className="outer-container">
        <div className="img-container">
          <Link to="/register/labour" className="img-box" title="Labour">
            <img
              src="https://i.postimg.cc/yYr1n88m/20241019-183920-0000.png"
              alt="Labour"
              className="image"
            />
            <div className="label">Labour</div>
          </Link>
            <Link to="/register/client" className="img-box" title="Client">
            <img
              src="https://i.postimg.cc/CLyx0DJ1/client.jpg"
              alt="Client"
              className="image"
            />
            <div className="label">Client</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
