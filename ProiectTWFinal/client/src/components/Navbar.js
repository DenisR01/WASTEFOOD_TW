import { useEffect, useState } from "react";

function Navbar(props) {
  const [no,setNo] = useState(0);
  const getBackendData = () => {
    fetch('http://localhost:3001/aliments/expiring', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNo(data.length);        
      }); 
  };
  useEffect(getBackendData,[])
  return (
    <nav className="navbar navbar-dark bg-dark justify-content-between sticky-top" id="navbar">
      <div className="nav-left">
        <a className="title-app">Food Waste App</a>
        <a onClick={() => (window.location.href = '/')} className="nav-item">Home</a>
        <a onClick={() => (window.location.href = '/')} className="nav-item">Aliments expiring:{no}!!!</a>
        {props.isLoggedIn && (
          <a
            id='btnLogOut'
            onClick={props.onLogout}
            href='/#'
          >
            Logout
          </a>
        )}{' '}
      </div>
    </nav>
  );
};

export default Navbar;
