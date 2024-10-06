import React, { useState, useEffect, useRef, act } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday as isTodayDate,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  subWeeks,
  addWeeks,
  subDays,
  addDays,
} from "date-fns";
import styles from "../styles/Calendar.module.css";
import GoogleCalendarSync from "./GoogleCalendarSync";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Calendar = ({ groupID }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventId: "",
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    groupId: groupID,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState("Month"); // Initial active state is "Month"
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startDateInput, setStartDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSyncForm, setShowSyncForm] = useState(false);

  const handleStartDateChange = (e) => {
    setStartDateInput(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTimeInput(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDateInput(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTimeInput(e.target.value);
  };

  const handleButtonClick = (view) => {
    setActiveView(view); // Set the clicked button as active
  };

  const fetchEvents = async () => {
    if (!groupID) {
      console.error("Group ID is required to fetch events");
      return;
    }

    try {
      const response = await fetch(`/api/calendar?groupId=${groupID}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    // Fetch events when groupID changes
    fetchEvents();

    // Update current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [groupID]);

  const handlePrevMonth = () => {
    if (activeView === "Month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
    if (activeView === "Week") {
      setCurrentDate(subWeeks(currentDate, 1));
    }
    if (activeView === "Day") {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNextMonth = () => {
    if (activeView === "Month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
    if (activeView === "Week") {
      setCurrentDate(addWeeks(currentDate, 1));
    }
    if (activeView === "Day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const applySelection = () => {
    setCurrentDate(setMonth(setYear(currentDate, selectedYear), selectedMonth));
    setIsMenuOpen(false);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedYear(getYear(today));
    setSelectedMonth(getMonth(today));
  };

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  const startOfCalendar = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });
  const endOfCalendar = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar,
  });

  const getEventsForDay = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    // console.log(date);
    return events.filter(
      (event) =>
        formattedDate >= format(new Date(event.start_date), "yyyy-MM-dd") &&
        formattedDate <= format(new Date(event.end_date), "yyyy-MM-dd")
    );
  };

  // Handle event click to show details
  const handleEventClick = (event) => {
    console.log(event);
    if (event.editable === "true") {
      setSelectedEvent(event);
      const tmpEvent = {
        eventId: event["event_id"],
        name: event["name"],
        // startDate: event["start_date"],
        // endDate: event["end_date"],
        location: event["location"],
        groupId: groupID,
      };
      console.log(tmpEvent);
      setNewEvent(tmpEvent);

      const timezoneOffset = new Date().getTimezoneOffset() * 60000;

      console.log(
        new Date(
          new Date(event["start_date"]).getTime() - timezoneOffset
        ).toISOString()
      );
      console.log(
        new Date(
          new Date(event["end_date"]).getTime() - timezoneOffset
        ).toISOString()
      );

      setStartDateInput(
        new Date(new Date(event["start_date"]).getTime() - timezoneOffset)
          .toISOString()
          .split("T")[0]
      );
      // setStartTimeInput(new Date(new Date(event["start_date"]).getTime() - timezoneOffset).toISOString().split("T")[1]);
      setEndDateInput(
        new Date(new Date(event["end_date"]).getTime() - timezoneOffset)
          .toISOString()
          .split("T")[0]
      );
      // setEndTimeInput(new Date(new Date(event["end_date"]).getTime() - timezoneOffset).toISOString().split("T")[1]);

      // setStartDateInput(new Date(event["start_date"]).toISOString().split("T")[0]);
      // setStartTimeInput(new Date(event["start_date"]).toISOString().split("T")[1]);
      // setEndDateInput(new Date(event["end_date"]).toISOString().split("T")[0]);
      // setEndTimeInput(new Date(event["end_date"]).toISOString().split("T")[1]);

      setIsEventOpen(true);
      setIsEditing(true);
    }
  };

  // Handle closing the modal
  const handleCloseEventDetail = () => {
    setIsEventOpen(false);
    setSelectedEvent(null);
    setIsEditing(false);
    setNewEvent({
      name: "",
      startDate: "",
      endDate: "",
      location: "",
      groupId: groupID,
    });
    setStartDateInput("");
    setStartTimeInput("");
    setEndDateInput("");
    setEndTimeInput("");
  };

  // Function to handle opening the modal to add a new event
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewEvent({
      name: "",
      startDate: "",
      endDate: "",
      location: "",
      groupId: groupID,
    });
    setStartDateInput("");
    setStartTimeInput("");
    setEndDateInput("");
    setEndTimeInput("");
  };

  // Function to handle adding the new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    // Combine date and time
    const startDateTime = new Date(`${startDateInput}T${startTimeInput}`);
    const endDateTime = new Date(`${endDateInput}T${endTimeInput}`);

    if (endDateTime <= startDateTime) {
      console.error("Start date must be before end date");
      return;
    }

    const timezoneOffset = new Date().getTimezoneOffset() * 60000;

    // Convert startDateTime and endDateTime to the current location time
    const startDateTimeLocal = new Date(
      new Date(startDateTime.getTime()) - timezoneOffset
    );
    const endDateTimeLocal = new Date(
      new Date(endDateTime.getTime()) - timezoneOffset
    );

    const addedEvent = {
      ...newEvent,
      // startDate: startDateTime.toISOString(), // Store in ISO format (e.g., "2024-09-25T16:00:00.000Z")
      // endDate: endDateTime.toISOString(),
      startDate: startDateTimeLocal.toISOString(), // Store in ISO format (e.g., "2024-09-25T16:00:00.000Z")
      endDate: endDateTimeLocal.toISOString(),
    };

    if (
      startDateTimeLocal.toISOString().split("T")[0] !==
      endDateTimeLocal.toISOString().split("T")[0]
    ) {
      console.error("Multi-day events not supported");
      return;
    }

    // Set the combined values to the event object
    setNewEvent(addedEvent);

    console.log("add");
    console.log(newEvent);

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addedEvent),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([...events, addedEvent]);
        handleCloseModal();
        handleCloseEventDetail();
        await fetchEvents();
      } else {
        console.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Function to handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const startDateTime = new Date(`${startDateInput}T${startTimeInput}`);
    const endDateTime = new Date(`${endDateInput}T${endTimeInput}`);

    console.log(startDateTime);
    console.log(endDateTime);

    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    console.log(timezoneOffset);

    // Convert startDateTime and endDateTime to the current location time
    const startDateTimeLocal = new Date(
      new Date(startDateTime.getTime()) - timezoneOffset
    );
    const endDateTimeLocal = new Date(
      new Date(endDateTime.getTime()) - timezoneOffset
    );

    if (!selectedEvent || !selectedEvent["event_id"]) {
      console.error("No event selected for update");
      return;
    }

    if (endDateTime <= startDateTime) {
      console.error("Start date must be before end date");
      return;
    }

    if (
      startDateTimeLocal.toISOString().split("T")[0] !==
      endDateTimeLocal.toISOString().split("T")[0]
    ) {
      console.error("Multi-day events not supported");
      return;
    }

    console.log(newEvent);

    const updatedEvent = {
      ...newEvent,
      // startDate: startDateTime.toISOString(), // Store in ISO format (e.g., "2024-09-25T16:00:00.000Z")
      // endDate: endDateTime.toISOString(),
      startDate: startDateTimeLocal.toISOString(), // Store in ISO format (e.g., "2024-09-25T16:00:00.000Z")
      endDate: endDateTimeLocal.toISOString(),
      eventId: selectedEvent["event_id"],
    };

    console.log(updatedEvent);

    // Set the combined values to the event object
    setNewEvent(updatedEvent);

    console.log("update");
    console.log(newEvent);

    try {
      const response = await fetch(`/api/calendar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(
          events.map((event) =>
            event.event_id === updatedEvent.event_id ? updatedEvent : event
          )
        );
        handleCloseModal(); // Close the modal after updating
        handleCloseEventDetail();
        await fetchEvents();
      } else {
        const errorText = await response.text(); // To read the error message from the server
        console.error("Failed to update event:", errorText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !selectedEvent["event_id"]) {
      console.error("No event selected for remove");
      return;
    }
    const tmpEvent = {
      eventId: selectedEvent["event_id"],
    };
    try {
      const response = await fetch(`/api/calendar`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tmpEvent),
      });

      if (response.ok) {
        const deletedEvent = await response.json();
        setEvents(
          events.filter((event) => event["event_id"] !== tmpEvent.eventId)
        );
        handleCloseModal(); // Close the modal after updating
        handleCloseEventDetail();
        await fetchEvents();
      } else {
        const errorText = await response.text(); // To read the error message from the server
        console.error("Failed to remove event:", errorText);
      }
    } catch (error) {
      console.error("Error removing event:", error);
    }
  };

  const getHourLinesWeek = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <div className={styles["hour-line"]} key={i}>
          {/* <span className={styles["hour-label"]}>{`${i}:00`}</span> */}
          <div className={styles["line"]}></div>
        </div>
      );
    }
    return hours;
  };

  const getHourLinesDay = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <div className={styles["hour-line"]} key={i}>
          <span className={styles["hour-label"]}>{`${i}:00`}</span>
          <div className={styles["line"]}></div>
        </div>
      );
    }
    return hours;
  };

  const getAllDayEventsForDay = (day) => {
    return events
      .filter(
        (event) =>
          isAllDayEvent(event) &&
          event.start.getDate() === day.getDate() &&
          event.start.getMonth() === day.getMonth() &&
          event.start.getFullYear() === day.getFullYear()
      )
      .map((event, index) => (
        <div key={index} className={styles["all-day-event-block"]}>
          {event.title}
        </div>
      ));
  };

  const isAllDayEvent = (event) => {
    const startOfDay = new Date(event.start);
    const endOfDay = new Date(event.end);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);
    return event.start <= startOfDay && event.end >= endOfDay;
  };

  const getEventBlocks = () => {
    // Convert currentDate to a Date object for comparison
    const currentDateObj = new Date(currentDate);
    console.log(currentDateObj);

    return events
      .filter((event) => {
        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
        const startDate = new Date(
          new Date(event["start_date"]).getTime() - timezoneOffset
        );
        const endDate = new Date(
          new Date(event["end_date"]).getTime() - timezoneOffset
        );

        // Compare the date portion of the event's start and end with the currentDate
        const isSameDayStart =
          startDate.getUTCFullYear() === currentDateObj.getUTCFullYear() &&
          startDate.getUTCMonth() === currentDateObj.getUTCMonth() &&
          startDate.getUTCDate() === currentDateObj.getUTCDate();

        const isSameDayEnd =
          endDate.getUTCFullYear() === currentDateObj.getUTCFullYear() &&
          endDate.getUTCMonth() === currentDateObj.getUTCMonth() &&
          endDate.getUTCDate() === currentDateObj.getUTCDate();

        console.log(startDate);
        console.log(endDate);

        // Return true if the event starts or ends on the currentDate
        return isSameDayStart || isSameDayEnd;
      })
      .map((event, index) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);

        const startHour = startDate.getHours();
        const startMinutes = startDate.getMinutes();
        const endHour = endDate.getHours();
        const endMinutes = endDate.getMinutes();

        // Calculate the top position and height of the event block
        const topPosition = 25 + startHour * 50 + (startMinutes / 60) * 50; // 50px per hour
        const eventDuration =
          (endHour - startHour) * 50 + (endMinutes - startMinutes) * (50 / 60);

        return (
          <div
            key={index}
            className={styles["event-block"]}
            style={{
              top: `${topPosition}px`,
              height: `${eventDuration}px`,
            }}
            onClick={() => handleEventClick(event)}
          >
            <span className={styles["event-title"]}>{event.name}</span>
          </div>
        );
      });
  };

  const getEventBlocksForDay = (day) => {
    const dayEvents = events.filter((event) => {
      const eventStartDate = new Date(event.start_date);

      return (
        eventStartDate.getDate() === day.getDate() &&
        eventStartDate.getMonth() === day.getMonth() &&
        eventStartDate.getFullYear() === day.getFullYear()
      );
    });

    return dayEvents
      .filter((event) => !isAllDayEvent(event))
      .map((event, index) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const startHour = startDate.getHours();
        const startMinutes = startDate.getMinutes();
        const endHour = endDate.getHours();
        const endMinutes = endDate.getMinutes();

        // Calculate the top position and height of the event block
        const topPosition = 30 + startHour * 50 + (startMinutes / 60) * 50; // 50px per hour
        const eventDuration =
          (endHour - startHour) * 50 + (endMinutes - startMinutes) * (50 / 60);

        return (
          <div
            key={index}
            className={styles["event-block-week"]}
            style={{
              top: `${topPosition}px`,
              height: `${eventDuration}px`,
            }}
            onClick={() => handleEventClick(event)}
          >
            <span className={styles["event-title-week"]}>{event.name}</span>
          </div>
        );
      });
  };

  const handleGoogleCalendar = (e) => {
    setShowSyncForm(true);
  };

  const onGcalSuccess = (res) => {
    console.log("success");
    console.log(res);
    const { code } = res;
    getGcalTokens(code);
  };

  const getGcalTokens = async (code) => {
    const res = await fetch("api/gcal-create-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code
      })
    });
    const data = await res.json();
    console.log(data);
  };

  const onGcalFailure = (res) => {
    console.log("failure");
    console.log(res);
  };

  // Calculate the red line position
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const redLinePosition = (currentMinutes / 60) * 50 + (currentHour - 1) * 50;

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const startOfTheWeek = new Date(currentDate);
    startOfTheWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const day = new Date(startOfTheWeek);
    day.setDate(startOfTheWeek.getDate() + i);
    return day;
  });

  return (
    <div>
      {showSyncForm && (
        <div className="absolute w-screen h-screen z-10000 bg-transparent flex items-center justify-center">
          <GoogleCalendarSync />
        </div>
      )}
      <header className={styles["calendar-header"]}>
        <div className={styles["calendar-title"]}>
          <button className={styles["title-button"]} onClick={toggleMenu}>
            {format(currentDate, "MMMM yyyy")}
          </button>
          {isMenuOpen && (
            <div className={styles["dropdown-menu"]}>
              <div className={styles["dropdown-content"]}>
                <div className={styles["dropdown-column"]}>
                  <label htmlFor="year-select">Year:</label>
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {Array.from(
                      { length: 20 },
                      (_, i) => new Date().getFullYear() - 10 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["dropdown-column"]}>
                  <label htmlFor="month-select">Month:</label>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                      <option key={month} value={month}>
                        {format(new Date(2020, month), "MMMM")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={styles["apply-button"]}
                onClick={applySelection}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className={styles["view-control"]}>
          <div className={styles["button-wrapper"]}>
            {["Day", "Week", "Month"].map((view) => (
              <button
                key={view}
                className={`${styles["view-button"]} ${
                  activeView === view ? styles["active"] : ""
                }`}
                onClick={() => handleButtonClick(view)}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["calendar-controls"]}>
          <GoogleOAuthProvider clientId="350480669789-ihtcgbfgtj619sgc5vna4nrt33ptq3ta.apps.googleusercontent.com">
            <GoogleLogin
              clientId="350480669789-ihtcgbfgtj619sgc5vna4nrt33ptq3ta.apps.googleusercontent.com"
              buttonText="Authorise Google Calendar"
              onSuccess={onGcalSuccess}
              onFailure={onGcalFailure}
              cookiePolicy={"single-host-origin"}
              responseType="code"
              accessType="offline"
              scope="openid email profile https://www.googleapis.com/auth/calendar"
            />
          </GoogleOAuthProvider>
          <div className={styles["prev-next-group"]}>
            <button
              className={styles["prev-next-button"]}
              onClick={handlePrevMonth}
            >
              &lt;
            </button>
            <button className={styles["prev-next-button"]} onClick={goToToday}>
              Today
            </button>
            <button
              className={styles["prev-next-button"]}
              onClick={handleNextMonth}
            >
              &gt;
            </button>
          </div>
          <button
            className={styles["add-event-button"]}
            onClick={handleOpenModal}
          >
            Add Event
          </button>
        </div>
      </header>

      {activeView === "Month" && (
        <div className={styles["calendar-grid"]}>
          <div className={styles["calendar-day-header"]}>SUN</div>
          <div className={styles["calendar-day-header"]}>MON</div>
          <div className={styles["calendar-day-header"]}>TUE</div>
          <div className={styles["calendar-day-header"]}>WED</div>
          <div className={styles["calendar-day-header"]}>THU</div>
          <div className={styles["calendar-day-header"]}>FRI</div>
          <div className={styles["calendar-day-header"]}>SAT</div>
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                className={`${styles["calendar-day"]} ${
                  isTodayDate(day) ? styles["today"] : ""
                } ${
                  isSameMonth(day, currentDate)
                    ? styles["current-month"]
                    : styles["other-month"]
                }`}
              >
                <div className={styles["day-number"]}>{format(day, "d")}</div>
                {dayEvents.length > 0 && (
                  <div className={styles["task-list"]}>
                    {dayEvents.map((event, index) => (
                      <div
                        key={index}
                        className={styles["task-item"]}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeView === "Day" && (
        <div className={styles["schedule-container"]}>
          <div className={styles["date"]}>
            {currentDate.toLocaleString("en-US", {
              weekday: "short",
              day: "numeric",
            })}
          </div>
          <div className={styles["schedule"]}>
            {getHourLinesDay()}
            {getEventBlocks()}

            <div
              className={styles["current-time-line"]}
              // style={{
              //   top: `calc(${(currentHour - 1) * 50} + ${redLinePosition})px`,
              // }}
              style={{ top: `${redLinePosition + 75}px` }}
            ></div>
          </div>
        </div>
      )}

      {activeView === "Week" && (
        <div className={styles["weekly-schedule-container"]}>
          <div className={styles["time-column"]}>
            {Array.from({ length: 24 }, (_, i) => (
              <div className={styles["hour-label"]} key={i}>
                {i}:00
              </div>
            ))}
          </div>
          <div className={styles["weekly-schedule"]}>
            <div className={styles["line-container"]}>
              {getHourLinesWeek()}
              <div
                className={styles["current-time-line"]}
                // style={{
                //   top: `calc(${(currentHour - 1) * 50} + ${redLinePosition})px`,
                // }}
                style={{ top: `${redLinePosition + 75}px` }}
              ></div>
            </div>
            {daysOfWeek.map((day, index) => (
              <div className={styles["day-column"]} key={index}>
                <div className={styles["day-header"]}>
                  {day.toLocaleString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </div>
                <div className={styles["all-day-event-row"]}>
                  {getAllDayEventsForDay(day)}
                </div>
                <div className={styles["day-schedule"]}>
                  {getEventBlocksForDay(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for viewing event details */}
      {isEventOpen && selectedEvent && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h2>Event Details</h2>
            <p>
              <strong>Event Name:</strong> {selectedEvent.name}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {format(new Date(selectedEvent.start_date), "PPPP")}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {format(new Date(selectedEvent.end_date), "PPPP")}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <button type="button" onClick={handleCloseEventDetail}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding a new event */}
      {isModalOpen && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h2>Add Event</h2>
            <form onSubmit={handleAddEvent}>
              <label>
                Event Name:
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={startDateInput}
                  onChange={handleStartDateChange}
                  required
                />
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  name="startTime"
                  value={startTimeInput.slice(0, 5)}
                  onChange={handleStartTimeChange}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="endDate"
                  value={endDateInput}
                  onChange={handleEndDateChange}
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  name="endTime"
                  value={endTimeInput.slice(0, 5)}
                  onChange={handleEndTimeChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Add Event</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {isEventOpen && selectedEvent && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>
            {isEditing ? (
              <form onSubmit={handleUpdateEvent}>
                <label>
                  Event Name:
                  <input
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Start Date:
                  <input
                    type="date"
                    name="startDate"
                    value={startDateInput}
                    onChange={handleStartDateChange}
                    required
                  />
                </label>
                <label>
                  Start Time:
                  <input
                    type="time"
                    name="startTime"
                    value={startTimeInput.slice(0, 5)}
                    onChange={handleStartTimeChange}
                    required
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="date"
                    name="endDate"
                    value={endDateInput}
                    onChange={handleEndDateChange}
                    required
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="time"
                    name="endTime"
                    value={endTimeInput.slice(0, 5)}
                    onChange={handleEndTimeChange}
                    required
                  />
                </label>
                <label>
                  Location:
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                  />
                </label>
                <button type="submit">Update Event</button>
                <button type="button" onClick={handleCloseEventDetail}>
                  Cancel
                </button>
                <button type="delete" onClick={handleDeleteEvent}>
                  Delete
                </button>
              </form>
            ) : (
              <div>
                <p>
                  <strong>Event Name:</strong> {selectedEvent.name}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {format(new Date(selectedEvent.start_date), "PPPP")}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {format(new Date(selectedEvent.end_date), "PPPP")}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <button type="button" onClick={handleCloseEventDetail}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
