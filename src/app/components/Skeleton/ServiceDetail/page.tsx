import React from "react";

const ServiceDetailSkeleton = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-white pt-36 pb-20">
            <div className="container mx-auto lg:max-w-7xl px-4 animate-pulse">
                {/* Top Badge & Title Skeleton */}
                <div className="max-w-3xl mb-12">
                    <div className="w-36 h-8 bg-slate-800 rounded-full mb-6"></div>
                    <div className="w-4/5 h-12 bg-slate-800 rounded-2xl mb-4"></div>
                    <div className="w-3/5 h-6 bg-slate-800/80 rounded-lg mb-8"></div>
                    <div className="flex gap-4">
                        <div className="w-40 h-12 bg-slate-800 rounded-xl"></div>
                        <div className="w-40 h-12 bg-slate-850 rounded-xl"></div>
                    </div>
                </div>

                {/* Hero Grid Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    <div className="lg:col-span-8 h-96 bg-slate-900 border border-white/10 rounded-3xl"></div>
                    <div className="lg:col-span-4 space-y-4">
                        <div className="h-28 bg-slate-900/80 border border-white/5 rounded-2xl"></div>
                        <div className="h-28 bg-slate-900/80 border border-white/5 rounded-2xl"></div>
                        <div className="h-28 bg-slate-900/80 border border-white/5 rounded-2xl"></div>
                    </div>
                </div>

                {/* Features Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-slate-900/60 border border-white/10 rounded-3xl"></div>
                    <div className="h-64 bg-slate-900/60 border border-white/10 rounded-3xl"></div>
                    <div className="h-64 bg-slate-900/60 border border-white/10 rounded-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailSkeleton;