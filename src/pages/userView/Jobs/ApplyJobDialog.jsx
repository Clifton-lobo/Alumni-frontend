import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyToJob } from "../../../store/user-view/ApplicationSlice"; // adjust path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  MapPin,
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const ApplyJobDialog = ({ open, onOpenChange, job }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.applications);

  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});

  if (!job) return null;

  const isSubmitting = loading.submit;

  /* ================= FILE HANDLERS ================= */

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      const msg = "Only PDF or Word documents are allowed";
      setErrors((p) => ({ ...p, resume: msg }));
      toast.error(msg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max allowed is 5MB`;
      setErrors((p) => ({ ...p, resume: msg }));
      toast.error(msg);
      return;
    }

    setResume(file);
    setErrors((p) => ({ ...p, resume: "" }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeResume = () => setResume(null);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e = {};
    if (!resume) e.resume = "Please upload your resume";
    if (!message.trim() || message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("message", message.trim());
    formData.append("jobId", job._id);

    const result = await dispatch(applyToJob(formData));

    if (applyToJob.fulfilled.match(result)) {
      toast.success("Application submitted successfully!");
      handleClose();
    } else {
      toast.error(result.payload || "Failed to submit application");
    }
  };

  /* ================= CLOSE / RESET ================= */

  const handleClose = () => {
    if (isSubmitting) return; // prevent accidental close during upload
    setMessage("");
    setResume(null);
    setErrors({});
    onOpenChange(false);
  };

  /* ================= UI ================= */

  const fileExt = resume?.name?.split(".").pop().toUpperCase();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 rounded-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col">

        {/* ── Header with job snapshot ── */}
        <div className="bg-[#152A5D] px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold leading-snug">
              Apply for this role
            </DialogTitle>
            <DialogDescription className="text-blue-200 text-sm mt-1">
              Your application will be sent directly to the job poster.
            </DialogDescription>
          </DialogHeader>

          {/* Job mini-card */}
          <div className="mt-4 flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3">
            <div className="p-2 rounded-lg bg-[#EBAB09]/20 flex-shrink-0">
              <Briefcase className="h-5 w-5 text-[#EBAB09]" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {job.title}
              </p>
              <div className="flex items-center gap-3 mt-0.5 text-blue-200 text-xs">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {job.companyName}
                </span>
                {job.location?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location.city}
                    {job.location.state && `, ${job.location.state}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form body ── */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

            {/* Resume upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">
                Resume *
              </Label>

              {resume ? (
                /* Uploaded file pill */
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="p-2 rounded-lg bg-green-100">
                    <FileText className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">
                      {resume.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {fileExt} · {(resume.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <button
                    type="button"
                    onClick={removeResume}
                    className="p-1 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <X className="h-4 w-4 text-green-700" />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("resume-input").click()}
                  className={`
                    relative flex flex-col items-center justify-center
                    px-4 py-8 rounded-xl border-2 border-dashed
                    cursor-pointer transition-all duration-200
                    ${dragOver
                      ? "border-[#EBAB09] bg-amber-50"
                      : errors.resume
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gray-50 hover:border-[#EBAB09] hover:bg-amber-50"
                    }
                  `}
                >
                  <Upload className={`h-8 w-8 mb-2 ${dragOver ? "text-[#EBAB09]" : "text-gray-400"}`} />
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop or{" "}
                    <span className="text-[#EBAB09] font-semibold underline underline-offset-2">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF or Word · Max 5MB</p>
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              )}

              {errors.resume && (
                <p className="text-sm text-red-600">{errors.resume}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">
                Message to Recruiter *
              </Label>
              <Textarea
                rows={4}
                placeholder="Tell the recruiter why you're a great fit for this role..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((p) => ({ ...p, message: "" }));
                }}
                className={`resize-none rounded-xl bg-gray-50 border text-sm focus:ring-2 focus:ring-[#EBAB09] focus:border-[#EBAB09] ${
                  errors.message ? "border-red-400" : "border-gray-300"
                }`}
              />
              <div className="flex items-center justify-between">
                {errors.message ? (
                  <p className="text-sm text-red-600">{errors.message}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {message.length} chars
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 h-11 rounded-xl border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 rounded-xl bg-[#EBAB09] hover:bg-yellow-500 text-black font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobDialog;