const SkeletonCard = () => (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 animate-pulse p-8 bg-slate-900/60 border border-white/10 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl"></div>
            <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
        </div>
        <div className="h-7 bg-slate-800 rounded-lg w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-800/80 rounded w-full mb-2.5"></div>
        <div className="h-4 bg-slate-800/80 rounded w-5/6 mb-6"></div>
        <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
            <div className="h-3 bg-slate-800/60 rounded w-2/3"></div>
        </div>
    </div>
);

export default SkeletonCard;