import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

// Sample data - replace with data from your API
const initialJobs = [
  {
    _id: "j1",
    title: "Manager",
    location: "Ernakulam",
    jobType: "Full Time",
    salary: "20000-40000",
    qualification: "MBA",
    experience: "1year",
    description:
      "Team leadership: Hire, train, coach, and motivate employees to achieve objectives. Provide feedback, resolve conflicts, and manage performance.",
  },
  {
    _id: "j2",
    title: "Sales Executive",
    location: "Kottayam",
    jobType: "Full Time",
    salary: "15000-25000",
    qualification: "Any Degree",
    experience: "Fresher",
    description:
      "Handle customer enquiries, promote new book arrivals and meet monthly sales targets.",
  },
];

const applicants = [
  {
    _id: "a1",
    jobTitle: "Manager",
    fullname: "Anu Raj",
    qualification: "MBA",
    email: "anu@gmail.com",
    phone: "9876543210",
    coverletter: "I am keen to lead your team.",
    resume: "#",
  },
];

const TABS = ["Job Post", "View Applicant"];

const JobCard = ({ job, onDelete }) => (
  <div className="border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <h2 className="flex-1 border-b border-gray-900 pb-3 text-lg font-bold text-gray-900">
        {job.title}
      </h2>
      <button
        onClick={() => onDelete(job._id)}
        className="flex items-center gap-2 rounded bg-red-800 px-4 py-2 text-white transition-colors hover:bg-red-900"
      >
        Delete <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>

    <p className="mt-4 flex items-center gap-2 text-blue-600">
      <FontAwesomeIcon icon={faLocationDot} /> {job.location}
    </p>
    <p className="mt-3 text-gray-900">Job Type : {job.jobType}</p>
    <p className="mt-3 text-gray-900">Salary : {job.salary}</p>
    <p className="mt-3 text-gray-900">Qualification : {job.qualification}</p>
    <p className="mt-3 text-gray-900">Experience : {job.experience}</p>
    <p className="mt-2 text-gray-900">Description : {job.description}</p>
  </div>
);

const EMPTY_FORM = {
  title: "",
  location: "",
  jobType: "",
  salary: "",
  qualification: "",
  experience: "",
  description: "",
};

const FIELDS = [
  { name: "title", placeholder: "Job Title" },
  { name: "location", placeholder: "Location" },
  { name: "jobType", placeholder: "Job Type" },
  { name: "salary", placeholder: "Salary" },
  { name: "qualification", placeholder: "Qualification" },
  { name: "experience", placeholder: "Experience" },
];

const inputClass =
  "w-full rounded border border-gray-400 px-3 py-2 placeholder-gray-500 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900";

const AddJobModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()])
    );
    if (Object.values(trimmed).some((value) => !value)) return;
    onAdd(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-title"
        className="m-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
          <h2 id="add-job-title" className="text-xl">
            Application form
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none transition-colors hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 p-5">
            {FIELDS.map((field, index) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                autoFocus={index === 0}
                className={inputClass}
              />
            ))}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={3}
              required
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex justify-end gap-3 bg-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={() => setForm(EMPTY_FORM)}
              className="rounded bg-orange-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded bg-green-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminCareers = () => {
  const [activeTab, setActiveTab] = useState("Job Post");
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState(initialJobs);
  const [searchInput, setSearchInput] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKey(searchInput.trim());
  };

  const handleDelete = (id) => {
    // Call your delete API here, then update the list
    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddJob = (jobData) => {
    // Call your "add job" API here, then update the list with the saved job
    setJobs((prev) => [{ _id: String(Date.now()), ...jobData }, ...prev]);
    closeModal();
  };

  const visibleJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <>
      <AdminHeader />
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="bg-blue-100 flex flex-col items-center">
          <AdminSidebar />
        </div>

        <main className="px-6 py-6 font-['Playfair_Display',serif] sm:px-10">
          <h1 className="text-center text-2xl text-gray-900">Careers</h1>

          {/* Tabs */}
          <div role="tablist" className="mt-8 flex justify-center">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`border px-3 py-2 transition-colors ${
                    isActive
                      ? "border-gray-200 bg-white text-blue-700"
                      : "border-transparent text-gray-900 hover:text-blue-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Job Post */}
          {activeTab === "Job Post" && (
            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search By Title"
                    className="w-56 border border-gray-200 px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                  <button
                    type="submit"
                    className="bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800"
                  >
                    search
                  </button>
                </form>

                <button
                  onClick={openModal}
                  className="rounded bg-green-800 px-4 py-2 text-white transition-colors hover:bg-green-900"
                >
                  Add Job +
                </button>
              </div>

              <div className="mt-8 space-y-6">
                {visibleJobs.length > 0 ? (
                  visibleJobs.map((job) => (
                    <JobCard key={job._id} job={job} onDelete={handleDelete} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No jobs found.</p>
                )}
              </div>
            </section>
          )}

          {/* View Applicant */}
          {activeTab === "View Applicant" && (
            <section className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400 text-left">
                <thead>
                  <tr className="bg-blue-900 text-center text-white">
                    {[
                      "Sl",
                      "Job Title",
                      "Name",
                      "Qualification",
                      "Email",
                      "Phone",
                      "Cover letter",
                      "Resume",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border border-gray-300 px-3 py-3 font-bold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applicants.length > 0 ? (
                    applicants.map((a, index) => (
                      <tr key={a._id}>
                        <td className="border border-gray-400 px-2 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.jobTitle}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.fullname}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.qualification}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.email}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.phone}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          {a.coverletter}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          <a
                            href={a.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 underline"
                          >
                            resume
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-gray-400 px-2 py-4 text-center text-gray-500"
                      >
                        No applicants yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}

          {showModal && (
            <AddJobModal onClose={closeModal} onAdd={handleAddJob} />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminCareers;