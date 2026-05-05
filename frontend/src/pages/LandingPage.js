import {FaChartBar, FaProjectDiagram, FaUsers} from "react-icons/fa";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
            {/* Hero Section */}
            <section className="w-full text-center py-20 bg-blue-600 text-white">
                <motion.h1
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-5xl font-bold"
                >
                    Welcome to HyperFlow
                </motion.h1>
                <p className="mt-4 text-lg">Effortless project management and task tracking for your team.</p>
                <Link to="/registration"
                      className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition">
                    Get Started
                </Link>
            </section>

            {/* Features Section */}
            <section className="py-16 px-8 grid md:grid-cols-3 gap-8 text-center">
                <FeatureCard icon={<FaProjectDiagram size={40}/>} title="Project Management"
                             description="Create, manage, and organize projects efficiently."/>
                <FeatureCard icon={<FaUsers size={40}/>} title="Team Collaboration"
                             description="Assign tasks, set priorities, and collaborate with ease."/>
                <FeatureCard icon={<FaChartBar size={40}/>} title="Analytics & Insights"
                             description="Track progress with powerful reports and dashboards."/>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-8 bg-white w-full text-center">
                <h2 className="text-3xl font-bold">How It Works</h2>
                <div className="mt-8 grid md:grid-cols-3 gap-8">
                    <StepCard step="1" title="Create a Project"
                              description="Set up a new project and invite your team members."/>
                    <StepCard step="2" title="Manage Tasks" description="Break down work into tasks and assign them."/>
                    <StepCard step="3" title="Track Progress"
                              description="Use dashboards and reports to monitor team efficiency."/>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-8 text-center">
                <h2 className="text-3xl font-bold">What Our Users Say</h2>
                <p className="mt-4 text-gray-600">“HyperFlow transformed the way our team collaborates. Simple,
                    powerful, and effective!”</p>
                <p className="mt-2 font-semibold">- Alex Johnson, Team Lead</p>
            </section>

            {/* Final Call to Action */}
            <section className="py-16 px-8 w-full text-center bg-blue-600 text-white">
                <h2 className="text-3xl font-bold">Start Managing Projects Today</h2>
                <p className="mt-2">Join thousands of teams using HyperFlow to stay productive.</p>
                <Link to="/registration"
                      className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition">
                    Get Started for Free
                </Link>
            </section>
        </div>
    );
}

function FeatureCard({icon, title, description}) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="text-blue-600 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
        </div>
    );
}

function StepCard({step, title, description}) {
    return (
        <div className="p-6 bg-gray-200 shadow-md rounded-lg">
            <div className="text-blue-600 text-4xl font-bold mb-2">{step}</div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
        </div>
    );

}
