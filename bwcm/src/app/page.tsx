'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import {client} from '../sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url';
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {sendEmail}  from "@/app/action/sendEmail";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

type GalleryImage = {
            asset?: any;
            alt?: string;
        };

type GalleryData = {
        images?: GalleryImage[];
    } | null;

type HeroData = {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: any;
    } | null;

export default function Header() {
    const [hero, setHero] = useState<HeroData>(null);
    const [gallery, setGallery] = useState<GalleryData>(null);
    const [meetings, setMeetings] = useState<any[]>([]);
    const [about, setAbout] = useState<any>(null);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [imagesToShow, setImagesToShow] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    async function handleSubmit(formData: FormData) {
        const res = await sendEmail(formData);
        if (res?.success) {
            setShowPopup(true);

            // Hide popup after 4 seconds
            setTimeout(() => setShowPopup(false), 4000);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
    // 1️⃣ Get start of current week (Monday)
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        const mondayISO = monday.toISOString().split("T")[0];

        // 2️⃣ Try to fetch hero for this week
        let heroData = await client.fetch(
            `*[_type == "heroSection" && weekOf == $mondayISO][0]{
            title, subtitle, buttonText, buttonLink, backgroundImage
            }`,
            { mondayISO }
        );

        // 3️⃣ If no hero found for this week → fallback to latest available hero
        if (!heroData) {
            heroData = await client.fetch(
            `*[_type == "heroSection"] | order(weekOf desc)[0]{
                title, subtitle, buttonText, buttonLink, backgroundImage
            }`
            );
        }

        // 5️⃣ Fetch gallery for current week with fallback
        const galleryData: GalleryData =  await client.fetch(
            `*[_type == "galleryImage" && weekOf == $mondayISO]{
            images[]{ alt, asset}
            }`,
            { mondayISO }
        );

        const fallbackImages = [
            { src: "/gallery1_1.jpg", alt: "Event 1" },
            { src: "/gallery2_2.jpg", alt: "Event 2" },
            { src: "/gallery3_3.jpg", alt: "Event 3" },
        ];

        const imagesToShow =
            galleryData && Array.isArray(galleryData.images) && galleryData.images.length > 0
                ? galleryData.images
                : fallbackImages;


        // 3️⃣ Fetch upcoming meetings
        const meetingsData = await client.fetch(
        `*[_type == "meeting" && date >= now()] | order(date asc)[0...4]{
            _id,
            title,
            date,
            description,
            image,
            link
        }`
        );

        const aboutData = await client.fetch(
            `*[_type == "aboutPage"][0]{
                title,
                intro,
                founders[]{
                name,
                role,
                bio,
                photo
                }
            }`
        );

        const testimonialData = await client.fetch(
            `*[_type == "testimonial"] | order(date desc)[0...6]{
                _id,
                name,
                role,
                message,
                photo
            }`
        );

        // 4️⃣ Set the hero data (may be from fallback)
        setHero(heroData);
        setGallery(galleryData);
        setMeetings(meetingsData);
        setAbout(aboutData);
        setTestimonials(testimonialData);
        if (galleryData && Array.isArray(galleryData.images) && galleryData.images.length > 0) {
            setImagesToShow(galleryData.images);
        } else {
            setImagesToShow(fallbackImages);
        }

        };

        fetchData();
    }, []);

    return (
    <main className="flex flex-col items-center justify-center text-center">
        <header className="fixed top-0 left-0 right-0 w-full bg-white text-white z-50">
            <div className="bg-primary mx-auto flex items-center md:flex-row justify-center py-3">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
                    {/* Logo Icon */}
                    <Image
                        src="/logo.png"
                        alt="Berachah Ministries Logo"
                        width={50}        // adjust icon size here
                        height={50}
                        className="object-contain"
                        priority
                    />

                    {/* Text */}
                    <span className="text-xl md:text-3xl font-inter tracking-wide text-white hover:text-yellow-400">
                        Berachah Ministries Moosapet
                    </span>
                </Link>
            </div>
            <div className="bg-primary mx-auto flex items-center md:flex-row justify-center py-3">
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/" className="hover:text-yellow-400 font-inter transition">Home</Link>
                    <Link href="#about" className="hover:text-yellow-400 font-inter transition">About</Link>
                    <Link href="#meetings" className="hover:text-yellow-400 font-inter transition">Meetings</Link>
                    <Link href="#photos" className="hover:text-yellow-400 font-inter transition">Gallery</Link>
                    <Link href="#videos" className="hover:text-yellow-400 font-inter transition">Videos</Link>
                    <Link href="#donate" className="hover:text-yellow-400 font-inter transition">Donate</Link>
                    <Link href="#contact" className="hover:text-yellow-400 font-inter transition">Contact</Link>
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button className="text-white text-2xl focus:outline-none">&#9776;</button>
                </div>
            </div>
        </header>
        <section id="home" className="hero-section w-full m-0 p-0 relative">
            {/* Hero Banner */}
            <div  className="relative w-full mx-auto h-[70vh] md:h-[80vh] lg:h-[160vh] aspect-[16/9] border-b-0 border-l-2 border-r-2 border-[#0B4268] mx-auto overflow-hidden  mb-[-1px]">
                <div className="relative w-full h-full">
                    <Image
                    src={hero?.backgroundImage ? urlFor(hero.backgroundImage).url() : "/hero.jpg"} // Replace with one of your uploaded images
                    alt="Berachah Ministries Moosapet"
                    fill
                    className="object-contain md:object-cover"
                    priority
                    />
                    <div className="absolute inset-0 px-4 bg-black/50 flex flex-col items-center justify-center text-white">
                        <h2 className="text-4xl md:text-6xl font-inter tracking-wider leading-tight text-white drop-shadow-2xl mb-4">
                            {hero?.title || "Reaching the World with the Gospel of "}
                            <span className="text-yellow-400">JESUS CHRIST</span>
                        </h2>
                        <p className="text-lg md:text-2xl max-w-3xl text-white leading-relaxed drop-shadow-lg">
                            {hero?.subtitle || "Bringing hope, healing, and transformation through Jesus Christ."}
                        </p>
                        <a
                            href={hero?.buttonLink || "#contact"}
                            className="mt-6 inline-block bg-yellow-400 text-[#0B4268] px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 transition"
                        >
                            {hero?.buttonText || "Join Us"}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}