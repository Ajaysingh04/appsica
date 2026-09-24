import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Demo Projects
    const hardcodedProjects = [
      {
        title: "Food Delivery Application",
        slug: "food-delivery",
        summary: "A modern, full-stack food delivery application with seamless user experience, real-time order tracking, and intuitive navigation.",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80", 
        liveLink: "https://food-delivery-two-taupe.vercel.app/",
        published: true,
        order: 1
      },
      {
        title: "Baazarpur E-Commerce",
        slug: "baazarpur",
        summary: "A complete e-commerce platform offering a wide range of products with secure checkout and user-friendly interface.",
        coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://baazarpur.vercel.app/",
        published: true,
        order: 2
      },
      {
        title: "Plywood Studio",
        slug: "plywood",
        summary: "A creative portfolio and business website built for showcasing plywood products and interior designs.",
        coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://riyakaushal321.wixstudio.com/plywood",
        published: true,
        order: 3
      },
      {
        title: "Gym Fitness Platform",
        slug: "gym-fitness",
        summary: "A modern fitness application for gym members to track workouts, schedules, and membership details.",
        coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://gym-eta-five.vercel.app/",
        published: true,
        order: 4
      },
      {
        title: "Bachat Book - Expense Tracker",
        slug: "bachat-book",
        summary: "A personal finance and expense tracking application to manage budgets and monitor daily spending.",
        coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://bachat-book-expense-tracker-app-1.onrender.com/dashboard",
        published: true,
        order: 5
      },
      {
        title: "Travelbook",
        slug: "travelbook",
        summary: "A travel booking and exploration platform to discover new destinations and manage trip itineraries.",
        coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://travelbook-pi.vercel.app/",
        published: true,
        order: 6
      },
      {
        title: "Admin Dashboard Template",
        slug: "dashboard-pack",
        summary: "A comprehensive and responsive admin dashboard template with various data visualization components.",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://dashboardpack.com/live-demo-preview/?livedemo=391333",
        published: true,
        order: 7
      },
      {
        title: "Hotel Management System",
        slug: "hotel-management-1",
        summary: "A complete hotel management system for booking rooms, managing guests, and handling operations.",
        coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://hotel-management-iota-black.vercel.app/dashboard",
        published: true,
        order: 8
      },
      {
        title: "Luxury Hotel Platform",
        slug: "hotel-management-2",
        summary: "An elegant platform for luxury hotel reservations, featuring rich property showcases and availability checks.",
        coverImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://hotel-management-6v5a.vercel.app/",
        published: true,
        order: 9
      },
      {
        title: "Noor-e-Adah",
        slug: "noor-e-adah",
        summary: "A beautiful and culturally rich platform showcasing traditional crafts, clothing, or boutique items.",
        coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
        liveLink: "https://noor-e-adah-sample.vercel.app/admin/dashboard",
        published: true,
        order: 10
      }
    ];

    // Bulk insert projects, ignoring duplicates (based on unique slug)
    const results = [];
    for (const projectData of hardcodedProjects) {
      const existing = await Project.findOne({ slug: projectData.slug });
      if (!existing) {
        const newProject = await Project.create(projectData);
        results.push(newProject);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${results.length} demo projects.`,
      projects: results 
    });

  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Failed to seed demo projects." }, { status: 500 });
  }
}
