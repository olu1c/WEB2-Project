import "./TripCard.css";

export default function TripCard(){
    return(
        <div className="trip-card">
            <h3 className="trip-title">Trip Name</h3>
            <p className="trip-dates">
                Trip startDate-endDate
            </p>
            <p className="trip-dates">Status</p>
            <p className="trip-budget">
                Budget
            </p>
            <div className="trip-buttons">
                <button className="trip-button open-btn">Open</button>
                <button className="trip-button edit-btn">Edit</button>
                <button className="trip-button delete-btn">Delete</button>
            </div>
        </div>
    );
}