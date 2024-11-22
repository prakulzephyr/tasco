"use client"
import {
  useEffect,
  useState,
} from 'react';

import {
  addDoc,
  collection,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/firebase/config';

export default function ZephyrSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    school: '',
    uilDivision: 'N/A',
  })

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const { firstName, lastName, phoneNumber, email, school } = formData
    setIsFormValid(firstName !== '' && lastName !== '' && phoneNumber !== '' && email !== '' && school !== '')
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Remove all non-numeric characters and format as E.164
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
      setFormData(prevData => ({ ...prevData, [name]: formatted }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  }

  const handleUILDivisionChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, uilDivision: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        // Add timestamp to the data
        const submissionData = {
          ...formData,
          timestamp: new Date(),
        };

        // Add document to Firestore
        await addDoc(collection(db, "users"), submissionData);

        // Send email notification
        const notifyResponse = await fetch('/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            school: formData.school,
          }),
        });

        if (!notifyResponse.ok) {
          throw new Error('Failed to send email notification');
        }

        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          school: '',
          uilDivision: 'N/A',
        });

        alert("You're successfully signed up - please check your spam!");
      } catch (error) {
        console.error("Error:", error);
        alert("There was an error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Zephyr%20Logo-BEBVsfVf0AnKzQw55NldnGzVaCPY5j.png"
            alt="Zephyr Logo"
            className="h-16 mb-4"
          />
          <h2 className="text-2xl font-bold text-center text-[#4F7382]">Sign Up for a Chat!</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="uilDivision">UIL Division (if applicable)</Label>
            <Select onValueChange={handleUILDivisionChange} value={formData.uilDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Select UIL Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">Not Applicable</SelectItem>
                <SelectItem value="1A">1A</SelectItem>
                <SelectItem value="2A">2A</SelectItem>
                <SelectItem value="3A">3A</SelectItem>
                <SelectItem value="4A">4A</SelectItem>
                <SelectItem value="5A">5A</SelectItem>
                <SelectItem value="6A">6A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className={`w-full ${isFormValid
              ? "bg-[#4F7382] hover:bg-[#3A5A68] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!isFormValid}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  )
}

