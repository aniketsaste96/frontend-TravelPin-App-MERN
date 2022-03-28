
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import ReactMapGL, { Marker, Popup } from "react-map-gl"
import { Room, Star } from '@material-ui/icons'
import 'mapbox-gl/dist/mapbox-gl.css';
import "./app.css"
import { format } from "timeago.js";
import Register from "./components/Register"
import Login from "./components/Login"
function App() {
  const myStorage = window.localStorage;
  // const currentUser = "rohan";
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",

    longitude: 78,
    latitude: 20,
    zoom: 4
  });

  //whenever refresh fetch all pins so empty dependancy.
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("https://travelpinappmern.herokuapp.com/api/pins")
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPins()
  }, [])
  //
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, longitude: long, latitude: lat })

  }

  //new place
  const handleAddClick = (e) => {
    console.log(e)
    const [long, lat] = e.lngLat;
    setNewPlace({
      //after es6 we need not to write like lat:lat etc if have same name
      lat, long
    })

  }

  //new pin

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      //send data to db
      const res = await axios.post("https://travelpinappmern.herokuapp.com/api/pins", newPin)
      setPins([...pins, res.data])
      //after sending to db want to close form 
      setNewPlace(null);
    } catch (error) {
      console.log(error)
    }

  }
  //react-map-lg 6.1.12 worked not latest version
  //logout

  const handleLogOut = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }


  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        width="100%"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"

      >
        {pins.map(pin => (

          <>
            <Marker longitude={pin.long} latitude={pin.lat
            } offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7} >
              <Room style={{ fontSize: viewport.zoom * 10, color: pin.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)} />
            </Marker>

            {pin._id === currentPlaceId &&

              <Popup
                latitude={pin.lat
                }
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                //  onClose={()=>togglePopup(false)}
                anchor="bottom">


                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">

                    {Array(pin.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">Created By  <b>{pin.username}</b> </span>
                  <span className="date">{format(pin.createdAt)} </span>
                </div>
              </Popup>}
          </>
        ))}

        {newPlace &&
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            //  onClose={()=>togglePopup(false)}
            anchor="bottom">

            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter Title..." onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Say Something About this Place..." onChange={(e) => setDesc(e.target.value)} />

                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="SubmitButton" type="submit">Add Pin</button>


              </form>
            </div>


          </Popup>
        }
        {currentUser ? (<button className="button logout" onClick={handleLogOut}>Logout</button>) : (<div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
          <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
        </div>)}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}


      </ReactMapGL>
    </div >
  );
}

export default App;
