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
