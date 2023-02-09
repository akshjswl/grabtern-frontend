import React, { useEffect, useState } from 'react';
import axios, { formToJSON } from 'axios'
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
export default function MentorForm() {
  const router = useRouter()
  const [modalPopup, setModalPopup] = useState(false);
  const [waitTime, setWaitTime] = useState(5);
  const [mentorImg, setMentorImg] = useState('')
  // const [verifyMentorLink, setVerifyMentorLink] = useState();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  let number = Math.random(0 * 100);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    internAt: '',
    currentStatus: '',
    social: {
      linkedin: '',
      twitter: '',
    },
    description: '',
    mentorImg: '',
    sessionPrice: '',
    // resume: '',
    password: `GrabternMentorPW!${number}!`,
    confirmPassword: `GrabternMentorPW!${number}!`,
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = e => {
    setFormData({ ...formData, social: { ...formData.social, [e.target.name]: e.target.value } });
  };

  useEffect(() => {
    if (modalPopup === true && waitTime !== 0) {
      setTimeout(() => {
        setWaitTime(value => value -= 1);
      }, 1000)
    }
    if (waitTime === 0) {
      router.push('/')
    }
  })

  // const handleFileChange = e => {
  //   setFormData({ ...formData, resume: e.target.files[0] });
  // };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

const handleUploadImageChange = async (e) => {
  const file = e.target.files[0];
  const base64 = await convertBase64(file);
  setFormData({...formData, mentorImg: base64});
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    try {
      console.log(formData)
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentors/mentorRegister`;
      const {data: res} = await axios.post(url, formData);
      sendEmail(res.mentorVerifyLink)
    } catch (error) {
      console.log(error)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }

  };

  const sendEmail = (verifyMentorLink) => {
    const templateParams = {
      mentorName: formData.name,
      message: `Hi I am ${formData.name}
      \nI want to register my account as mentor at Grabtern and here is my info:
                \nEmail: ${formData.email}
\nMy Phone Number: ${formData.mobile}
\nIntern At: ${formData.internAt}
\nCurrent Status: ${formData.currentStatus}
\nMy linkedin profile: ${formData.social.linkedin}
\nMy twitter profile: ${formData.social.twitter}
\nDescription: ${formData.description}
\nSession Price for Each Intern: ${formData.sessionPrice}
\n Thank you
\n To Approve the mentor please click the link below: ${verifyMentorLink}`,
    }
    console.log(templateParams)
    emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_MENTOR_REGISTRATION_KEY, templateParams, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY).then((result) => {
      setModalPopup(true);
      console.log(result.text);
    }, (error) => {
      alert("Cannot send your message sorry!")
      console.log(error.text);
    });
  }

  return (
    <div className='mentorFormRegisration'>
      {modalPopup === true ? (<div className='modalPopup'>
        <div className='modalPopupAfterRegistrationDone'>
          <p>Thank you for Registering you will be recevied an email 1-2 days if you got accepted</p>
          <img src="/iconMentorRegistrationPopup.jpg" />
          <p>Redirecting you to home in {waitTime} second</p>
        </div>
      </div>) : null}
      <div className='container'>
        <form className="mentorForm" onSubmit={handleSubmit}>
          <div>
            <label for="name">Name</label>
            <input type="text" name="name" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. Peter Parker" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="text" name="email" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. peterparker4321#gmail.com" required />
          </div>
          <div>
            <label for="mobile">Mobile Number</label>
            <input type="number" name="mobile" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="0123456789" required />
          </div>
          <div>
            <label for="internAt">Intern At</label>
            <input type="text" name="internAt" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. MITACS" required />
          </div>
          <div>
            <label for="currentStatus">Current Status</label>
            <input type="text" name="currentStatus" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. Amazon SDE-I" required />
          </div>
          <div>
            <label for="linkedin">Linkedin</label>
            <input type="text" name="linkedin" className="mentorFormInput" onChange={(e) => handleSocialChange(e)} placeholder="e.g. https://www.linkedin.com/peterparker" required />
          </div>
          <div>
            <label for="twitter">Twitter</label>
            <input type="text" name="twitter" className="mentorFormInput" onChange={(e) => handleSocialChange(e)} placeholder="e.g. https://www.twitter.com/peterparker" required />
          </div>
          <div>
            <label for="mentorProfile">Your Mentor Profile:</label>
            <input type="file" name="mentorProfile" className="mentorFormInput" onChange={(e) => handleUploadImageChange(e)} required />
          </div>
          <div style={{ gridColumn: "1/3" }}>
            <label for="description">Description</label>
            <textarea cols="10" rows="7" name="description" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="I've done myI have been working as SDE-I for past 1 years at microsoft..." required />
          </div>
          <div style={{ gridColumn: "1/3" }}>
            <label for="sessionPrice">Session Price</label>
            <input type="text" name="sessionPrice" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. $27" required />
          </div>
          {/* <div>
            <label for="password">Password</label>
            <input type="password" name="password" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. @abcd@321" required />
          </div>
          <div>
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" className="mentorFormInput" onChange={(e) => handleChange(e)} placeholder="e.g. @abcd@321" required />
          </div> */}
          {/* <div>
            <label for="resume">Resume/CV</label>
            <input type="file" name="resume" className="mentorFormInput" required />
          </div> */}
          {error && <div style={{ color: "red", gridColumn: "1/3" }}>{error}</div>}
          {msg && <div style={{ color: "green", gridColumn: "1/3" }}>{msg}</div>}
          <button type='submit' className='mentorFormButotn'>Register</button>
          <p>Already have mentor account? <a href="#">Login</a></p>
          <a href="#">Forgot password?</a>
        </form>
      </div>
    </div>
  )
} 