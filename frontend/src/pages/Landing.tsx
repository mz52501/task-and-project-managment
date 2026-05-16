import React from "react";
import { Link } from "react-router-dom";
import { Check, Clock, Kanban, User } from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation
            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
                <div className="flex justify-center items-center h-16">
                    <div className="font-bold text-3xl text-blue-900">HyperFlow</div>
                </div>
            </nav>
            */}

      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Projects Like a <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your workflow with powerful task management, time tracking, and team
            collaboration tools. Built for teams that ship fast.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-800 transition"
            >
              Start Managing Tasks
            </Link>
            <Link
              to="/registration"
              className="border border-blue-900 text-blue-900 px-6 py-3 rounded-md text-lg hover:bg-blue-100 transition"
            >
              Not a member yet?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to keep your projects on track
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Kanban className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
              title="Kanban Boards"
              description="Visual task management with drag-and-drop simplicity"
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />}
              title="Time Tracking"
              description="Track time spent on tasks with detailed reporting"
            />
            <FeatureCard
              icon={<User className="w-12 h-12 text-purple-600 mx-auto mb-4" />}
              title="Team Roles"
              description="Assign roles and permissions for better collaboration"
            />
            <FeatureCard
              icon={<Check className="w-12 h-12 text-orange-600 mx-auto mb-4" />}
              title="Task Management"
              description="Create, assign, and track tasks with subtasks and comments"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-shadow">
    {icon}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default Landing;
