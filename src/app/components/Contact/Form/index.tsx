"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    projectname: "",
    email: "",
    Project: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).every((value) => value.trim() !== "");
    setIsFormValid(isValid);
  }, [formData]);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const reset = () => {
    setFormData({
      name: "",
      projectname: "",
      email: "",
      Project: "",
      message: "",
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          projectname: formData.projectname,
          email: formData.email,
          project: formData.Project,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmitted(true);
      setShowThanks(true);
      reset();
      setTimeout(() => {
        setShowThanks(false);
      }, 5000);
    } catch (error: any) {
      console.log(error?.message || "Failed to submit form");
    } finally {
      setLoader(false);
    }
  };
  return (
    <section className="pb-16 sm:pb-24 !pt-0">
      <div className="container mx-auto lg:max-w-7xl md:max-w-screen-lg px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-7 col-span-1 md:pt-6 pt-0 relative">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-bold mb-6 text-slate-900">Get A Quote</h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap w-full m-auto justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="mx-0 my-2.5 flex-1">
                  <label
                    htmlFor="name"
                    className="pb-3 inline-block text-base"
                  >
                    User Name*
                  </label>
                  <input
                    id='name'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-base px-4 rounded-lg py-2.5 border-border border-solid border transition-all duration-500 focus:border-primary focus:outline-0"
                  />
                </div>
                <div className="mx-0 my-2.5 flex-1">
                  <label
                    htmlFor="projectname"
                    className="pb-3 inline-block text-base"
                  >
                    Project Name*
                  </label>
                  <input
                    id='projectname'
                    type='text'
                    name='projectname'
                    value={formData.projectname}
                    onChange={handleChange}
                    className="w-full text-base px-4 py-2.5 rounded-lg border-border border-solid border transition-all duration-500 focus:border-primary focus:outline-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="mx-0 my-2.5 flex-1">
                  <label
                    htmlFor="email"
                    className="pb-3 inline-block text-base"
                  >
                    Email address*
                  </label>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-base px-4 py-2.5 rounded-lg border-border border-solid border transition-all duration-500 focus:border-primary focus:outline-0"
                  />
                </div>
                <div className="mx-0 my-2.5 flex-1">
                  <label
                    htmlFor="Project"
                    className="pb-3 inline-block text-base"
                  >
                    Project*
                  </label>
                  <select name="Project"
                    id="Project"
                    value={formData.Project}
                    onChange={handleChange} className="w-full text-base px-4 py-2.5 rounded-lg border-border border-solid border transition-all duration-500 focus:border-primary focus:outline-0">
                    <option value="">Choose the type of app</option>
                    <option value="EdTech App">
                      EdTech App
                    </option>
                    <option value="eCommerce Apps">eCommerce Apps</option>
                    <option value="CRM Apps">CRM Apps</option>
                    <option value="Health Apps">
                      Health Apps
                    </option>
                    <option value="Web Analytics Apps">
                      Web Analytics Apps
                    </option>
                    <option value="Banking Apps">
                      Banking Apps
                    </option>
                  </select>
                </div>
              </div>
              <div className="w-full my-2.5">
                <label
                  htmlFor="message"
                  className="text-base inline-block pb-3"
                >
                  Message
                </label>
                  <textarea
                    id='message'
                    name='message'
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className='w-full border border-border px-4 py-3 focus:outline-hidden bg-white rounded-lg focus:border-primary'
                    placeholder='Anything else you wanna communicate'
                  ></textarea>
              </div>
              <div className="mx-0 my-4 w-full">
                <button
                  type="submit"
                  disabled={!isFormValid || loader}
                  className={`w-full sm:w-auto border leading-none px-8 text-lg font-medium py-4 rounded-xl ${!isFormValid || loader ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer transition-colors'}`}
                >
                  Submit
                </button>
              </div>
            </form>
            {showThanks && (
              <div className="text-white bg-green-500 rounded-xl px-5 py-3 text-base my-3 flex items-center gap-2">
                Request submitted successfully. Thank you.
                <div className="w-3 h-3 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          <div className="md:col-span-5 col-span-1 mt-6 md:mt-0">
            <Image
              src="/images/contact-page/contact.webp"
              alt="Contact"
              width={1300}
              height={0}
              quality={100}
              style={{ width: "100%", height: "auto" }}
              className="rounded-2xl shadow-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
