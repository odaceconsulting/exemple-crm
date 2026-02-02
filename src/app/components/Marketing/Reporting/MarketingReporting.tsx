import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Download, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Pie, PieChart, Cell, Legend } from 'recharts';

export const MarketingReporting = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const data = [
        { name: 'Jan', revenue: 4000, cost: 2400 },
        { name: 'Feb', revenue: 3000, cost: 1398 },
        { name: 'Mar', revenue: 2000, cost: 9800 },
        { name: 'Apr', revenue: 2780, cost: 3908 },
        { name: 'May', revenue: 1890, cost: 4800 },
        { name: 'Jun', revenue: 2390, cost: 3800 },
    ];

    const pieData = [
        { name: 'Email', value: 400, color: '#3b82f6' },
        { name: 'Social', value: 300, color: '#ec4899' },
        { name: 'SMS', value: 300, color: '#f97316' },
        { name: 'Direct', value: 200, color: '#10b981' },
    ];

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="roi">ROI & Coûts</TabsTrigger>
                        <TabsTrigger value="attribution">Attribution</TabsTrigger>
                    </TabsList>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter PDF
                    </Button>
                </div>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Revenu Généré</p>
                                <p className="text-2xl font-bold text-gray-900">124,500 €</p>
                                <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +12% vs N-1</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Coût d'acquisition</p>
                                <p className="text-2xl font-bold text-gray-900">45 €</p>
                                <p className="text-xs text-red-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +2% vs N-1</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Leads Qualifiés</p>
                                <p className="text-2xl font-bold text-gray-900">1,250</p>
                                <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +8% vs N-1</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Taux de Conversion</p>
                                <p className="text-2xl font-bold text-gray-900">3.2%</p>
                                <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +0.5% vs N-1</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="col-span-2">
                            <CardHeader><CardTitle>Évolution des Revenus</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Sources de Trafic</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="roi">
                    <Card>
                        <CardHeader><CardTitle>Comparaison Coût / Revenu</CardTitle></CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attribution">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modèle d'Attribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart3 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Analyse Multi-touch, First-click vs Last-click.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
