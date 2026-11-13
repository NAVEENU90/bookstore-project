import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faBriefcase,
  faLocationDot,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../../components/Footer';

const Careers = () => {
  const [search, setSearch] = useState('');
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    if (!isApplicationOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsApplicationOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isApplicationOpen]);

  const hasMatchingOpening = 'bookseller bookstore associate'.includes(search.trim().toLowerCase());

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmissionMessage('This application form is ready, but online submission is not connected yet.');
  };

  return (
    <>
      <Header />
      <main className="fade-in min-h-screen bg-white px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-emerald-700" />
            <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">Current Openings</h1>
          </div>

          <form
            className="mx-auto mb-10 flex w-full max-w-lg gap-2"
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <label htmlFor="job-search" className="sr-only">Search openings by title</label>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400" />
              <input
                id="job-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by job title"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
            >
              Search
            </button>
          </form>

          {hasMatchingOpening ? (
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="border-b border-slate-900 pb-2 font-serif text-xl font-semibold text-slate-900">
                    Bookseller
                  </h2>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-600" />
                    Kochi, Kerala
                  </p>
                  <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div><dt className="inline font-semibold text-slate-700">Job type: </dt><dd className="inline text-slate-600">Full-time</dd></div>
                    <div><dt className="inline font-semibold text-slate-700">Salary: </dt><dd className="inline text-slate-600">Competitive</dd></div>
                    <div><dt className="inline font-semibold text-slate-700">Qualification: </dt><dd className="inline text-slate-600">High school diploma or equivalent</dd></div>
                    <div><dt className="inline font-semibold text-slate-700">Experience: </dt><dd className="inline text-slate-600">Customer service experience preferred</dd></div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmissionMessage('');
                    setIsApplicationOpen(true);
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
                >
                  Apply
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-sm leading-7 text-slate-600">
                  <span className="font-semibold text-slate-800">Description: </span>
                  We’re looking for a friendly, curious bookseller to help customers discover their next favorite read.
                  You’ll welcome visitors, make thoughtful recommendations, keep our shelves inviting, and support
                  day-to-day store operations. A love of books and excellent communication skills are a plus.
                </p>
              </div>
            </article>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
              <FontAwesomeIcon icon={faBriefcase} className="text-2xl text-slate-400" />
              <p className="mt-3 font-medium text-slate-700">No openings match your search.</p>
              <p className="mt-1 text-sm text-slate-500">Try another job title.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isApplicationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsApplicationOpen(false);
          }}
        >
          <section
            aria-labelledby="application-title"
            aria-modal="true"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
          >
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Bookseller · Kochi</p>
                <h2 id="application-title" className="mt-1 font-serif text-xl font-semibold">Application form</h2>
              </div>
              <button
                type="button"
                aria-label="Close application form"
                onClick={() => setIsApplicationOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                <div>
                  <label htmlFor="applicant-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    id="applicant-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />
                </div>
                <div>
                  <label htmlFor="applicant-qualification" className="mb-1.5 block text-sm font-medium text-slate-700">Qualification</label>
                  <input
                    id="applicant-qualification"
                    name="qualification"
                    type="text"
                    placeholder="Your qualification"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />
                </div>
                <div>
                  <label htmlFor="applicant-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    id="applicant-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />
                </div>
                <div>
                  <label htmlFor="applicant-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    id="applicant-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cover-letter" className="mb-1.5 block text-sm font-medium text-slate-700">Cover letter</label>
                  <textarea
                    id="cover-letter"
                    name="coverLetter"
                    rows="4"
                    placeholder="Tell us a little about yourself and why you’d like to join us."
                    required
                    className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="resume" className="mb-1.5 block text-sm font-medium text-slate-700">Resume</label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">PDF or Word document.</p>
                </div>
                {submissionMessage && (
                  <p className="sm:col-span-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
                    {submissionMessage}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
                <button
                  type="reset"
                  onClick={() => setSubmissionMessage('')}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-300/40"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
                >
                  Submit application
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default Careers;
