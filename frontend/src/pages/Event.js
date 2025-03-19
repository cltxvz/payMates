import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5003/api";

function Event() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const navigate = useNavigate();
  const [newParticipant, setNewParticipant] = useState("");

  const goHome = () => {
    if (!window.confirm("Are you sure you want to leave? All unsaved changes will be lost.")) return;
    navigate("/");
  };  

const addParticipant = async () => {
  if (!newParticipant) return alert("Enter a name!");

  try {
    await axios.post(`${API_BASE_URL}/events/join`, { inviteCode: event.inviteCode, userName: newParticipant });
    fetchEvent(); // Refresh participant list
    setNewParticipant("");
  } catch (error) {
    alert("Error adding participant");
  }
};

const removeParticipant = async (name) => {
  if (!window.confirm(`Are you sure you want to remove ${name} from the event?`)) return;

  try {
    await axios.post(`${API_BASE_URL}/events/remove-participant`, { eventId, userName: name });
    fetchEvent(); // Refresh participant list
  } catch (error) {
    alert("Error removing participant");
  }
};


  // Memoized function using useCallback
  const fetchEvent = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      setEvent(res.data);
    } catch (error) {
      alert("Event not found");
    }
  }, [eventId]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions/${eventId}`);
      setTransactions(res.data);
    } catch (error) {
      alert("Error fetching transactions");
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
    fetchTransactions();
  }, [fetchEvent, fetchTransactions]); // Now the warning is resolved

  const addTransaction = async () => {
    if (!payer || !amount || splitAmong.length === 0) return alert("Fill all fields");
    try {
      await axios.post(`${API_BASE_URL}/transactions/add`, { eventId, payer, amount, splitAmong });
      fetchTransactions(); // Refresh transactions after adding
    } catch (error) {
      alert("Error adding transaction");
    }
  };

  const removeEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
      alert("Event removed successfully!");
      navigate("/"); // Redirect to home page after deletion
    } catch (error) {
      alert("Error removing event");
    }
  };  

  const removeTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
  
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`);
      alert("Transaction removed successfully!");
      fetchTransactions(); // Refresh transaction list
    } catch (error) {
      alert("Error removing transaction");
    }
  };  

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {event ? (
        <>
          <h1>{event.name}</h1>
  
          {/* Participants Section */}
          <h2>Participants</h2>
          <ul>
            {event.participants.map((user) => (
              <li key={user}>
                {user} 
                <button style={{ marginLeft: "10px", background: "red", color: "white" }} onClick={() => removeParticipant(user)}>
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
  
          {/* Add Participant Section */}
          <h3>Add Participant</h3>
          <input type="text" placeholder="Enter name" value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} />
          <button onClick={addParticipant}>➕ Add</button>
  
          {/* Transactions Section */}
          <h2>Add Transaction</h2>
          <input 
            type="text" 
            placeholder="Payer" 
            value={payer} 
            onChange={(e) => setPayer(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Split Among (comma-separated)" 
            value={splitAmong.join(", ")}
            onChange={(e) => setSplitAmong(e.target.value.split(","))} 
          />
          <button onClick={addTransaction}>➕ Add Transaction</button>
  
          {/* Transaction List */}
          <h2>Transactions</h2>
          <ul>
            {transactions.map((tx) => (
              <li key={tx._id}>
                {tx.payer} paid ${tx.amount} - Split among: {tx.splitAmong.join(", ")}
                <button style={{ marginLeft: "10px", background: "red", color: "white" }} onClick={() => removeTransaction(tx._id)}>
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
  
          {/* Action Buttons */}
          <button style={{ background: "red", color: "white", marginTop: "20px" }} onClick={removeEvent}>
            Remove Event
          </button>
  
          <button style={{ marginTop: "20px", background: "gray", color: "white" }} onClick={goHome}>
            🏠 Go Home
          </button>
        </>
      ) : (
        <h1>Loading event...</h1> // Show this while fetching event data
      )}
    </div>
  );
  
}

export default Event;
