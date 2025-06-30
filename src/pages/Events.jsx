import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EventCard from '../components/EventCard'
import { useAuth } from '../contexts/AuthContext'

const Events = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOption, setFilterOption] = useState('all')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterOption])

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ROOT_URL}/api/events`
      );
      const data = await response.json();

      // Sort events by date and time in descending order
      const sortedEvents = data.events.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB - dateTimeA; 
      });
      // console.log(data);
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  // const filterEvents = () => {
  //   let filtered = [...events]
    
  //   // Apply search filter
  //   if (searchTerm) {
  //     filtered = filtered.filter(event =>
  //       event.title.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   }

  //   // Apply date filter
  //   const today = new Date()
  //   const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))
  //   const lastWeekStart = new Date(currentWeekStart)
  //   lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  //   const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  //   const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  //   const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  //   switch (filterOption) {
  //     case 'today':
  //       const todayStr = new Date().toISOString().split('T')[0]
  //       filtered = filtered.filter(event => event.date === todayStr)
  //       break
  //     case 'current-week':
  //       filtered = filtered.filter(event => {
  //         const eventDate = new Date(event.date)
  //         return eventDate >= currentWeekStart && eventDate <= new Date()
  //       })
  //       break
  //     case 'last-week':
  //       filtered = filtered.filter(event => {
  //         const eventDate = new Date(event.date)
  //         return eventDate >= lastWeekStart && eventDate < currentWeekStart
  //       })
  //       break
  //     case 'current-month':
  //       filtered = filtered.filter(event => {
  //         const eventDate = new Date(event.date)
  //         return eventDate >= currentMonthStart
  //       })
  //       break
  //     case 'last-month':
  //       filtered = filtered.filter(event => {
  //         const eventDate = new Date(event.date)
  //         return eventDate >= lastMonthStart && eventDate <= lastMonthEnd
  //       })
  //       break
  //     default:
  //       break
  //   }

  //   setFilteredEvents(filtered)
  // }

  // const handleJoinEvent = async (eventId) => {
  //   try {
  //     const updatedEvents = events.map(event => {
  //       if (event.id === eventId) {
  //         const isAlreadyJoined = event.attendees?.includes(user.id)
  //         if (!isAlreadyJoined) {
  //           return {
  //             ...event,
  //             attendeeCount: event.attendeeCount + 1,
  //             attendees: [...(event.attendees || []), user.id]
  //           }
  //         }
  //       }
  //       return event
  //     })
  //     setEvents(updatedEvents)
  //   } catch (error) {
  //     console.error('Error joining event:', error)
  //   }
  // }

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(currentWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    switch (filterOption) {
      case "today":
        filtered = filtered.filter(
          (event) => event.date.split("T")[0] === todayStr
        );
        break;

      case "current-week":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= currentWeekStart && eventDate <= currentWeekEnd;
        });
        break;

      case "last-week":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
        });
        break;

      case "current-month":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= currentMonthStart;
        });
        break;

      case "last-month":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
        });
        break;

      default:
        break;
    }

    setFilteredEvents(filtered);
  };
  


  const handleJoinEvent = async (eventId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ROOT_URL}/api/events/${eventId}/attendees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Join Failed",
          message: data.message || "Unable to join event",
        };
      }

      // Update event in UI
      // const updatedEvents = events.map((event) =>
      //   event.id === eventId ? data.event : event
      // );
      // setEvents(updatedEvents);
      // console.log(events);
      await fetchEvents()

      return {
        success: true,
        event: data.event,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network Error",
        message: "Failed to join the event due to a network error.",
      };
    }
  };
  
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg">Loading events...</p>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold text-primary mb-4">Discover Events</h1>
          <p className="text-lg text-base-content/70">Find and join amazing events in your community</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card bg-base-100 shadow-lg mb-8"
        >
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text font-semibold">Search Events</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by event title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10 focus:input-primary"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              <div className="form-control lg:w-64">
                <label className="label">
                  <span className="label-text font-semibold">Filter by Date</span>
                </label>
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  className="select select-bordered focus:select-primary"
                >
                  <option value="all">All Events</option>
                  <option value="today">Today's Events</option>
                  <option value="current-week">This Week</option>
                  <option value="last-week">Last Week</option>
                  <option value="current-month">This Month</option>
                  <option value="last-month">Last Month</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">No events found</h3>
              <p className="text-base-content/50">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-base-content/70">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <EventCard
                      event={event}
                      onJoin={handleJoinEvent}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Events