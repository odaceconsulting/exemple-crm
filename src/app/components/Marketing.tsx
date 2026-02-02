import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Mail, MessageSquare, Layout, Users, GitBranch, Share2, BarChart3 } from 'lucide-react';

// Import Sub-modules
import { EmailDashboard } from './Marketing/Email/EmailDashboard';
import { SMSDashboard } from './Marketing/SMS/SMSDashboard';
import { LandingList } from './Marketing/Landing/LandingList';
import { SegmentsList } from './Marketing/Segmentation/SegmentsList';
import { WorkflowList } from './Marketing/Automation/WorkflowList';
import { SocialDashboard } from './Marketing/Social/SocialDashboard';
import { MarketingReporting } from './Marketing/Reporting/MarketingReporting';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('email');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Marketing Cloud</h1>
          <p className="text-gray-500 mt-1">Plateforme unifiée de gestion marketing</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white p-1 rounded-lg inline-flex mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto gap-2">
          <TabsTrigger value="email" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <Layout className="h-4 w-4" />
            <span className="hidden md:inline">Landing</span>
          </TabsTrigger>
          <TabsTrigger value="segmentation" className="gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Segments</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
            <GitBranch className="h-4 w-4" />
            <span className="hidden md:inline">Automation</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="reporting" className="gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Rapports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <EmailDashboard />
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <SMSDashboard />
        </TabsContent>

        <TabsContent value="landing" className="space-y-4">
          <LandingList />
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <SegmentsList />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <WorkflowList />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <SocialDashboard />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <MarketingReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
