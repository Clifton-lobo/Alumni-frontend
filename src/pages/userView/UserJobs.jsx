import { useState } from "react";
import axios from "axios";

const UserJobs = () => {
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    employmentType: "",
    workMode: "",
    experienceLevel: "",
    city: "",
    state: "",
    salaryDisclosed: false,
    salaryMin: "",
    salaryMax: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        title: form.title,
        companyName: form.companyName,
        employmentType: form.employmentType,
        workMode: form.workMode,
        experienceLevel: form.experienceLevel,
        location: {
          city: form.city,
          state: form.state,
        },
        salary: {
          disclosed: form.salaryDisclosed,
          min: form.salaryDisclosed ? Number(form.salaryMin) : undefined,
          max: form.salaryDisclosed ? Number(form.salaryMax) : undefined,
        },
      };

      await axios.post("/api/jobs", payload);

      setMessage("Job submitted for admin approval ✅");
      setForm({
        title: "",
        companyName: "",
        employmentType: "",
        workMode: "",
        experienceLevel: "",
        city: "",
        state: "",
        salaryDisclosed: false,
        salaryMin: "",
        salaryMax: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Post a Job
      </h1>

      {message && (
        <div className="mb-4 text-green-600">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Employment Type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>

        <select
          name="workMode"
          value={form.workMode}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Work Mode</option>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          name="experienceLevel"
          value={form.experienceLevel}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Experience Level</option>
          <option value="fresher">Fresher</option>
          <option value="0-1">0–1 years</option>
          <option value="1-3">1–3 years</option>
          <option value="3-5">3–5 years</option>
          <option value="5+">5+ years</option>
        </select>

        <div className="flex gap-2">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border p-2 rounded"
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border p-2 rounded"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="salaryDisclosed"
            checked={form.salaryDisclosed}
            onChange={handleChange}
          />
          Disclose Salary
        </label>

        {form.salaryDisclosed && (
          <div className="flex gap-2">
            <input
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="Min Salary"
              type="number"
              className="w-full border p-2 rounded"
            />

            <input
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="Max Salary"
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
        >
          {loading ? "Submitting…" : "Submit Job"}
        </button>
      </form>
    </div>
  );
};

export default UserJobs;
