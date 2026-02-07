import React, { useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { toast } from "sonner";

/* ================= ENUMS (MUST MATCH SCHEMA) ================= */

const EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract"];
const WORK_MODES = ["onsite", "remote", "hybrid"];
const EXPERIENCE_LEVELS = ["fresher", "0-1", "1-3", "3-5", "5+"];

/* ============================================================ */

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

    if (!formData.location.city.trim())
      e.city = "City is required";

    if (!formData.location.country.trim())
      e.country = "Country is required";

    if (Number(formData.openings) < 1)
      e.openings = "Openings must be at least 1";

    if (formData.salary.disclosed) {
      if (!formData.salary.min) e.salaryMin = "Min salary required";
      if (!formData.salary.max) e.salaryMax = "Max salary required";

      if (
        Number(formData.salary.min) >
        Number(formData.salary.max)
      ) {
        e.salaryMax = "Max salary must be greater than min salary";
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
      };

      await axios.post(
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
      <SheetContent className="sm:max-w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Post a Job</SheetTitle>
          <SheetDescription>
            All jobs are reviewed before going live.
          </SheetDescription>
        </SheetHeader>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only approved jobs are visible publicly.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* TITLE */}
          <div>
            <Label>Job Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* COMPANY */}
          <div>
            <Label>Company Name *</Label>
            <Input
              value={formData.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>

          {/* META */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={(v) => update("employmentType", v)}>
                <SelectTrigger><SelectValue placeholder="Employment Type" /></SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-red-500 text-sm">{errors.employmentType}</p>
              )}
            </div>

            <div>
              <Select onValueChange={(v) => update("workMode", v)}>
                <SelectTrigger><SelectValue placeholder="Work Mode" /></SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.workMode && (
                <p className="text-red-500 text-sm">{errors.workMode}</p>
              )}
            </div>

            <div>
              <Select onValueChange={(v) => update("experienceLevel", v)}>
                <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-red-500 text-sm">{errors.experienceLevel}</p>
              )}
            </div>

            <div>
              <Input
                type="number"
                min={1}
                value={formData.openings}
                onChange={(e) => update("openings", e.target.value)}
                placeholder="Openings"
              />
              {errors.openings && (
                <p className="text-red-500 text-sm">{errors.openings}</p>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <Label>City *</Label>
            <Input
              value={formData.location.city}
              onChange={(e) => updateNested("location", "city", e.target.value)}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

          <div>
            <Label>State</Label>
            <Input
              value={formData.location.state}
              onChange={(e) => updateNested("location", "state", e.target.value)}
            />
          </div>

          <div>
            <Label>Country *</Label>
            <Input
              value={formData.location.country}
              onChange={(e) =>
                updateNested("location", "country", e.target.value)
              }
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>

          {/* SALARY */}
          <div className="flex items-center justify-between">
            <Label>Disclose Salary</Label>
            <Switch
              checked={formData.salary.disclosed}
              onCheckedChange={(v) =>
                updateNested("salary", "disclosed", v)
              }
            />
          </div>

          {formData.salary.disclosed && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={formData.salary.min}
                  onChange={(e) =>
                    updateNested("salary", "min", e.target.value)
                  }
                />
                {errors.salaryMin && (
                  <p className="text-red-500 text-sm">{errors.salaryMin}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={formData.salary.max}
                  onChange={(e) =>
                    updateNested("salary", "max", e.target.value)
                  }
                />
                {errors.salaryMax && (
                  <p className="text-red-500 text-sm">{errors.salaryMax}</p>
                )}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
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
