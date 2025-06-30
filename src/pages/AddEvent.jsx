import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { useState } from "react";
import { createNewEvent } from "../lib/eventData";

const AddEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("date", {
        type: "manual",
        message: "Event date cannot be in the past",
      });
      return;
    }

    setLoading(true);

    try {
      const newEventData = {
        ...data,
        name: user.name,
        userId: user.id,
        attendeeCount: 0,
        attendees: [],
      };

      const newEvent = await createNewEvent(newEventData)
      console.log(newEvent);
      if (!newEvent.success) {
        throw new Error({message: newEvent.message, error:newEvent.error})
      }

      Swal.fire({
        icon: "success",
        title: "Event Created!",
        text: `"${data.title}" has been successfully created.`,
        confirmButtonColor: "#3B82F6",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/my-events");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: `Failed to create event. ${error.message}` ,
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setLoading(false);
    }
  };

  const description = watch("description") || "";

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            Create New Event
          </h1>
          <p className="text-lg text-base-content/70">
            Share your event with the community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Event Title</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Event title is required",
                  })}
                  className={`input input-bordered focus:input-primary ${
                    errors.title ? "input-error" : ""
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Organizer Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Organizer Name
                  </span>
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  className="input input-bordered bg-base-200"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Your name will be shown as the event organizer
                  </span>
                </label>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("date", {
                      required: "Event date is required",
                    })}
                    className={`input input-bordered focus:input-primary ${
                      errors.date ? "input-error" : ""
                    }`}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.date.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Time</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("time", {
                      required: "Event time is required",
                    })}
                    className={`input input-bordered focus:input-primary ${
                      errors.time ? "input-error" : ""
                    }`}
                  />
                  {errors.time && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.time.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Event location is required",
                  })}
                  className={`input input-bordered focus:input-primary ${
                    errors.location ? "input-error" : ""
                  }`}
                  placeholder="Enter event location"
                />
                {errors.location && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.location.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Event description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long",
                    },
                  })}
                  className={`textarea textarea-bordered focus:textarea-primary h-32 ${
                    errors.description ? "textarea-error" : ""
                  }`}
                  placeholder="Describe your event..."
                ></textarea>
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {description.length}/500 characters
                  </span>
                </label>
              </div>

              {/* Attendee Count */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Attendee Count
                  </span>
                </label>
                <input
                  type="number"
                  value="0"
                  className="input input-bordered bg-base-200"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Attendee count will start at 0 and increase as people join
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Event...
                    </>
                  ) : (
                    <>
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
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEvent;

// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useAuth } from '../contexts/AuthContext'
// import Swal from 'sweetalert2'

// const AddEvent = () => {

//   const [formData, setFormData] = useState({
//     title: '',
//     date: '',
//     time: '',
//     location: '',
//     description: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.title.trim()) {
//       newErrors.title = 'Event title is required'
//     }

//     if (!formData.date) {
//       newErrors.date = 'Event date is required'
//     } else {
//       const selectedDate = new Date(formData.date)
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
//       if (selectedDate < today) {
//         newErrors.date = 'Event date cannot be in the past'
//       }
//     }

//     if (!formData.time) {
//       newErrors.time = 'Event time is required'
//     }

//     if (!formData.location.trim()) {
//       newErrors.location = 'Event location is required'
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Event description is required'
//     } else if (formData.description.trim().length < 10) {
//       newErrors.description = 'Description must be at least 10 characters long'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     setLoading(true)

//     try {
//       // In a real app, you would send this data to your backend
//       // For now, we'll simulate the creation process
//       const newEvent = {
//         id: Date.now(), // Simple ID generation for demo
//         ...formData,
//         name: user.name,
//         userId: user.id,
//         attendeeCount: 0,
//         attendees: []
//       }

//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000))

//       Swal.fire({
//         icon: 'success',
//         title: 'Event Created!',
//         text: `"${formData.title}" has been successfully created.`,
//         confirmButtonColor: '#3B82F6',
//         timer: 3000,
//         timerProgressBar: true
//       }).then(() => {
//         navigate('/my-events')
//       })

//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Creation Failed',
//         text: 'Failed to create event. Please try again.',
//         confirmButtonColor: '#3B82F6'
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }))
//     }
//   }

//   return (
//     <div className="min-h-screen bg-base-100 py-8">
//       <div className="container mx-auto px-4 max-w-2xl">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl font-bold text-primary mb-4">Create New Event</h1>
//           <p className="text-lg text-base-content/70">Share your event with the community</p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="card bg-base-100 shadow-xl"
//         >
//           <div className="card-body">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Event Title</span>
//                   <span className="label-text-alt text-error">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className={`input input-bordered focus:input-primary ${errors.title ? 'input-error' : ''}`}
//                   placeholder="Enter event title"
//                 />
//                 {errors.title && (
//                   <label className="label">
//                     <span className="label-text-alt text-error">{errors.title}</span>
//                   </label>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Organizer Name</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={user?.name || ''}
//                   className="input input-bordered bg-base-200"
//                   disabled
//                 />
//                 <label className="label">
//                   <span className="label-text-alt text-base-content/60">Your name will be shown as the event organizer</span>
//                 </label>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-semibold">Date</span>
//                     <span className="label-text-alt text-error">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className={`input input-bordered focus:input-primary ${errors.date ? 'input-error' : ''}`}
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                   {errors.date && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.date}</span>
//                     </label>
//                   )}
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-semibold">Time</span>
//                     <span className="label-text-alt text-error">*</span>
//                   </label>
//                   <input
//                     type="time"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleChange}
//                     className={`input input-bordered focus:input-primary ${errors.time ? 'input-error' : ''}`}
//                   />
//                   {errors.time && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.time}</span>
//                     </label>
//                   )}
//                 </div>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Location</span>
//                   <span className="label-text-alt text-error">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className={`input input-bordered focus:input-primary ${errors.location ? 'input-error' : ''}`}
//                   placeholder="Enter event location"
//                 />
//                 {errors.location && (
//                   <label className="label">
//                     <span className="label-text-alt text-error">{errors.location}</span>
//                   </label>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Description</span>
//                   <span className="label-text-alt text-error">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className={`textarea textarea-bordered focus:textarea-primary h-32 ${errors.description ? 'textarea-error' : ''}`}
//                   placeholder="Describe your event..."
//                 ></textarea>
//                 {errors.description && (
//                   <label className="label">
//                     <span className="label-text-alt text-error">{errors.description}</span>
//                   </label>
//                 )}
//                 <label className="label">
//                   <span className="label-text-alt text-base-content/60">
//                     {formData.description.length}/500 characters
//                   </span>
//                 </label>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Attendee Count</span>
//                 </label>
//                 <input
//                   type="number"
//                   value="0"
//                   className="input input-bordered bg-base-200"
//                   disabled
//                 />
//                 <label className="label">
//                   <span className="label-text-alt text-base-content/60">Attendee count will start at 0 and increase as people join</span>
//                 </label>
//               </div>

//               <div className="form-control mt-8">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn btn-primary btn-lg"
//                 >
//                   {loading ? (
//                     <>
//                       <span className="loading loading-spinner loading-sm"></span>
//                       Creating Event...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
//                       </svg>
//                       Create Event
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default AddEvent
