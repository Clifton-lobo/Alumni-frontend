import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance"; // ✅ use shared instance instead of raw axios + hardcoded URL
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

    // External link validation
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

      const res = await axiosInstance.post(
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

  /* ================= UI ================= */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] px-10 py-6 bg-white overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4 border-b border-gray-200">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            Post a Job
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            All jobs are reviewed before going live.
          </SheetDescription>
        </SheetHeader>

        <Alert className="mt-6 rounded-xl border border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Only approved jobs are visible publicly.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          {/* TITLE */}
          <div className="space-y-2">
            <Label>Job Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
              className="h-11 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* COMPANY */}
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              value={formData.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              className="h-11 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.companyName && (
              <p className="text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* META */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="space-y-2">
              <Label>Employment Type *</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(v) => update("employmentType", v)}
              >
                <SelectTrigger className="h-11 rounded-lg bg-white border border-gray-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-sm text-red-600">{errors.employmentType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Work Mode *</Label>
              <Select
                value={formData.workMode}
                onValueChange={(v) => update("workMode", v)}
              >
                <SelectTrigger className="h-11 rounded-lg bg-white border border-gray-300">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.workMode && (
                <p className="text-sm text-red-600">{errors.workMode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Experience Level *</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(v) => update("experienceLevel", v)}
              >
                <SelectTrigger className="h-11 rounded-lg bg-white border border-gray-300">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v === "fresher" ? "Fresher" : `${v} years`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-sm text-red-600">{errors.experienceLevel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Number of Openings *</Label>
              <Input
                type="number"
                min={1}
                value={formData.openings}
                onChange={(e) => update("openings", e.target.value)}
                className="h-11 rounded-lg bg-white border border-gray-300"
              />
              {errors.openings && (
                <p className="text-sm text-red-600">{errors.openings}</p>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <Label>City *</Label>
            <Input
              value={formData.location.city}
              onChange={(e) => updateNested("location", "city", e.target.value)}
              className="h-11 rounded-lg bg-gray-50 border border-gray-300"
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={formData.location.state}
              onChange={(e) =>
                updateNested("location", "state", e.target.value)
              }
              className="h-11 rounded-lg bg-gray-50 border border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Country *</Label>
            <Input
              value={formData.location.country}
              onChange={(e) =>
                updateNested("location", "country", e.target.value)
              }
              className="h-11 rounded-lg bg-gray-50 border border-gray-300"
            />
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* SALARY */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <Label>Disclose Salary</Label>
            <Switch
              checked={formData.salary.disclosed}
              onCheckedChange={(v) => updateNested("salary", "disclosed", v)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {formData.salary.disclosed && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={formData.salary.min}
                  onChange={(e) =>
                    updateNested("salary", "min", e.target.value)
                  }
                  className="h-11 rounded-lg bg-gray-50 border border-gray-300"
                />
                {errors.salaryMin && (
                  <p className="text-sm text-red-600">{errors.salaryMin}</p>
                )}
              </div>
              <div className="space-y-1">
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={formData.salary.max}
                  onChange={(e) =>
                    updateNested("salary", "max", e.target.value)
                  }
                  className="h-11 rounded-lg bg-gray-50 border border-gray-300"
                />
                {errors.salaryMax && (
                  <p className="text-sm text-red-600">{errors.salaryMax}</p>
                )}
              </div>
            </div>
          )}

          {/* ===== APPLICATION TYPE ===== */}
          <div className="space-y-3">
            <Label>How should applicants apply? *</Label>

            <div className="grid grid-cols-2 gap-3">
              {/* Option: In-app form */}
              <button
                type="button"
                onClick={() => {
                  update("applicationType", "form");
                  update("externalLink", "");
                }}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.applicationType === "form"
                    ? "border-[#EBAB09] bg-amber-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    formData.applicationType === "form"
                      ? "border-[#EBAB09]"
                      : "border-gray-400"
                  }`}
                >
                  {formData.applicationType === "form" && (
                    <div className="h-2 w-2 rounded-full bg-[#EBAB09]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                    <FileText className="h-4 w-4 text-gray-600" />
                    In-app Form
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Applicants submit via AlumniHub
                  </p>
                </div>
              </button>

              {/* Option: External link */}
              <button
                type="button"
                onClick={() => update("applicationType", "external")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.applicationType === "external"
                    ? "border-[#EBAB09] bg-amber-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    formData.applicationType === "external"
                      ? "border-[#EBAB09]"
                      : "border-gray-400"
                  }`}
                >
                  {formData.applicationType === "external" && (
                    <div className="h-2 w-2 rounded-full bg-[#EBAB09]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                    <Link2 className="h-4 w-4 text-gray-600" />
                    External Link
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Redirect to company portal
                  </p>
                </div>
              </button>
            </div>

            {/* External link input — only shown when "external" is selected */}
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
                    className={`h-11 pl-9 rounded-lg bg-gray-50 border focus:ring-2 focus:ring-[#EBAB09] ${
                      errors.externalLink
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.externalLink && (
                  <p className="text-sm text-red-600">{errors.externalLink}</p>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-lg border-gray-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-lg bg-[#EBAB09] hover:bg-yellow-500 text-black font-semibold"
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
  );
};

export default PostJobForm;