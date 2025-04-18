'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaqSchema } from './SchemaMarkup';

const FAQ = ({ location = null }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const locationText = location ? ` in ${location}` : '';

  const faqs = [
    {
      question: `What is a hot desk${locationText}?`,
      answer: `A hot desk${locationText} is a flexible workspace that different people use at different times on a first-come, first-served basis. It's perfect for freelancers, remote workers, or anyone who needs occasional office space${locationText}. Our hot desks${locationText} come with high-speed WiFi, access to kitchen facilities, and a professional work environment.`
    },
    {
      question: `What's the difference between coworking and hot desking${locationText}?`,
      answer: `Coworking${locationText} typically involves a dedicated desk in a shared office environment, which is yours alone to use whenever you want. Hot desking${locationText} means you use any available desk in the shared space. Our coworking memberships${locationText} provide you with a consistent workspace, while hot desking offers more flexibility for occasional use.`
    },
    {
      question: `Do you offer daily office space rental${locationText}?`,
      answer: `Yes, we offer daily office space rentals${locationText}. You can book a hot desk or a private office for just a day, with no long-term commitment required. Our daily rates start from £15 for a hot desk and £50 for a private office${locationText}. All daily rentals include WiFi, printing facilities, and access to kitchen amenities.`
    },
    {
      question: `What amenities are included with your office spaces${locationText}?`,
      answer: `Our office spaces${locationText} include high-speed WiFi, printing facilities, kitchen access with complimentary tea and coffee, meeting room access (bookable separately), mail handling, and a professional business environment. Private offices${locationText} also include dedicated storage, business address services, and 24/7 access.`
    },
    {
      question: `Do you have meeting rooms available${locationText}?`,
      answer: `Yes, we have professional meeting rooms available${locationText} that can be booked by the hour or day. Our meeting rooms come equipped with presentation facilities, high-speed internet, and can accommodate 4-12 people depending on the room. Both members and non-members can book our meeting rooms${locationText}.`
    },
    {
      question: `What are your opening hours${locationText}?`,
      answer: `Our standard opening hours${locationText} are Monday to Friday, 9am to 5pm. Members with 24/7 access plans can use the facilities at any time, including weekends and holidays. Reception services are only available during standard hours.`
    },
    {
      question: `Can I rent an office space for just one month${locationText}?`,
      answer: `Yes, we offer monthly office rentals${locationText} without long-term commitments. Our flexible office solutions${locationText} include monthly packages for hot desks, dedicated desks, and private offices. Monthly rates provide a significant discount compared to daily or weekly rates.`
    },
    {
      question: `Is there parking available at your locations${locationText}?`,
      answer: `Most of our locations${locationText} have parking facilities available either on-site or nearby. Some locations offer free parking, while others have paid parking options. Please check the specific location details for parking information, or contact us to learn about parking options at your preferred workspace${locationText}.`
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions{locationText}
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-gray-200 pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg py-2"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="mt-2 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <FaqSchema faqs={faqs} />
    </section>
  );
};

export default FAQ;