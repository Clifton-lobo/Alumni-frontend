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

const PostJobForm = ({ open, onOpenChange, onJobCreated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5)
      newErrors.title = "Title must be at least 5 characters";

    if (!formData.companyName)
      newErrors.companyName = "Company name is required";

    if (!formData.employmentType)
      newErrors.employmentType = "Employment type is required";

    if (!formData.workMode)
      newErrors.workMode = "Work mode is required";

    if (!formData.experienceLevel)
      newErrors.experienceLevel = "Experience level is required";

    if (formData.openings < 1)
      newErrors.openings = "Openings must be at least 1";

    if (formData.salary.disclosed) {
      if (!formData.salary.min)
        newErrors.salaryMin = "Minimum salary is required";
      if (!formData.salary.max)
        newErrors.salaryMax = "Maximum salary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        openings: Number(formData.openings),
        salary: {
          disclosed: formData.salary.disclosed,
          ...(formData.salary.disclosed && {
            min: Number(formData.salary.min),
            max: Number(formData.salary.max),
          }),
        },
      };

      await axios.post("/api/user/jobs/alumni/jobs/create", jobData, {
        withCredentials: true,
      });

      toast.success("Job submitted for approval");
      onJobCreated();
    } catch (err) {
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Post a Job
          </SheetTitle>
          <SheetDescription>
            Share an opportunity with the alumni network.
          </SheetDescription>
        </SheetHeader>

        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            All jobs are reviewed before going live.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          {/* BASIC INFO */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Job Details
            </h3>

            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Senior Software Engineer"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  handleChange("companyName", e.target.value)
                }
                placeholder="Tech Corp"
              />
            </div>
          </section>

          {/* JOB META */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Employment Type *</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(v) => handleChange("employmentType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Work Mode *</Label>
              <Select
                value={formData.workMode}
                onValueChange={(v) => handleChange("workMode", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Experience Level *</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(v) =>
                  handleChange("experienceLevel", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="1-3">1–3 years</SelectItem>
                  <SelectItem value="3-5">3–5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Openings</Label>
              <Input
                type="number"
                min={1}
                value={formData.openings}
                onChange={(e) =>
                  handleChange("openings", e.target.value)
                }
              />
            </div>
          </section>

          {/* SALARY */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Disclose Salary Range
              </Label>
              <Switch
                checked={formData.salary.disclosed}
                onCheckedChange={(v) =>
                  handleNestedChange("salary", "disclosed", v)
                }
              />
            </div>

            {formData.salary.disclosed && (
              <div className="grid grid-cols-2 gap-6">
                <Input
                  placeholder="Min ₹"
                  type="number"
                  value={formData.salary.min}
                  onChange={(e) =>
                    handleNestedChange("salary", "min", e.target.value)
                  }
                />
                <Input
                  placeholder="Max ₹"
                  type="number"
                  value={formData.salary.max}
                  onChange={(e) =>
                    handleNestedChange("salary", "max", e.target.value)
                  }
                />
              </div>
            )}
          </section>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
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
