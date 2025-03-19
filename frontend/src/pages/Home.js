import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5003/api";

function Home() {
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const createEvent = async () => {
    if (!name || !userName) return alert("Please enter event name and your name.");
    try {
      const res = await axios.post(`${API_BASE_URL}/events/create`, { name, createdBy: userName });
      navigate(`/event/${res.data._id}`);
    } catch (error) {
      alert("Error creating event");
    }
  };

  const joinEvent = async () => {
    if (!inviteCode || !userName) return alert("Please enter invite code and your name.");
    try {
      const res = await axios.post(`${API_BASE_URL}/events/join`, { inviteCode, userName });
      navigate(`/event/${res.data._id}`);
    } catch (error) {
      alert("Invalid invite code");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PayMates</h1>
      
      <div>
        <h2>Create an Event</h2>
        <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button onClick={createEvent}>Create</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Join an Event</h2>
        <input type="text" placeholder="Invite Code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
        <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button onClick={joinEvent}>Join</button>
      </div>
    </div>
  );
}

export default Home;
