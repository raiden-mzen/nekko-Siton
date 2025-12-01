import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
// ...existing code...
type Service = {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
};
// ...existing code...
import "../styles/booking.css";

// Define the shape of the form data
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
  const [loadingServices, setLoadingServices] = useState(true);
  // Define steps for the progress bar
  const totalSteps = 4; // 1: Contact, 2: Details, 3: Payment, 4: Success
  React.useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      const { data, error } = await supabase.from("services").select("*");
      if (error) {
        console.error("Error fetching services:", error.message);
      } else {
        setServices(data as Service[]);
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being changed
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, paymentProof: "Please upload a valid image (JPG, PNG, GIF)" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, paymentProof: "File size must be less than 5MB" });
        return;
      }

      setFormData({ ...formData, paymentProof: file });
      setErrors({ ...errors, paymentProof: undefined });

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, paymentProof: null });
    setPreviewUrl("");
    if (errors.paymentProof) {
      setErrors({ ...errors, paymentProof: undefined });
    }
  };

  const validateStep = (): boolean => {
    let currentErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    // Validation for Step 1 (Contact Info)
    if (step === 1) {
      if (!formData.name) {
        currentErrors.name = "Full name is required.";
        isValid = false;
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        currentErrors.email = "Valid email is required.";
        isValid = false;
      }
      if (!formData.phone) {
        currentErrors.phone = "Phone number is required.";
        isValid = false;
      }
    }
    // Validation for Step 2 (Service Details)
    else if (step === 2) {
      if (!formData.service) {
        currentErrors.service = "Please select a service.";
        isValid = false;
      }
      if (!formData.date) {
        currentErrors.date = "Preferred date is required.";
        isValid = false;
      }
    }
    // Validation for Step 3 (Payment)
    else if (step === 3) {
      if (!formData.paymentProof) {
        currentErrors.paymentProof = "Please upload your GCash payment proof.";
        isValid = false;
      }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps - 1 && validateStep()) {
      setIsSubmitting(true);
      setSubmitError(null);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("service", formData.service);
      submitData.append("date", formData.date);
      submitData.append("message", formData.message);
      if (formData.paymentProof) {
        submitData.append("paymentProof", formData.paymentProof);
      }

      try {
        // determine amount from service selection using fetched services
        const selected = services.find((s) => s.title === formData.service);
        const parseNumber = (priceStr: string) => {
          if (!priceStr) return 0;
          const match = priceStr.replace(/,/g, "").match(/(\d+)/);
          return match ? Number(match[1]) : 0;
        };
        const amount = selected ? parseNumber(selected.price ?? "") : 0;

        // optional upload of payment proof to storage bucket 'booking_proofs'
        let proofUrl: string | null = null
        if (formData.paymentProof) {
          try {
            const file = formData.paymentProof
            const filename = `${formData.email || 'anon'}_${Date.now()}_${file.name}`
            const { data: uploadData, error: uploadErr } = await supabase.storage.from('booking_proofs').upload(filename, file)
            if (uploadErr) {
              console.warn('Storage upload failed:', uploadErr)
            } else {
              // get public URL (bucket must be configured as public or have appropriate policies)
              try {
                const { data: urlData } = supabase.storage.from('booking_proofs').getPublicUrl(uploadData.path)
                proofUrl = (urlData as any).publicUrl ?? null
              } catch (uErr) {
                console.warn('Could not get public url', uErr)
              }
            }
          } catch (err) {
            console.warn('Payment proof upload error', err)
          }
        }

        // insert booking into bookings table
        const insertPayload: any = {
          client_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          date: formData.date,
          message: formData.message,
          amount,
          status: 'pending',
        }
        if (proofUrl) insertPayload.payment_proof = proofUrl

        const { data: insertResult, error: insertErr } = await supabase.from('bookings').insert([insertPayload]).select().single()
        if (insertErr) throw insertErr

        console.log('Booking saved:', insertResult)
        setIsSubmitting(false)
        setStep(totalSteps) // Move to success
      } catch (err: any) {
        console.error('Submit booking failed', err)
        setSubmitError(err?.message ?? String(err))
        setIsSubmitting(false)
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

            {/* Name */}
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Your Email *</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="+63 912 345 6789"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="step-heading">2. Service Details</h2>
            <p className="step-subheading">What are you looking to book?</p>
            {/* Service */}
            <div className="form-group">
              <label>Service *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={loadingServices}
              >
                <option value="">{loadingServices ? "Loading services..." : "Select a service"}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title} {s.price ? `- ${s.price}` : ""}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="error-message">{errors.service}</p>
              )}
            </div>
            {/* Date */}
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>
            {/* Message */}
            <div className="form-group">
              <label>Additional Notes (optional)</label>
              <textarea
                name="message"
                placeholder="Tell us about your event, preferred time, special requirements..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
              ></textarea>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="step-heading">3. Payment via GCash</h2>
            <p className="step-subheading">
              Send your payment and upload the proof.
              <p>GCASH number: 092172example</p>
              <p>GCASH name: hello world</p>
            </p>
            

            {submitError && <p className="error-message">{submitError}</p>}

            <div className="review-summary">
              <h3>Booking Summary</h3>
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p>
                <strong>Service:</strong> {formData.service || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {formData.date || "N/A"}
              </p>
              {formData.message && (
                <p>
                  <strong>Notes:</strong> {formData.message}
                </p>
              )}
            </div>

            {/* GCash Payment Instructions */}
            <div className="payment-instructions">
              <h3>GCash Payment Instructions</h3>
              <div className="gcash-details">
                <p>
                  <strong>GCash Number:</strong> 0912 345 6789
                </p>
                <p>
                  <strong>Account Name:</strong> Juan Dela Cruz
                </p>
                <p>
                  <strong>Amount:</strong> See pricing on Services page
                </p>
              </div>
              <ol>
                <li>Open your GCash app</li>
                <li>Send payment to the number above</li>
                <li>Take a screenshot of the confirmation</li>
                <li>Upload the screenshot below</li>
              </ol>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>Upload Payment Proof *</label>
              <div className="file-upload-container">
                {!formData.paymentProof ? (
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="upload-placeholder">
                      <span className="upload-icon">📤</span>
                      <p>Click to upload or drag and drop</p>
                      <p className="upload-hint">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </label>
                ) : (
                  <div className="file-preview">
                    <img src={previewUrl} alt="Payment proof" />
                    <div className="file-info">
                      <p className="file-name">{formData.paymentProof.name}</p>
                      <p className="file-size">
                        {(formData.paymentProof.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="remove-file-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errors.paymentProof && (
                <p className="error-message">{errors.paymentProof}</p>
              )}
            </div>
          </>
        );
      case 4:
        return (
          <div className="success-message">
            <span className="success-icon">🎉</span>
            <h2 className="step-heading">Booking Confirmed!</h2>
            <p className="step-subheading">
              Thank you, <strong>{formData.name}</strong>! Your request for{" "}
              <strong>{formData.service}</strong> on{" "}
              <strong>{formData.date}</strong> has been received.
            </p>
            <p>
              We've sent a confirmation email to{" "}
              <strong>{formData.email}</strong> with the next steps.
            </p>
            <p className="success-note">
              We'll verify your payment and get back to you within 24 hours.
            </p>
          </div>
        );
      default:
        return <p>Error in step rendering.</p>;
    }
  };

  // Calculate completion percentage for the progress bar
  const completionPercent = Math.min(
    ((step - 1) / (totalSteps - 1)) * 100,
    100
  );

  return (
    <div className="booking-page">
        
      <div className="booking-container">
        <h1 className="booking-title">Book a Session</h1>
        <p className="booking-subtitle">
          Fill out the form and we'll get back to you shortly.
        </p>
        <div className="booking-form123">
        <div className="booking-form">
        {/* Multi-Step Progress Bar */}
        {step < totalSteps && (
          <div className="progress-container">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {["Contact", "Details", "Payment", "Finalize"].map(
                (label, index) => (
                  <div
                    key={index}
                    className={`progress-step-item ${
                      step >= index + 1 ? "active" : ""
                    } ${step > index + 1 ? "completed" : ""}`}
                  >
                    <div className="step-circle">{index + 1}</div>
                    <span className="step-label">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <form className="step-form" onSubmit={handleSubmit}>
          <div className="step-content">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="form-actions">
            {step > 1 && step < totalSteps && (
              <button
                type="button"
                onClick={handlePrev}
                className="action-btn prev-btn"
              >
                ← Back
              </button>
            )}
            {step < totalSteps - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="action-btn next-btn"
              >
                Next Step →
              </button>
            )}
            {step === totalSteps - 1 && (
              <button
                type="submit"
                className="action-btn submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
      </div>
      </div>
    
  );
};

export default Booking;
