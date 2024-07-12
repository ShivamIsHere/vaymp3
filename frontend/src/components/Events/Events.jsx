import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { getAllEvents } from '../../redux/actions/event';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // if (error) {
  //   console.error("Error loading events:", error);
  // }
  console.log("Error loading events:", allEvents);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.section}>
          <div className={styles.heading}>
            <h1>Popular Events</h1>
          </div>
          <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory hide-scrollbar">
            {allEvents && allEvents.length !== 0 ? (
              allEvents.map((event) => (
                <div className="snap-center shrink-0 w-full md:w-1/2" key={event._id}>
                  <EventCard data={event} />
                </div>
              ))
            ) : (
              <h4>No Events available!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;