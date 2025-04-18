import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata } from '@/components/SEOconfig';

// This would come from your CMS or content files in production
const blogPosts = {
  'benefits-of-coworking-spaces': {
    title: 'The Top 10 Benefits of Coworking Spaces for Remote Workers',
    description: 'Discover why coworking spaces are the perfect solution for remote workers looking for productivity, networking, and work-life balance.',
    date: 'April 10, 2025',
    author: 'Jane Smith',
    tags: ['coworking', 'remote work', 'productivity', 'networking'],
    image: '/blog/coworking-benefits.jpg',
  },
  'hotdesking-guide': {
    title: 'The Complete Guide to Hot Desking: Maximize Flexibility and Save Costs',
    description: 'Learn everything about hot desking, from its benefits to best practices, and how it can transform your work habits and reduce office expenses.',
    date: 'March 25, 2025',
    author: 'David Johnson',
    tags: ['hot desking', 'flexible work', 'office rental', 'productivity'],
    image: '/blog/hotdesking-guide.jpg',
  },
  // Add more blog posts as needed
};

export const metadata = generateMetadata({
  title: "Office Space Blog | Hot Desking & Coworking Articles",
  description: "Tips, insights and guides about hot desking, coworking spaces, and office rental for freelancers, remote workers and businesses.",
});

export default function BlogPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          Office Space & Coworking Blog
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Insights, guides and resources about coworking, hot desking, and flexible workspace solutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Object.entries(blogPosts).map(([slug, post]) => (
            <Link 
              href={`/blog/${slug}`} 
              key={slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.image || '/blog/default.jpg'}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}