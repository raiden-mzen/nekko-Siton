import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { serviceList, Service as StaticService } from "../pages/Services";
import "../styles/booking.css";

type Service = {
  id?: number; // optional, since we're now using static list
  title: string;
  description: string;
  price?: string;
  image?: string;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  message: string;
  paymentProof: File | null;
}

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
    paymentProof: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const totalSteps = 4;

  useEffect(() => {
    // Instead of fetching from Supabase, use static list
    const staticServices: Service[] = serviceList.map((s) => ({
      title: s.title,
      description: s.description,
      price: s.price,
      image: s.image,
    }));
    setServices(staticServices);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, paymentProof: "Please upload a valid image (JPG, PNG, GIF)" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, paymentProof: "File size must be less than 5MB" });
      return;
    }

    setFormData({ ...formData, paymentProof: file });
    setErrors({ ...errors, paymentProof: undefined });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setFormData({ ...formData, paymentProof: null });
    setPreviewUrl("");
    if (errors.paymentProof) setErrors({ ...errors, paymentProof: undefined });
  };

  const validateStep = (): boolean => {
    let currentErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name) { currentErrors.name = "Full name is required."; isValid = false; }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { currentErrors.email = "Valid email is required."; isValid = false; }
      if (!formData.phone) { currentErrors.phone = "Phone number is required."; isValid = false; }
    } else if (step === 2) {
      if (!formData.service) { currentErrors.service = "Please select a service."; isValid = false; }
      if (!formData.date) { currentErrors.date = "Preferred date is required."; isValid = false; }
    } else if (step === 3) {
      if (!formData.paymentProof) { currentErrors.paymentProof = "Please upload your GCash payment proof."; isValid = false; }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps - 1 && validateStep()) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const selected = services.find((s) => s.title === formData.service);
        const parseNumber = (priceStr?: string) => {
          if (!priceStr) return 0;
          const match = priceStr.replace(/,/g, "").match(/(\d+)/);
          return match ? Number(match[1]) : 0;
        };
        const amount = selected ? parseNumber(selected.price) : 0;

        let proofUrl: string | null = null;
        if (formData.paymentProof) {
          const file = formData.paymentProof;
          const filename = `${formData.email || "anon"}_${Date.now()}_${file.name}`;
          const { data: uploadData, error: uploadErr } = await supabase.storage.from("booking_proofs").upload(filename, file);
          if (uploadErr) console.warn("Storage upload failed:", uploadErr);
          else {
            const { data: urlData } = supabase.storage.from("booking_proofs").getPublicUrl(uploadData.path);
            proofUrl = (urlData as any).publicUrl ?? null;
          }
        }

        const insertPayload: any = {
          client_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          date: formData.date,
          message: formData.message,
          amount,
          status: "pending",
        };
        if (proofUrl) insertPayload.payment_proof = proofUrl;

        const { data: insertResult, error: insertErr } = await supabase.from("bookings").insert([insertPayload]).select().single();
        if (insertErr) throw insertErr;

        console.log("Booking saved:", insertResult);
        setIsSubmitting(false);
        setStep(totalSteps);
      } catch (err: any) {
        console.error("Submit booking failed", err);
        setSubmitError(err?.message ?? String(err));
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="step-heading">1. Contact Info</h2>
            <p className="step-subheading">Tell us how to reach you.</p>
            <div className="form-group">
              <label>Your Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="step-heading">2. Service Details</h2>
            <p className="step-subheading">What are you looking to book?</p>
            <div className="form-group">
              <label>Service *</label>
              <select name="service" value={formData.service} onChange={handleChange}>
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.title} value={s.title}>
                    {s.title} {s.price ? `- ${s.price}` : ""}
                  </option>
                ))}
              </select>
              {errors.service && <p className="error-message">{errors.service}</p>}
            </div>
            <div className="form-group">
              <label>Preferred Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea name="message" value={formData.message} onChange={handleChange}></textarea>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="step-heading">3. Payment via GCash</h2>
            <div className="form-group">
              <label>Upload Payment Proof *</label>
              {!formData.paymentProof ? (
                <input type="file" accept="image/*" onChange={handleFileChange} />
              ) : (
                <div>
                  <img src={previewUrl} alt="proof" />
                  <button type="button" onClick={removeFile}>Remove</button>
                </div>
              )}
              {errors.paymentProof && <p className="error-message">{errors.paymentProof}</p>}
            </div>
          </>
        );
      case 4:
        return (
          <div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you, {formData.name}! Your request for {formData.service} on {formData.date} has been received.</p>
          </div>
        );
      default:
        return <p>Error in step rendering.</p>;
    }
  };

  const completionPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book a Session</h1>
        <form onSubmit={handleSubmit}>
          <div className="step-content">{renderStepContent()}</div>
          <div className="form-actions">
            {step > 1 && <button type="button" onClick={handlePrev}>← Back</button>}
            {step < totalSteps - 1 && <button type="button" onClick={handleNext}>Next →</button>}
            {step === totalSteps - 1 && <button type="submit">{isSubmitting ? "Submitting..." : "Confirm Booking"}</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
