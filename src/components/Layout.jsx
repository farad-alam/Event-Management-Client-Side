import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { motion } from 'framer-motion'

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100" data-theme="eventtheme">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-[calc(100vh-64px)]"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

export default Layout