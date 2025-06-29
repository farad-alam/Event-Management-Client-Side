import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="navbar bg-base-100 shadow-lg px-4 lg:px-8"
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/events"
                    className={isActive("/events") ? "active" : ""}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-event"
                    className={isActive("/add-event") ? "active" : ""}
                  >
                    Add Event
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-events"
                    className={isActive("/my-events") ? "active" : ""}
                  >
                    My Events
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          Eventy
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li>
            <Link
              to="/"
              className={`btn btn-ghost ${
                isActive("/")
                  ? "bg-primary text-white"
                  : "text-base-content hover:bg-primary hover:text-white"
              } transition-all duration-200`}
            >
              Home
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/events"
                  className={`btn btn-ghost ${
                    isActive("/events")
                      ? "bg-primary text-white"
                      : "text-base-content hover:bg-primary hover:text-white"
                  } transition-all duration-200`}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/add-event"
                  className={`btn btn-ghost ${
                    isActive("/add-event")
                      ? "bg-primary text-white"
                      : "text-base-content hover:bg-primary hover:text-white"
                  } transition-all duration-200`}
                >
                  Add Event
                </Link>
              </li>
              <li>
                <Link
                  to="/my-events"
                  className={`btn btn-ghost ${
                    isActive("/my-events")
                      ? "bg-primary text-white"
                      : "text-base-content hover:bg-primary hover:text-white"
                  } transition-all duration-200`}
                >
                  My Events
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2">
                <img
                  alt="User avatar"
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  className="rounded-full"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span className="text-sm font-semibold text-base-content">
                  {user.name}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error hover:text-white transition-colors"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default Navbar