import { FaCalendarTimes, FaExclamationCircle, FaSearch } from 'react-icons/fa'; // Importing icons from react-icons
import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : allEvents && allEvents.length > 0 ? (
        <div>
          <Header activeHeading={3} />
          <div className="flex flex-wrap justify-center">
            {allEvents.map((event, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                <EventCard active={true} data={event} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        <Header activeHeading={3} />
        <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-100 to-blue-300 p-6 sm:p-12">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center text-blue-600">
              <FaCalendarTimes size={64} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">No Events Found</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              We couldn't find any events that match your criteria. Please check back later or adjust your search.
            </p>
            <div className="flex justify-center space-x-4 text-blue-600">
              <FaExclamationCircle size={32} />
              <FaSearch size={32} />
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default EventsPage;

