export const fetchEvents = async () => {
  try {
    const response = await fetch("/data/events.json");
    const data = await response.json();
    // Sort events by date (most recent first)
    const sortedEvents = data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setEvents(sortedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    setLoading(false);
  }
};


export const createNewEvent = async (eventData) => {
  const response = await fetch(`${import.meta.env.VITE_ROOT_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json(); // must parse the JSON

  console.log(data);

  if (response.status !== 201) {
    return {
      success: false,
      error: data.error,
      message: data.message || "",
    };
  }

  return {
    success: true,
    message: data.message,
    event: data.event,
  };
};

