import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { createJobAsAdmin } from "../../../store/admin/AdminJobSlice";

/* ================= ENUMS ================= */
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
};

const AdminPostJobSheet = ({ open, onOpenChange, onJobCreated }) => {
  const dispatch = useDispatch();
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

      await dispatch(createJobAsAdmin(payload)).unwrap();

      toast.success("Job created and published successfully!");
      resetForm();
      onJobCreated?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] px-10 py-6 bg-white overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <SheetTitle className="text-2xl font-bold tracking-tight">
              Post Job as Admin
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm text-gray-600">
            Jobs posted by admins are automatically approved and published.
          </SheetDescription>
        </SheetHeader>

        <Alert className="mt-6 rounded-xl border border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            This job will be <strong>auto-approved</strong> and visible to all users immediately.
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
              placeholder="e.g. Senior Software Engineer"
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
              placeholder="e.g. Tech Corp Inc."
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
                <p className="text-sm text-red-600">
                  {errors.employmentType}
                </p>
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
                <p className="text-sm text-red-600">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Number of openings *</Label>
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
              onChange={(e) =>
                updateNested("location", "city", e.target.value)
              }
              className="h-11 rounded-lg bg-gray-50 border border-gray-300"
              placeholder="e.g. Mumbai"
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
              placeholder="e.g. Maharashtra"
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
              onCheckedChange={(v) =>
                updateNested("salary", "disclosed", v)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {formData.salary.disclosed && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              className="flex-1 h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Publish Job
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminPostJobSheet;