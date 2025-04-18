'use client';

import Link from 'next/link';
import { FaCheck, FaMinus } from 'react-icons/fa';

const FeatureComparison = ({ location = null }) => {
  const locationText = location ? ` in ${location}` : '';
  
  const plans = [
    {
      name: 'Hot Desk',
      description: `Flexible workspace${locationText} available on a first-come, first-served basis.`,
      price: '£15',
      period: 'per day',
      features: [
        { name: 'WiFi Access', included: true },
        { name: 'Kitchen Access', included: true },
        { name: 'Meeting Room Access', included: false },
        { name: 'Business Address', included: false },
        { name: '24/7 Access', included: false },
        { name: 'Dedicated Storage', included: false },
        { name: 'Printing Credits', included: false },
      ],
      popular: false,
      cta: 'Book a Hot Desk',
      link: '/properties?type=Hot+Desk'
    },
    {
      name: 'Coworking Desk',
      description: `Dedicated desk${locationText} in a shared workspace environment.`,
      price: '£199',
      period: 'per month',
      features: [
        { name: 'WiFi Access', included: true },
        { name: 'Kitchen Access', included: true },
        { name: 'Meeting Room Access', included: true },
        { name: 'Business Address', included: false },
        { name: '24/7 Access', included: true },
        { name: 'Dedicated Storage', included: true },
        { name: 'Printing Credits', included: true },
      ],
      popular: true,
      cta: 'Get a Coworking Desk',
      link: '/properties?type=Coworking+Desk'
    },
    {
      name: 'Private Office',
      description: `Enclosed private workspace${locationText} for your team.`,
      price: '£350',
      period: 'per month',
      features: [
        { name: 'WiFi Access', included: true },
        { name: 'Kitchen Access', included: true },
        { name: 'Meeting Room Access', included: true },
        { name: 'Business Address', included: true },
        { name: '24/7 Access', included: true },
        { name: 'Dedicated Storage', included: true },
        { name: 'Printing Credits', included: true },
      ],
      popular: false,
      cta: 'View Private Offices',
      link: '/properties?type=Private+Office'
    },
  ];
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Workspace Options{locationText}
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Choose the perfect workspace solution{locationText} for your needs, from flexible hot desks to dedicated private offices.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border ${plan.popular ? 'border-blue-500' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500"> {plan.period}</span>
                </div>
                
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      {feature.included ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaMinus className="text-gray-400 mr-2" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-500'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.link}
                  className={`block text-center py-2 px-4 rounded-lg transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;