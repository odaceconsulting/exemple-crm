import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Construction } from 'lucide-react';

interface HRPlaceholderProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

export const HRPlaceholder: React.FC<HRPlaceholderProps> = ({ title, description, icon: Icon }) => {
    return (
        <Card className="border-0 shadow-sm bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                    <Icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">{description}</p>

                <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                    <Construction className="h-4 w-4" />
                    <span className="font-medium">Module en cours de développement</span>
                </div>
            </CardContent>
        </Card>
    );
};
