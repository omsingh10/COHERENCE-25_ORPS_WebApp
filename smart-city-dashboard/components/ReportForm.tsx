'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const issueCategories = [
  { id: 'infrastructure', name: 'Infrastructure Issues' },
  { id: 'environment', name: 'Environmental Concerns' },
  { id: 'publicSafety', name: 'Public Safety' },
  { id: 'traffic', name: 'Traffic Problems' },
  { id: 'other', name: 'Other' },
];

const priorityLevels = [
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' },
];

export default function ReportForm() {
  const [formData, setFormData] = useState({
    category: '',
    priority: '',
    location: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after submission
      setFormData({
        category: '',
        priority: '',
        location: '',
        description: '',
        name: '',
        email: '',
        phone: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {submitted ? (
        <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex flex-col items-center text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-green-800">Thank you for your report!</h3>
            <p className="mt-2 text-sm text-green-700">
              Your issue has been submitted successfully. Our team will review it shortly.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="form-label">
                Issue Category <span className="text-danger-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select a category</option>
                {issueCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="form-label">
                Priority Level <span className="text-danger-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select priority</option>
                {priorityLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="location" className="form-label">
                Location <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                placeholder="Enter the address or coordinates"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="form-label">
                Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="Please provide details about the issue"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 