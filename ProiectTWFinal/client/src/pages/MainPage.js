import { useState, useEffect, useRef } from 'react';
import Aliment from '../components/Aliment';
import { toast } from 'react-toastify';
import moment from 'moment';

function MainPage() {
  const [filter, setFilter] = useState('All')
  const [users, setUsers] = useState([]);
  const [categorie, setCategorie] = useState('Legume');
  const [userType, setUserType] = useState('');
  const [userTypes, setUserTypes] = useState([]);
  const [addAliment, setAddAliment] = useState(false);
  const [createdAliment, setCreatedAliment] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const [aliments, setAliments] = useState([]);
  const [claimedAliments, setClaimedAliments] = useState([]);
  const name = useRef();
  const date = useRef();
 
  const getBackendData = () => {
    fetch('http://localhost:3001/logged', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedUser(data.dataValues)
      });
    getUsers();
    getUserTypes();
  };

  const getUsers = () => {
    fetch('http://localhost:3001/users', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setUsers(data)
      });
  };

  const getUserTypes = () => {
    fetch('http://localhost:3001/usertypes', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserTypes(data)
      });
  };

  const getallUsersAliments = () => {
    fetch(`http://localhost:3001/aliments`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
      .then((data) => {
        setAliments(data);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const postAliment = () => {
    fetch(`http://localhost:3001/aliments/${loggedUser.id}`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: categorie,
        name: name.current.value,
        date:date.current.value 
      }),
    }).then((res) => res.json())
      .then((data) => {
        toast.success('Aliment adaugat!');
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const makeAlimentAvailable = (id) => {
    fetch(`http://localhost:3001/aliments/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json())
      .then((data) => {
        if(data.message) toast.error(data.message)
        toast.success('Aliment modificat!');
        getAllAliments(loggedUser);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };
  const claimAliment = (alimentId) => {
    console.log(alimentId)
    fetch(`http://localhost:3001/aliments/${alimentId}/claim`, {
      method: 'PUT',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json())
      .then((data) => {
        if(data.error) toast.error(data.error)
        toast.success('Aliment solicitat!');
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const getAllAliments = (user, categ) => {
    if (!categ || categ == "Toate") {
      getallUsersAliments();
    } else {
      let category = categ ? categ : 'Personale'
      fetch(`http://localhost:3001/aliments/users/${user.id}/${category}`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
        .then((data) => {
         
          if(category=='claimed'){
            setClaimedAliments(data)
            setAliments([])
          } 
          else {
            setClaimedAliments([])
            setAliments(data)
          }
          console.log(data)
        }).catch((e) => toast.error("Nu s-au putut prelua alimentele!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }));
    }

  };

  useEffect(getBackendData, []);


  function showForm() {
    setCreatedAliment(false)
    setAddAliment(true)
    setShowHome(false)
    setShowUsers(false)
  }
  function showAliment() {
    setCreatedAliment(true)
    setAddAliment(false)
    setShowUsers(false)
    setShowHome(false)
  }
  function showUserPage() {
    setCreatedAliment(false)
    setAddAliment(false)
    setShowHome(false)
    setShowUsers(true)
  }

  const showAddAlimentPage = (
    <div id="container">
      <h1>Adaugare aliment</h1><br />
      <label htmlFor="categorie"><b>Categorie</b></label><br />
      <select name='categorie' id='categorie' onChange={e => setCategorie(e.target.value)}>
        <option>Legume</option>
        <option>Fructe</option>
        <option>Carne</option>
        <option>Lactate</option>
        <option>Snacks</option>
        <option>Dulciuri</option>
        <option>De baza</option>
      </select><br /><br />

      <label htmlFor="name"><b>Denumire</b></label><br />
      <input type="text" placeholder="Introduceti denumire" ref={name} name="name" id="name" required></input><br />

      <label htmlFor="date"><b>Data expirare</b></label><br />
      <input type="date" placeholder="Data expirare" ref={date} name="data" id="data" required></input><br />

      <button type="submit" className="custombtn" onClick={()=>postAliment()}
      >Adaugare aliment</button><br />
    </div>
  )
  const mainPage = (
    <div id="container">
      <h1>Buna ziua, {loggedUser && loggedUser.firstName + ' ' + loggedUser.lastName}!</h1>
      <br />
      <br />
      <h3>Doriti să adăugați un nou aliment?</h3>
      <button type="button" className="custombtn" onClick={showForm} >Adăugare aliment</button>
      <h3>Doriti să vedeți alimentele dvs?</h3>
      <button type="button" onClick={() => {
        getAllAliments(loggedUser);
        showAliment();
      }} className="custombtn">Vizualizare alimente</button>
      <h3>Doriti să vedeți alimentele care expiră?</h3>
      <button type="button" onClick={() => {
        getAllAliments(loggedUser, 'expiring');
        showAliment();
      }} className="custombtn">Vizualizare alimente ce vor expira</button>
      <h3>Doriti să vedeți alimentele solicitate?</h3>
      <button type="button" onClick={() => {
        getAllAliments(loggedUser, 'claimed');
        showAliment();
      }} className="custombtn">Vizualizare produse solicitate</button>
      <h3>Prietenii mei</h3>
      <button type="button" onClick={() => {
        getAllAliments(loggedUser);
        showUserPage();
      }} className="custombtn">Vizualizare prieteni</button>
    </div>)


  const addedaliment = (
    <div className="page-content">
      <div className="items-display row col-xs-12">
        <div className="title">
          <h1>Alimentele tale</h1>
          <select className='mb-5' id='showcategorie' onChange={e => {
            setFilter(e.target.value); getAllAliments(loggedUser, e.target.value)
          }}>
            <option>Toate</option>
            <option>Personale</option>
            <option>Legume</option>
            <option>Fructe</option>
            <option>Carne</option>
            <option>Lactate</option>
            <option>Snacks</option>
            <option>Dulciuri</option>
            <option>De baza</option>
          </select>
        </div>

        <div className="item-list row mt-5">
          <div className="item-cards row mt-5" >
            {aliments && aliments.map((aliment, i) => (
            (aliment.available || aliment.creatorUser&& aliment.creatorUser.userName == loggedUser.userName) &&  <Aliment key={i} user={loggedUser} onChange={makeAlimentAvailable}
                aliment={aliment} claimFunction={claimAliment}
              />
            ))}
             {claimedAliments && claimedAliments.map((aliment, i) => (
             <Aliment key={i} user={loggedUser} onChange={makeAlimentAvailable}
                aliment={aliment}
              />
            ))}
            <div width='100%' onClick={showForm} className='circleplus'>
              <svg width="123" height="122" viewBox="0 0 63 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="31.5" cy="31" rx="31.5" ry="31" fill="white">  </ellipse>
                <path id='totranslate' d="M20.6875 12.5312H31.9688V20.6875H20.6875V33.4375H12.0938V20.6875H0.78125V12.5312H12.0938V0.3125H20.6875V12.5312Z" fill="black" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const updateUserType = (userId, typeId) => {
    let obj = { userType: 'N/A' }
    fetch(`http://localhost:3001/users/${userId}/userType/${typeId}`, {
      method: 'PUT',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        obj.userType = data.userType
        return obj;
      });
    return obj;
  }
  const allUsers = (
    <div id="container">
      <h1>Utilizatorii curenti</h1>
      <hr />
      <br />
      <table class='tableUsers'>
        <thead>
          <tr>
            <td>Nume</td>
            <td>Prenume</td>
            <td>Tip</td>
            <td>Schimba tip</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.usertype ? user.usertype.description : 'N/A'}</td>
              <td>
                <select name='userType' id='userType' onChange={e => updateUserType(user.id, e.target.value)}>
                  {userTypes && userTypes.map((type, i) => (
                    <option key={type.id} value={type.id}>{type.description}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div id='1' >
      {addAliment ? showAddAlimentPage :
        showHome ? mainPage :
          showUsers ? allUsers :
            createdAliment ? addedaliment : mainPage
      }
    </div>
  )
}

export default MainPage;
