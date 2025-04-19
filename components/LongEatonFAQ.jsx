'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaqSchema } from './SchemaMarkup';

const LongEatonFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of workspace do you offer in Long Eaton?",
      answer: "We offer a range of workspace options in Long Eaton including hot desks available from £15 per day, dedicated desks from £199 per month, and private offices starting at £350 per month. All our spaces come with high-speed WiFi, kitchen facilities, and access to meeting rooms."
    },
    {
      question: "Where is your Long Eaton office space located?",
      answer: "Our Long Eaton workspace is centrally located on the High Street, just a short walk from Long Eaton train station and local amenities. We're easily accessible by car (5 minutes from M1 Junction 25), train, and bus, with free parking available for members."
    },
    {
      question: "Do you offer day passes for hot desking in Long Eaton?",
      answer: "Yes, we offer flexible day passes for hot desking in our Long Eaton workspace starting at £15 per day. This gives you access to our professional workspace environment with no long-term commitment required. We also offer discounted 5-day and 10-day packages for regular users."
    },
    {
      question: "Can I book a meeting room in Long Eaton without being a member?",
      answer: "Yes, our meeting rooms in Long Eaton are available to both members and non-members. Rates start at £25 per hour for our standard meeting room which accommodates up to 6 people. Our larger meeting space for up to 12 people is available at £40 per hour. Both come equipped with presentation facilities and high-speed internet."
    },
    {
      question: "What are the opening hours of your Long Eaton workspace?",
      answer: "Our Long Eaton workspace is open from 9am to 5pm, Monday to Friday for day pass users. Members with monthly packages have 24/7 access using their secure entry card. The staffed reception is available during standard hours only."
    },
    {
      question: "Is there parking available at your Long Eaton location?",
      answer: "Yes, we provide free parking for all members at our Long Eaton workspace. Day pass users can also use our parking facilities on a space-available basis. Additionally, there is public parking available within a short walking distance, including at Long Eaton train station and the town center car parks."
    },
    {
      question: "What businesses typically use your Long Eaton workspace?",
      answer: "Our Long Eaton workspace hosts a diverse mix of businesses, from freelancers and remote workers to small professional service firms and startup teams. We have members from creative industries, consulting, technology, accounting, marketing, and many other sectors. This diversity creates an excellent community for networking and collaboration."
    },
    {
      question: "Can I use your Long Eaton address as my business address?",
      answer: "Yes, we offer virtual office services for businesses needing a professional address in Long Eaton. For £35 per month, you can use our address for business registration and correspondence, with mail handling and forwarding services available. This service can be purchased separately or included with workspace memberships."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions About Our Long Eaton Workspace
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

export default LongEatonFAQ;