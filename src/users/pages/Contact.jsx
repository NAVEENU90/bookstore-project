import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPaperPlane, faPhone } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../../components/Footer';

const Contact = () => {
  return (
    
    <>
    <Header/>
      <main className="fade-in min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-6xl">

          <section aria-label="Contact information" className="mt-10 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-3 sm:gap-6 sm:py-8">
            <div className="flex items-center gap-4 rounded-xl p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Visit us</p>
                <p className="mt-1 text-sm font-medium leading-5 text-slate-800">123 Main Street, Apt 4B,<br />Anytown, CA 91234</p>
              </div>
            </div>
  
            <div className="flex items-center gap-4 rounded-xl p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Call us</p>
                <a href="tel:+919874561230" className="mt-1 inline-block text-sm font-medium text-slate-800 transition hover:text-amber-700">
                  +91 9874561230
                </a>
              </div>
            </div>
  
            <div className="flex items-center gap-4 rounded-xl p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email us</p>
                <a href="mailto:Bookstore@gmail.com" className="mt-1 inline-block text-sm font-medium text-slate-800 transition hover:text-amber-700">
                  Bookstore@gmail.com
                </a>
              </div>
            </div>
          </section>
  
          <section className="mt-10 grid gap-7 lg:grid-cols-2 lg:gap-8">
            <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-center font-serif text-2xl font-semibold text-slate-900">Send us a message</h2>
              <p className="mt-2 text-center text-sm text-slate-500">We usually reply within one business day.</p>
  
              <div className="mt-7 space-y-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
  
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
  
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="6"
                    placeholder="How can we help?"
                    className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
  
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
                >
                  Send message
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                </button>
              </div>
            </form>
  
            <div className="min-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm lg:min-h-full">
              <iframe
                title="Map showing our bookstore in Kakkanad, Kerala"
                src="https://maps.google.com/maps?q=Kakkanad%2C%20Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-full min-h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </main>
      <Footer/>
    </>
   
  );
};

export default Contact;
