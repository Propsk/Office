import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as createMetadata } from '@/components/SEOconfig';
import { FaCalendar, FaUser, FaTags } from 'react-icons/fa';

// This would come from your CMS or content files in production
const blogPosts = {
  'benefits-of-coworking-spaces': {
    title: 'The Top 10 Benefits of Coworking Spaces for Remote Workers',
    description: 'Discover why coworking spaces are the perfect solution for remote workers looking for productivity, networking, and work-life balance.',
    date: 'April 10, 2025',
    author: 'Jane Smith',
    tags: ['coworking', 'remote work', 'productivity', 'networking'],
    image: '/blog/coworking-benefits.jpg',
    content: `
      <h2>Why Choose a Coworking Space?</h2>
      <p>The traditional office environment is changing. With more companies embracing remote work, coworking spaces have emerged as the perfect middle ground between working from home and a traditional office.</p>
      
      <p>In this article, we explore the top benefits of choosing a coworking space for your daily work routine.</p>
      
      <h3>1. Enhanced Productivity</h3>
      <p>Coworking spaces are designed to boost productivity. The professional environment helps minimize distractions that are common at home, like household chores, family interruptions, or the temptation to watch TV.</p>
      
      <p>Most coworking spaces feature ergonomic furniture, proper lighting, and temperature control - all factors that contribute to a more productive workday.</p>
      
      <h3>2. Networking Opportunities</h3>
      <p>One of the biggest advantages of coworking spaces is the opportunity to connect with professionals from different industries. These connections can lead to collaborations, new business opportunities, or simply a chance to exchange ideas.</p>
      
      <p>Many coworking spaces also host networking events, workshops, and social gatherings to facilitate community building.</p>
      
      <h3>3. Cost-Effective Solution</h3>
      <p>Renting a traditional office space comes with significant overhead costs - utilities, internet, furniture, cleaning services, and more. Coworking spaces bundle all these amenities into a simple membership fee.</p>
      
      <p>For freelancers and small businesses, this means access to professional office facilities without the high costs of maintaining a private office.</p>
      
      <h3>4. Flexibility and Scalability</h3>
      <p>Coworking spaces offer flexible membership options - from daily passes to monthly commitments. This flexibility is perfect for growing businesses with changing space requirements.</p>
      
      <p>Need to expand your team? Many coworking spaces allow you to easily scale up your membership to accommodate additional team members.</p>
      
      <h3>5. Work-Life Balance</h3>
      <p>Working from home can blur the lines between professional and personal life. Coworking spaces create a clear distinction between your work environment and home, promoting a healthier work-life balance.</p>
      
      <p>Having a dedicated workplace to go to helps establish a routine and makes it easier to "switch off" when you return home.</p>
      
      <h3>6. Professional Meeting Spaces</h3>
      <p>Need to meet with clients or hold team meetings? Coworking spaces typically offer meeting rooms equipped with presentation technology - a significant upgrade from meeting at a noisy coffee shop or your living room.</p>
      
      <h3>7. Reduced Isolation</h3>
      <p>Remote work can sometimes be isolating. Coworking spaces provide a sense of community and human interaction that many remote workers miss when working from home.</p>
      
      <h3>8. Access to Amenities</h3>
      <p>Most coworking spaces offer amenities like high-speed internet, printing facilities, kitchen areas, and sometimes even relaxation zones or fitness centers.</p>
      
      <h3>9. Inspiring Environment</h3>
      <p>Coworking spaces are often designed to inspire creativity and innovation. The energetic atmosphere of people working diligently around you can be highly motivating.</p>
      
      <h3>10. Location Flexibility</h3>
      <p>Many coworking providers have multiple locations, allowing you to work from different parts of the city or even different cities when traveling.</p>
      
      <h2>Finding the Right Coworking Space</h2>
      <p>With the growing popularity of coworking spaces, there are now options to suit every need and preference. Whether you're looking for a quiet, focused environment or a vibrant community space, you can find a coworking solution that works for you.</p>
      
      <p>At RentOfficeSpace.co.uk, we offer a variety of coworking options across the East Midlands, including hot desks, dedicated desks, and private offices.</p>
      
      <h3>Ready to try coworking?</h3>
      <p>Browse our available spaces or contact us to schedule a tour. Experience the benefits of coworking for yourself!</p>
    `
  },
  'hotdesking-guide': {
    title: 'The Complete Guide to Hot Desking: Maximize Flexibility and Save Costs',
    description: 'Learn everything about hot desking, from its benefits to best practices, and how it can transform your work habits and reduce office expenses.',
    date: 'March 25, 2025',
    author: 'David Johnson',
    tags: ['hot desking', 'flexible work', 'office rental', 'productivity'],
    image: '/blog/hotdesking-guide.jpg',
    content: `
      <h2>What is Hot Desking?</h2>
      <p>Hot desking is a workspace organization system where multiple workers use a single physical workstation during different time periods. Unlike dedicated desks, hot desks are available on a first-come, first-served basis, offering maximum flexibility for workers who don't need a permanent desk.</p>
      
      <p>This approach to office space has gained popularity as remote work and flexible schedules become more common in modern workplaces.</p>
      
      <h2>The Benefits of Hot Desking</h2>
      
      <h3>Cost Efficiency</h3>
      <p>For businesses, hot desking significantly reduces real estate costs by maximizing office space usage. For individuals, it offers affordable access to professional workspace without the commitment of a full-time office.</p>
      
      <h3>Flexibility</h3>
      <p>Hot desking provides the ultimate flexibility. You can work when and where you want, whether that's a few hours a week or several days a month. This makes it perfect for freelancers, remote workers, or anyone with a variable schedule.</p>
      
      <h3>Networking Opportunities</h3>
      <p>By working alongside different people each day, hot desking naturally creates opportunities for networking and collaboration. You'll be exposed to professionals from various industries, potentially leading to new connections and business opportunities.</p>
      
      <h3>Reduced Commute</h3>
      <p>Many hot desking providers offer multiple locations, allowing you to choose a workspace closer to home or your meetings for the day, reducing your commute time.</p>
      
      <h2>Hot Desking Best Practices</h2>
      
      <h3>1. Book in Advance</h3>
      <p>While hot desking operates on a first-come basis, many spaces allow advance booking. Planning ahead ensures you'll have a workspace ready, especially during busy periods.</p>
      
      <h3>2. Pack Essentials</h3>
      <p>Develop a hot desking kit with all your essential items - laptop, charger, headphones, notebook, and any other tools you regularly use.</p>
      
      <h3>3. Clean as You Go</h3>
      <p>Always leave your hot desk clean and tidy for the next user. This maintains a professional environment and is especially important in our post-pandemic world.</p>
      
      <h3>4. Use Cloud Storage</h3>
      <p>Since you'll be working from different desks, storing your work in the cloud ensures you can access your files from anywhere.</p>
      
      <h3>5. Respect Others</h3>
      <p>Be mindful of noise levels, phone calls, and other potential disruptions to create a productive environment for everyone.</p>
      
      <h2>Who Should Consider Hot Desking?</h2>
      
      <h3>Freelancers and Consultants</h3>
      <p>For independent professionals who need occasional access to office facilities, hot desking provides an affordable alternative to home working or coffee shops.</p>
      
      <h3>Remote Workers</h3>
      <p>Employees who primarily work remotely but occasionally need a professional workspace away from home can benefit from hot desking arrangements.</p>
      
      <h3>Small Businesses</h3>
      <p>Startups and small businesses can save on overhead costs by using hot desking for team members who don't need to be in the office full-time.</p>
      
      <h3>Frequent Travelers</h3>
      <p>Professionals who travel between cities can use hot desking networks to find workspace wherever they go.</p>
      
      <h2>Hot Desking at RentOfficeSpace.co.uk</h2>
      <p>We offer flexible hot desking solutions across the East Midlands, with daily rates starting from just £15. Our hot desks include high-speed WiFi, access to kitchen facilities, and a professional work environment.</p>
      
      <p>Want to try hot desking? Browse our available locations or contact us to learn more about our flexible workspace solutions.</p>
    `
  },
  // Add more blog posts as needed
};

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {};
  }
  
  return createMetadata({
    title: post.title,
    description: post.description,
    keywords: post.tags.join(', '),
  });
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map(slug => ({
    slug,
  }));
}

export default function BlogPost({ params }) {
  const { slug } = params;
  const post = blogPosts[slug];
  
  if (!post) {
    return notFound();
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <article className="container mx-auto px-4 max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-[400px] w-full">
          <Image
            src={post.image || '/blog/default.jpg'}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-gray-600 mb-8">
            <div className="flex items-center mr-6 mb-2">
              <FaCalendar className="mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <FaUser className="mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaTags className="mr-2" />
              <div className="flex flex-wrap">
                {post.tags.map((tag, index) => (
                  <Link 
                    key={tag} 
                    href={`/blog/tag/${tag.replace(/\s+/g, '-')}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    {tag}{index < post.tags.length - 1 ? ',' : ''}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Looking for office space?</h3>
            <p className="mb-4">Browse our selection of hot desks, coworking spaces, and private offices to find your perfect workspace solution.</p>
            <Link
              href="/properties"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              View Available Spaces
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}