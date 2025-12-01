import type React from "react"
import { useState, useMemo } from "react"
import {
  MdPeople,
  MdAttachMoney,
  MdCalendarToday,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md"
import { FaCamera, FaChartLine } from "react-icons/fa"
import "../styles/admin.css"

interface Booking {
  id: number
  clientName: string
  email: string
  phone: string
  service: string
  date: string
  amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  paymentProof?: string
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "calendar">("dashboard")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      clientName: "Maria Santos",
      email: "maria@example.com",
      phone: "+63 912 345 6789",
      service: "Wedding Photography",
      date: "2025-12-15",
      amount: 25000,
      status: "confirmed",
      notes: "Needs drone shots",
    },
    {
      id: 2,
      clientName: "Juan Dela Cruz",
      email: "juan@example.com",
      phone: "+63 923 456 7890",
      service: "Portrait Photography",
      date: "2025-12-01",
      amount: 5000,
      status: "pending",
      notes: "Studio session preferred",
    },
    {
      id: 3,
      clientName: "Ana Lopez",
      email: "ana@example.com",
      phone: "+63 934 567 8901",
      service: "Event Photography",
      date: "2025-11-28",
      amount: 15000,
      status: "completed",
      notes: "Birthday party coverage",
    },
    {
      id: 4,
      clientName: "Pedro Garcia",
      email: "pedro@example.com",
      phone: "+63 945 678 9012",
      service: "Wedding Photography",
      date: "2025-12-20",
      amount: 30000,
      status: "confirmed",
      notes: "Need pre-wedding shoot",
    },
    {
      id: 5,
      clientName: "Rosa Mendez",
      email: "rosa@example.com",
      phone: "+63 956 789 0123",
      service: "Product Photography",
      date: "2025-12-10",
      amount: 8000,
      status: "completed",
      notes: "E-commerce shots",
    },
  ])

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingsFilter, setBookingsFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all")

  const filteredBookings = useMemo(() => {
    if (bookingsFilter === "all") return bookings
    return bookings.filter((b) => b.status === bookingsFilter)
  }, [bookings, bookingsFilter])

  // Calculate statistics
  const totalClients = bookings.length
  const totalEarnings = bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.amount, 0)
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length

  const updateBookingStatus = (id: number, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
    setSelectedBooking(null)
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return isSameDay(bookingDate, date)
    })
  }

  const hasBooking = (date: Date) => {
    return getBookingsForDate(date).length > 0
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      })
    }

    return days
  }, [currentDate])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <MdCheckCircle />
      case "pending":
        return <MdPending />
      case "cancelled":
        return <MdCancel />
      default:
        return <MdCheckCircle />
    }
  }

  const getStatusClass = (status: string) => {
    return `status-badge status-${status}`
  }

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your photography business</p>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartLine />
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <FaCamera />
            Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <MdCalendarToday />
            Calendar
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon earnings">
                  <MdAttachMoney />
                </div>
                <div className="stat-info">
                  <h3>Total Earnings</h3>
                  <p className="stat-value">₱{totalEarnings.toLocaleString()}</p>
                  <span className="stat-label">Completed bookings</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon clients">
                  <MdPeople />
                </div>
                <div className="stat-info">
                  <h3>Total Clients</h3>
                  <p className="stat-value">{totalClients}</p>
                  <span className="stat-label">All time</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon pending">
                  <MdPending />
                </div>
                <div className="stat-info">
                  <h3>Pending</h3>
                  <p className="stat-value">{pendingBookings}</p>
                  <span className="stat-label">Awaiting confirmation</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon confirmed">
                  <MdCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>Confirmed</h3>
                  <p className="stat-value">{confirmedBookings}</p>
                  <span className="stat-label">Upcoming shoots</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="recent-section">
              <h2>Recent Bookings</h2>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="client-info">
                            <strong>{booking.clientName}</strong>
                            <span>{booking.email}</span>
                          </div>
                        </td>
                        <td>{booking.service}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>₱{booking.amount.toLocaleString()}</td>
                        <td>
                          <span className={getStatusClass(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button className="view-details-btn" onClick={() => setSelectedBooking(booking)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bookings-content">
            <div className="bookings-header">
              <h2>All Bookings</h2>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${bookingsFilter === "all" ? "active" : ""}`}
                  onClick={() => setBookingsFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${bookingsFilter === "pending" ? "active" : ""}`}
                  onClick={() => setBookingsFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`filter-btn ${bookingsFilter === "confirmed" ? "active" : ""}`}
                  onClick={() => setBookingsFilter("confirmed")}
                >
                  Confirmed
                </button>
                <button
                  className={`filter-btn ${bookingsFilter === "completed" ? "active" : ""}`}
                  onClick={() => setBookingsFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="bookings-list">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-client">
                      <h3>{booking.clientName}</h3>
                      <p>{booking.email}</p>
                      <p>{booking.phone}</p>
                    </div>
                    <span className={getStatusClass(booking.status)}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="detail-item">
                      <strong>Service:</strong>
                      <span>{booking.service}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Date:</strong>
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Amount:</strong>
                      <span>₱{booking.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <button className="action-btn view" onClick={() => setSelectedBooking(booking)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="calendar-content">
            <h2>Booking Calendar</h2>
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <button className="calendar-nav" onClick={goToPreviousMonth}>
                  <MdChevronLeft />
                </button>
                <div className="calendar-month-info">
                  <h3>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button className="today-btn" onClick={goToToday}>
                    Today
                  </button>
                </div>
                <button className="calendar-nav" onClick={goToNextMonth}>
                  <MdChevronRight />
                </button>
              </div>

              <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>

                {calendarDays.map((dayInfo, index) => {
                  const dayBookings = getBookingsForDate(dayInfo.date)
                  const isSelected = selectedDate && isSameDay(dayInfo.date, selectedDate)

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${!dayInfo.isCurrentMonth ? "inactive" : ""} ${hasBooking(dayInfo.date) ? "has-booking" : ""} ${isToday(dayInfo.date) ? "today" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        if (dayInfo.isCurrentMonth) {
                          setSelectedDate(dayInfo.date)
                        }
                      }}
                    >
                      <span className="day-number">{dayInfo.day}</span>
                      {dayBookings.length > 0 && <span className="booking-count">{dayBookings.length}</span>}
                    </div>
                  )
                })}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot today-dot"></span>
                  <span>Today</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot has-booking-dot"></span>
                  <span>Has Booking</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot selected-dot"></span>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && selectedDateBookings.length > 0 && (
              <div className="selected-date-details">
                <h3>
                  Bookings on{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="date-bookings-list">
                  {selectedDateBookings.map((booking) => (
                    <div key={booking.id} className="date-booking-card">
                      <div className="date-booking-header">
                        <h4>{booking.clientName}</h4>
                        <span className={getStatusClass(booking.status)}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </div>
                      <div className="date-booking-info">
                        <p>
                          <strong>Service:</strong> {booking.service}
                        </p>
                        <p>
                          <strong>Phone:</strong> {booking.phone}
                        </p>
                        <p>
                          <strong>Email:</strong> {booking.email}
                        </p>
                        <p>
                          <strong>Amount:</strong> ₱{booking.amount.toLocaleString()}
                        </p>
                        {booking.notes && (
                          <p>
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>
                      <button className="action-btn view" onClick={() => setSelectedBooking(booking)}>
                        View Full Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedDateBookings.length === 0 && (
              <div className="no-bookings-message">
                <p>No bookings on {selectedDate.toLocaleDateString()}</p>
              </div>
            )}

            {/* Upcoming Schedule */}
            <div className="upcoming-schedule">
              <h3>Upcoming Shoots</h3>
              {bookings
                .filter((b) => b.status === "confirmed")
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((booking) => (
                  <div key={booking.id} className="schedule-item">
                    <div className="schedule-date">
                      <span className="date-day">{new Date(booking.date).getDate()}</span>
                      <span className="date-month">
                        {new Date(booking.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="schedule-details">
                      <h4>{booking.service}</h4>
                      <p>{booking.clientName}</p>
                      <p className="schedule-phone">{booking.phone}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                <MdClose />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Client Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedBooking.clientName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedBooking.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedBooking.phone}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Booking Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">{selectedBooking.service}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(selectedBooking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">₱{selectedBooking.amount.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={getStatusClass(selectedBooking.status)}>
                      {getStatusIcon(selectedBooking.status)}
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p className="notes-text">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    className="action-btn confirm"
                    onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                  >
                    Confirm Booking
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedBooking.status === "confirmed" && (
                <button
                  className="action-btn complete"
                  onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                >
                  Mark as Completed
                </button>
              )}
              <button className="action-btn close-modal" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin