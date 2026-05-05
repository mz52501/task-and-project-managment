import React from 'react';
import {
    CheckCircle,
    MessageSquare,
    Clock,
    User,
} from 'lucide-react';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'task_completed',
            user: 'You',
            action: 'completed',
            target: 'User authentication setup',
            time: '2 minutes ago',
            icon: CheckCircle,
            color: 'text-green-600',
        },
        {
            id: 2,
            type: 'comment',
            user: 'Sarah Chen',
            action: 'commented on',
            target: 'Design review task',
            time: '15 minutes ago',
            icon: MessageSquare,
            color: 'text-blue-600',
        },
        {
            id: 3,
            type: 'time_logged',
            user: 'Mike Johnson',
            action: 'logged 2.5 hours on',
            target: 'API endpoint development',
            time: '1 hour ago',
            icon: Clock,
            color: 'text-purple-600',
        },
        {
            id: 4,
            type: 'assignment',
            user: 'Emma Wilson',
            action: 'was assigned to',
            target: 'Mobile app testing',
            time: '2 hours ago',
            icon: User,
            color: 'text-orange-600',
        },
        {
            id: 5,
            type: 'task_completed',
            user: 'David Park',
            action: 'completed',
            target: 'Database optimization',
            time: '3 hours ago',
            icon: CheckCircle,
            color: 'text-green-600',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-blue-600 mr-2"/>
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>

            <div className="h-64 overflow-y-auto space-y-4 pr-2">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`}/>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">{activity.user}</span>{' '}
                                {activity.action}{' '}
                                <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
