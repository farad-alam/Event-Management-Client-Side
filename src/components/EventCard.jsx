import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Swal from 'sweetalert2'

const EventCard = ({ event, onJoin, onUpdate, onDelete, showActions = false }) => {
  const { user } = useAuth()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // const handleJoin = async () => {
  //   if (event.attendees?.includes(user.id)) {
  //     Swal.fire({
  //       icon: 'info',
  //       title: 'Already Joined',
  //       text: 'You have already joined this event!',
  //       confirmButtonColor: '#3B82F6',
  //     })
  //     return
  //   }

  //   const result = await Swal.fire({
  //     title: 'Join Event?',
  //     text: `Do you want to join "${event.title}"?`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3B82F6',
  //     cancelButtonColor: '#6B7280',
  //     confirmButtonText: 'Yes, join!',
  //     cancelButtonText: 'Cancel'
  //   })

  //   if (result.isConfirmed) {
  //     onJoin(event.id)
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Joined Successfully!',
  //       text: `You have successfully joined "${event.title}"`,
  //       confirmButtonColor: '#3B82F6',
  //       timer: 2000,
  //       timerProgressBar: true
  //     })
  //   }
  // }

  // const handleDelete = async () => {
  //   const result = await Swal.fire({
  //     title: 'Delete Event?',
  //     text: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#EF4444',
  //     cancelButtonColor: '#6B7280',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel'
  //   })

  //   if (result.isConfirmed) {
  //     const response = await onDelete(event.id)
  //     if (!response.success) {
  //       Swal.fire({
  //         icon: "error",
  //         title: `${response.error}`,
  //         text: "Something Unexpected happend guring deletion",
  //         confirmButtonColor: "#3B82F6",
  //         timer: 2000,
  //         timerProgressBar: true,
  //       });
  //     }
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Deleted!',
  //       text: 'Event has been deleted successfully.',
  //       confirmButtonColor: '#3B82F6',
  //       timer: 2000,
  //       timerProgressBar: true
  //     })
  //   }
  // }


  const handleJoin = async () => {
    if (event.attendees?.includes(user.id)) {
      return Swal.fire({
        icon: "info",
        title: "Already Joined",
        text: "You have already joined this event!",
        confirmButtonColor: "#3B82F6",
      });
    }

    const result = await Swal.fire({
      title: "Join Event?",
      text: `Do you want to join "${event.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, join!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const response = await onJoin(event.id); // wait for API result

      if (!response.success) {
        let message = "Something went wrong while joining.";

        // Customize based on known errors
        if (response.error === "User is already an attendee") {
          message = "You have already joined this event!";
        } else if (response.error === "User not found") {
          message = "User account not found. Please login again.";
        } else if (response.error === "Event not found") {
          message = "This event no longer exists.";
        }

        return Swal.fire({
          icon: "error",
          title: response.error || "Join Failed",
          text: message,
          confirmButtonColor: "#3B82F6",
          timer: 2500,
          timerProgressBar: true,
        });
      }

      // If successful
      Swal.fire({
        icon: "success",
        title: "Joined Successfully!",
        text: `You have successfully joined "${response.event.title}"`,
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const response = await onDelete(event.id);

      if (!response.success) {
        return Swal.fire({
          icon: "error",
          title: response.error || "Deletion Failed",
          text:
            response.message ||
            "Something unexpected happened during deletion.",
          confirmButtonColor: "#3B82F6",
          timer: 2500,
          timerProgressBar: true,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Event has been deleted successfully.",
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300"
    >
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-xl font-bold text-primary line-clamp-2">
            {event.title}
          </h2>
          <div className="btn btn-secondary btn-sm ">
            
            <small>{event.attendeeCount} attending</small>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop"
                alt={event.name}
              />
            </div>
          </div>
          <span className="text-sm text-base-content/70 font-medium">
            by {event.name}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-primary"
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
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTime(event.time)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-base-content/80 mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="card-actions justify-end">
          {showActions ? (
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(event)}
                className="btn btn-sm btn-primary"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update
              </button>
              <button onClick={handleDelete} className="btn btn-sm btn-error">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="btn btn-primary btn-sm"
              disabled={event.attendees?.includes(user?.id)}
            >
              {event.attendees?.includes(user?.id) ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Joined
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
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
                  Join Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard