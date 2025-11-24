import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "Understanding Common Cold vs. Flu: Key Differences",
      excerpt:
        "Learn to distinguish between cold and flu symptoms and when to seek medical attention.",
      date: "2024-01-15",
      readTime: "5 min",
      category: "Health Tips",
    },
    {
      title: "How AI is Revolutionizing Healthcare Diagnostics",
      excerpt:
        "Explore the latest advancements in artificial intelligence and its impact on medical diagnosis.",
      date: "2024-01-10",
      readTime: "8 min",
      category: "Technology",
    },
    {
      title: "Top 10 Home Remedies for Common Ailments",
      excerpt:
        "Discover effective natural remedies you can try at home for everyday health issues.",
      date: "2024-01-05",
      readTime: "6 min",
      category: "Wellness",
    },
    {
      title: "When to See a Doctor: A Comprehensive Guide",
      excerpt:
        "Understanding urgency levels and knowing when professional medical help is necessary.",
      date: "2024-01-01",
      readTime: "7 min",
      category: "Healthcare",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Health Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, health tips, and the latest in medical technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-2xl text-gray-900 hover:text-blue-900 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
