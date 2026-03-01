import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, Link2, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

/* ================= ENUMS (MUST MATCH BACKEND) ================= */

const EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract"];
const WORK_MODES = ["onsite", "remote", "hybrid"];
const EXPERIENCE_LEVELS = ["fresher", "0-1", "1-3", "3-5", "5+"];

/* ================= INITIAL STATE ================= */

const INITIAL_FORM = {
  title: "",
  companyName: "",
  employmentType: "",
  workMode: "",
  experienceLevel: "",
  openings: 1,
  location: {
    city: "",
    state: "",
    country: "India",
  },
  salary: {
    disclosed: false,
    min: "",
    max: "",
  },
  applicationType: "form",
  externalLink: "",
};

/* ================= CUSTOM SELECT STYLES ================= */
// Inject global styles for SelectContent theming
const selectStyles = `
  [data-radix-popper-content-wrapper] [role="listbox"] {
    background-color: #152A5D !important;
    border: 1px solid #1e3a7a !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    padding: 4px !important;
  }
  [data-radix-popper-content-wrapper] [role="option"] {
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 8px 12px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    transition: background 0.15s !important;
  }
  [data-radix-popper-content-wrapper] [role="option"]:hover,
  [data-radix-popper-content-wrapper] [role="option"][data-highlighted] {
    background-color: rgba(255,255,255,0.15) !important;
  }
  [data-radix-popper-content-wrapper] [role="option"][data-state="checked"] {
    background-color: rgba(255,255,255,0.2) !important;
    font-weight: 600 !important;
  }
`;

const PostJobForm = ({ open, onOpenChange, onJobCreated }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= HELPERS ================= */

  const update = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const updateNested = (parent, field, value) => {
    setFormData((p) => ({
      ...p,
      [parent]: { ...p[parent], [field]: value },
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e = {};

    if (!formData.title.trim() || formData.title.trim().length < 5)
      e.title = "Title must be at least 5 characters";

    if (!formData.companyName.trim())
      e.companyName = "Company name is required";

    if (!EMPLOYMENT_TYPES.includes(formData.employmentType))
      e.employmentType = "Select a valid employment type";

    if (!WORK_MODES.includes(formData.workMode))
      e.workMode = "Select a valid work mode";

    if (!EXPERIENCE_LEVELS.includes(formData.experienceLevel))
      e.experienceLevel = "Select experience level";

    if (!formData.location.city.trim()) e.city = "City is required";
    if (!formData.location.country.trim()) e.country = "Country is required";

    if (Number(formData.openings) < 1)
      e.openings = "Openings must be at least 1";

    if (formData.salary.disclosed) {
      if (!formData.salary.min) e.salaryMin = "Min salary required";
      if (!formData.salary.max) e.salaryMax = "Max salary required";
      if (Number(formData.salary.min) > Number(formData.salary.max))
        e.salaryMax = "Max salary must be greater than min salary";
    }

    if (formData.applicationType === "external") {
      if (!formData.externalLink.trim()) {
        e.externalLink = "External link is required";
      } else {
        try {
          new URL(formData.externalLink.trim());
        } catch {
          e.externalLink = "Enter a valid URL (e.g. https://example.com/apply)";
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Fix the highlighted fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        experienceLevel: formData.experienceLevel,
        openings: Number(formData.openings),
        location: {
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          country: formData.location.country.trim(),
        },
        salary: {
          disclosed: formData.salary.disclosed,
          ...(formData.salary.disclosed && {
            min: Number(formData.salary.min),
            max: Number(formData.salary.max),
          }),
        },
        applicationType: formData.applicationType,
        ...(formData.applicationType === "external" && {
          externalLink: formData.externalLink.trim(),
        }),
      };

      await axiosInstance.post(
        "/api/user/jobs/alumni/jobs/create",
        payload,
        { withCredentials: true }
      );

      toast.success("Job submitted for admin approval");
      resetForm();
      onJobCreated?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Failed to submit job"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SHARED STYLES ================= */

  const inputClass =
    "h-11 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[#152A5D] focus:border-[#152A5D] w-full text-sm";

  const selectTriggerClass =
    "h-11 rounded-lg bg-white border border-gray-300 w-full text-sm focus:ring-2 focus:ring-[#152A5D] focus:border-[#152A5D]";

  /* ================= UI ================= */

  return (
    <>
      {/* Inject dropdown styles */}
      <style>{selectStyles}</style>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="
            w-full
            sm:max-w-[560px]
            md:max-w-[640px]
            px-4 sm:px-8 md:px-10
            py-5 sm:py-6
            bg-white
            overflow-y-auto
          "
        >
          <SheetHeader className="space-y-2 pb-4 border-b border-gray-200">
            <SheetTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[#152A5D]">
              Post a Job
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              All jobs are reviewed before going live.
            </SheetDescription>
          </SheetHeader>

          <Alert className="mt-5 rounded-xl border border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-[#152A5D]" />
            <AlertDescription className="text-[#152A5D] text-sm">
              Only approved jobs are visible publicly.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* TITLE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Job Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className={inputClass}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            {/* COMPANY */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Company Name *</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                placeholder="e.g. Acme Corp"
                className={inputClass}
              />
              {errors.companyName && (
                <p className="text-xs text-red-600">{errors.companyName}</p>
              )}
            </div>

            {/* META — responsive 1 col on mobile, 2 col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(v) => update("employmentType", v)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[#152A5D] border-[#1e3a7a] text-white rounded-xl"
                  >
                    {EMPLOYMENT_TYPES.map((v) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-white focus:bg-white/20 focus:text-white cursor-pointer"
                      >
                        {v.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentType && (
                  <p className="text-xs text-red-600">{errors.employmentType}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Work Mode *</Label>
                <Select
                  value={formData.workMode}
                  onValueChange={(v) => update("workMode", v)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[#152A5D] border-[#1e3a7a] text-white rounded-xl"
                  >
                    {WORK_MODES.map((v) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-white focus:bg-white/20 focus:text-white cursor-pointer capitalize"
                      >
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.workMode && (
                  <p className="text-xs text-red-600">{errors.workMode}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Experience Level *</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(v) => update("experienceLevel", v)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[#152A5D] border-[#1e3a7a] text-white rounded-xl"
                  >
                    {EXPERIENCE_LEVELS.map((v) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-white focus:bg-white/20 focus:text-white cursor-pointer"
                      >
                        {v === "fresher" ? "Fresher" : `${v} years`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceLevel && (
                  <p className="text-xs text-red-600">{errors.experienceLevel}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Number of Openings *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.openings}
                  onChange={(e) => update("openings", e.target.value)}
                  className="h-11 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#152A5D] w-full text-sm"
                />
                {errors.openings && (
                  <p className="text-xs text-red-600">{errors.openings}</p>
                )}
              </div>
            </div>

            {/* LOCATION — responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">City *</Label>
                <Input
                  value={formData.location.city}
                  onChange={(e) => updateNested("location", "city", e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={inputClass}
                />
                {errors.city && (
                  <p className="text-xs text-red-600">{errors.city}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">State</Label>
                <Input
                  value={formData.location.state}
                  onChange={(e) => updateNested("location", "state", e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Country *</Label>
              <Input
                value={formData.location.country}
                onChange={(e) => updateNested("location", "country", e.target.value)}
                className={inputClass}
              />
              {errors.country && (
                <p className="text-xs text-red-600">{errors.country}</p>
              )}
            </div>

            {/* SALARY */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <Label className="text-sm font-medium text-gray-700">Disclose Salary</Label>
                <p className="text-xs text-gray-500 mt-0.5">Show salary range to applicants</p>
              </div>
              <Switch
                checked={formData.salary.disclosed}
                onCheckedChange={(v) => updateNested("salary", "disclosed", v)}
                className="data-[state=checked]:bg-[#152A5D]"
              />
            </div>

            {formData.salary.disclosed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Min Salary (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500000"
                    value={formData.salary.min}
                    onChange={(e) => updateNested("salary", "min", e.target.value)}
                    className={inputClass}
                  />
                  {errors.salaryMin && (
                    <p className="text-xs text-red-600">{errors.salaryMin}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Max Salary (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1200000"
                    value={formData.salary.max}
                    onChange={(e) => updateNested("salary", "max", e.target.value)}
                    className={inputClass}
                  />
                  {errors.salaryMax && (
                    <p className="text-xs text-red-600">{errors.salaryMax}</p>
                  )}
                </div>
              </div>
            )}

            {/* APPLICATION TYPE */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                How should applicants apply? *
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* In-app Form */}
                <button
                  type="button"
                  onClick={() => {
                    update("applicationType", "form");
                    update("externalLink", "");
                  }}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.applicationType === "form"
                      ? "border-[#152A5D] bg-[#152A5D]/5"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      formData.applicationType === "form"
                        ? "border-[#152A5D]"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.applicationType === "form" && (
                      <div className="h-2 w-2 rounded-full bg-[#152A5D]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                      <FileText className="h-4 w-4 text-[#152A5D]" />
                      In-app Form
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Applicants submit via AlumniHub
                    </p>
                  </div>
                </button>

                {/* External Link */}
                <button
                  type="button"
                  onClick={() => update("applicationType", "external")}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.applicationType === "external"
                      ? "border-[#152A5D] bg-[#152A5D]/5"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      formData.applicationType === "external"
                        ? "border-[#152A5D]"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.applicationType === "external" && (
                      <div className="h-2 w-2 rounded-full bg-[#152A5D]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                      <Link2 className="h-4 w-4 text-[#152A5D]" />
                      External Link
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Redirect to company portal
                    </p>
                  </div>
                </button>
              </div>

              {formData.applicationType === "external" && (
                <div className="space-y-1.5 mt-2">
                  <Label className="text-sm text-gray-700">Application URL *</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="url"
                      placeholder="https://company.com/careers/apply"
                      value={formData.externalLink}
                      onChange={(e) => update("externalLink", e.target.value)}
                      className={`h-11 pl-9 rounded-lg bg-gray-50 border focus:ring-2 focus:ring-[#152A5D] text-sm w-full ${
                        errors.externalLink ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.externalLink && (
                    <p className="text-xs text-red-600">{errors.externalLink}</p>
                  )}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-lg border-gray-300 text-sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-11 rounded-lg bg-[#152A5D] hover:bg-[#1a3470] text-white font-semibold text-sm transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit for Approval"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PostJobForm;