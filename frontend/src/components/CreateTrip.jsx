import "./CreateTrip.css";
import { useState } from "react";

export default function CreateTrip({label}){
    const [form, setForm] = useState({
  tripName: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
  notes: ""
});
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};
    const handleSubmit = (e) => {
     e.preventDefault();

      console.log("NEW TRIP:", form);

      alert("Trip created! Check console.");
    };
    return(
        <form onSubmit={handleSubmit}>
            <h1>{label} Trip</h1>
            <div>
                <label>Trip Name</label>
                <input required name="tripName" onChange={handleChange} value={form.tripName}/>
            </div>
            <div>
                <label>Description</label>
                <textarea required name="description" onChange={handleChange} value={form.description}/>
            </div>
            <div>
                <label> Start Date</label>
                <input type="date" required name="startDate" onChange={handleChange} value={form.startDate}/>
            </div>
            <div>
                <label>End Date</label>
                <input type="date" required name="endDate" onChange={handleChange} value={form.endDate}/>
            </div>
            <div>
                <label>Budget</label>
                <input required name="budget" onChange={handleChange} value={form.budget}/>
            </div>
            <div>
                <label>Notes</label>
                <textarea required name="notes" onChange={handleChange} value={form.notes}/>
            </div>
            <button>{label}</button>
        </form>
    )
}