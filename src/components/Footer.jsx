import React from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
  return (
    <footer className="border-b-4 border-red-600 bg-slate-800 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-12 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl uppercase">About Us</h3>
          <p className="text-justify leading-relaxed">
            We are a neighbourhood bookstore for readers of every age. From bestselling fiction to children's picture books and rare second-hand finds, our shelves are stocked with stories worth taking home. Drop in, browse at your own pace, and let us help you find your next favourite read.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-2xl uppercase">Newsletter</h3>
          <p className="mb-4">Get new arrivals and book picks in your inbox</p>
          <form className="flex w-full max-w-sm overflow-hidden rounded-lg shadow-sm ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-amber-400">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="bg-amber-400 px-5 text-slate-900 transition-colors hover:bg-amber-300"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            </button>
          </form>
        </div>

        <div>
          <h3 className="mb-4 text-2xl uppercase">Follow Us</h3>
          <p className="mb-4">Share what you're reading</p>
          <div className="flex gap-5 text-lg">
            <a href="#" aria-label="Instagram" className="hover:text-amber-400"><i className="fa-brands fa-instagram" /></a>
            <a href="#" aria-label="X" className="hover:text-amber-400"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-amber-400"><i className="fa-brands fa-facebook" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-amber-400"><i className="fa-brands fa-linkedin" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer