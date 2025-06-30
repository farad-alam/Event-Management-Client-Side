import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import { useAuth } from "../contexts/AuthContext";
import { fetchEventsByUserID } from "../lib/eventData";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      const myevents = await fetchEventsByUserID(user.id);
      console.log("Fetch events", myEvents);
      if (!myevents.success) {
        setLoading(false);
        return;
      }
      setMyEvents(myevents.events);
    } catch (error) {
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSaveEvent = async (updatedEvent) => {
    try {
      console.log(selectedEvent);
      const response = await fetch(
        `${import.meta.env.VITE_ROOT_URL}/api/events/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchMyEvents();
      }

      // const updatedEvents = myEvents.map(event =>
      //   event.id === updatedEvent.id ? updatedEvent : event
      // )
      // setMyEvents(updatedEvents)
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  // const handleDeleteEvent = async (eventId) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `${import.meta.env.VITE_ROOT_URL}/api/events/${"btug765v67vbi76v"}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     if (!response.success) {
  //       return response;
  //     }
  //     setLoading(false);
  //     fetchMyEvents();
  //   } catch (error) {
  //     console.error("Error deleting event:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDeleteEvent = async (eventId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_ROOT_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Unknown error",
          message: data.message || "Failed to delete event",
        };
      }

      fetchMyEvents();

      return {
        success: true,
        message: data.message,
        eventId: data.eventId,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network Error",
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-4">My Events</h1>
          <p className="text-lg text-base-content/70">
            Manage your created events
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-base-content/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                No events created yet
              </h3>
              <p className="text-base-content/50 mb-6">
                Start by creating your first event
              </p>
              <motion.a
                href="/add-event"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Your First Event
              </motion.a>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-base-content/70">
                  You have created {myEvents.length} event
                  {myEvents.length !== 1 ? "s" : ""}
                </p>
                <motion.a
                  href="/add-event"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Event
                </motion.a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <EventCard
                      event={event}
                      onUpdate={handleUpdateEvent}
                      onDelete={handleDeleteEvent}
                      showActions={true}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Update Event Modal */}
        <EventModal
          isOpen={modalOpen}
          onClose={closeModal}
          event={selectedEvent}
          onSave={handleSaveEvent}
        />
      </div>
    </div>
  );
};

export default MyEvents;
