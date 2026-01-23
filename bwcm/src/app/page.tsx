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
            { src: "/gallery1_1_1.jpg", alt: "Event 1" },
            { src: "/gallery2_2_2.jpg", alt: "Event 2" },
            { src: "/gallery3_3_3.jpg", alt: "Event 3" },
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
                            <span className="text-[#55E7FA]">JESUS CHRIST</span>
                        </h2>
                        <p className="text-lg md:text-2xl max-w-3xl text-white leading-relaxed drop-shadow-lg">
                            {hero?.subtitle || "Bringing hope, healing, and transformation through Jesus Christ."}
                        </p>
                        <a
                            href={hero?.buttonLink || "#contact"}
                            className="mt-6 inline-block bg-[#B56576] text-[#0B4268] px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 transition"
                        >
                            {hero?.buttonText || "Join Us"}
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <section id="gallery" className="relative w-full text-center m-0 p-0">
            <div className="bg-primary mx-auto grid grid-cols-2 md:grid-cols-3 gap-[1px] border-t-0 border-b-0">
                {imagesToShow.map((img, index) => (
                    <div key={index} className="relative w-full aspect-[3/3] overflow-hidden">
                        <Image
                            src={img.asset ? urlFor(img.asset).url() : img.src}
                            alt={img.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover rounded"
                            priority={index === 0}
                        />
                    </div>
                ))}
                {/* {gallery?.images?.length > 0 ? (
                    gallery?.images?.map((img, index) => (
                            <div key={img.image.asset._ref} className="relative w-full aspect-[3/3] overflow-hidden rounded">
                                <Image src={img.asset.url} alt={img.alt || `Gallery image ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))
                    ): [
                        { src: "/gallery1_1.jpg", alt: "Event 1" },
                        { src: "/gallery2_2.jpg", alt: "Event 2" },
                        { src: "/gallery3_3.jpg", alt: "Event 3" },
                    ].map((img) => (
                        <div key={img.src} className="relative w-full aspect-[3/3] overflow-hidden rounded">
                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                        </div>
                    ))} */}
            </div>
        </section>
        {/* UPCOMING MEETINGS SECTION */}
        <section id="meetings" className="relative w-full text-center bg-white py-12 mt-[-1px]">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B4268] mb-8">
                Upcoming Meetings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {meetings && meetings.length > 0 ? (
                    meetings.map((mtg) => (
                    <div
                        key={mtg._id}
                        className="bg-yellow-50 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                    >
                        <div className="relative w-full h-48">
                        {mtg.image ? (
                            <Image
                            src={urlFor(mtg.image).url()}
                            alt={mtg.title}
                            fill
                            className="object-cover"
                            />
                        ) : (
                            <div className="bg-gray-300 w-full h-full" />
                        )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between text-left">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-[#0B4268]">
                            {mtg.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-3">
                            {new Date(mtg.date).toLocaleDateString("en-IN", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                            {mtg.description || "Join us for a special gathering this week!"}
                            </p>
                        </div>
                        {mtg.link && (
                            <a
                            href={mtg.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-block bg-yellow-400 text-[#0B4268] font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                            >
                            Join Link
                            </a>
                        )}
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-600">No upcoming meetings scheduled.</p>
                )}
                </div>
            </div>
        </section>
        {/* ABOUT US SECTION */}
        <section id="about" className="relative w-full bg-yellow-50 pb-0 pt-16 px-6 text-center">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0B4268] mb-8">
                    {about?.title || "About Us"}
                </h2>

                {about?.intro && (
                    <p className="text-[#0B4268] text-lg leading-relaxed mb-10">
                        {about.intro}
                    </p>
                )}

                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    {about?.founders?.length > 0 ? (
                        about?.founders?.map((person: any, index: number) => {
                            const personName = person?.name?.trim() || "Pastor";
                            const role = person?.role || "Church Leader";
                            const bio =
                                person?.bio ||
                                "We are committed to serving the Lord and spreading the Gospel through love and faith.";

                            // ✅ fallback image logic
                            const imageSrc = person?.photo
                                ? urlFor(person.photo).url()
                                : "/sister_shekena.jpg"

                            return (
                                <div key={index} className="text-center">
                                    <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-[#0B4268] mx-auto mb-4">
                                        <Image
                                        src={imageSrc}
                                        alt={personName}
                                        fill
                                        className="object-cover"
                                        priority
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-[#0B4268]">
                                        {personName}
                                    </h3>
                                    <p className="text-sm text-gray-700 italic mb-2">{role}</p>
                                    <p className="text-[#0B4268] text-base leading-relaxed max-w-md mx-auto">
                                        {bio}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                                <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-[#0B4268]">
                                    <Image
                                    src="/yesupadam_prabavathi_1.png" // replace with actual image
                                    alt="Yesupadam & Prabhavati"
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-[#0B4268]">
                                    <Image
                                    src="/pastor_caleb.jpg" // replace with actual image
                                    alt="Pastor Caleb"
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-[#0B4268]">
                                    <Image
                                    src="/sister_shekena.jpg" // replace with actual image
                                    alt="Sister Shekena Sharon Glory"
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="mt-10 text-[#0B4268] leading-relaxed text-lg text-left md:text-center">
                    <p className="mb-4">
                        <strong>Pastor Caleb</strong> and <strong>Sister Shekena Sharon Glory</strong> are the
                        visionary leaders of <span className="font-semibold">Berachah Ministries, Moosapet</span> —
                        a vibrant, Spirit-filled church dedicated to proclaiming the Gospel of Jesus Christ and
                        transforming lives through prayer, worship, and the Word of God.
                    </p>
                    <p className="text-lg mt-6 text-[#0B4268] leading-relaxed">
                        <strong>పాస్టర్ కలేబ్ గారు</strong> మరియు <strong>సిస్టర్ శేఖినా శారన్ గ్లోరీ గారు</strong> 
                        దేవుని పిలుపుతో గచ్చిబౌలిలో స్థాపించబడిన <strong>బెరాకా మినిస్ట్రీలు</strong> ద్వారా 
                        ప్రభువుకు మహిమ కలిగించుచున్నారు. ప్రార్థన, ఆరాధన మరియు వాక్యముతో 
                        ప్రజల జీవితములను మారుస్తూ దేవుని ప్రేమను పంచుతున్నారు.
                    </p>

                    <p className="mb-4">
                        With a deep passion for souls and a heart of compassion, Pastor Caleb ministers the Word with
                        divine revelation and grace, leading believers to experience the power of God’s presence and
                        the fullness of His promises.
                    </p>

                    <p className="mb-4">
                        Sister Shekena Sharon Glory stands beside him as a powerful intercessor and worship leader,
                        carrying a prophetic anointing that brings healing and restoration to many. Together, they
                        have been instrumental in nurturing faith, strengthening families, and raising a generation
                        of believers who walk in truth and love.
                    </p>

                <p className="italic text-gray-700 mt-6">
                    “Our mission is to reach the unreached and share the love of Jesus Christ with every heart.”
                </p>
                </div>
            </div>
        </section>
        {/* WHAT PEOPLE SAY SECTION */}
        <section id="testimonials" className="bg-[#0B4268] text-white pt-0 pb-16 px-6 -mt-[1px]">
            <div className="mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-10 text-yellow-400">
                What People Say
                </h2>

                {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                    <div
                        key={t._id}
                        className="bg-white text-[#0B4268] rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-[1.03]"
                    >
                        <div className="relative w-32 h-64 rounded-full overflow-hidden mb-4">
                        <Image
                            src={
                            t.photo
                                ? urlFor(t.photo).url()
                                : "/default_user.jpg" // fallback image
                            }
                            alt={t.name || "Church Member"}
                            fill
                            className="object-cover"
                        />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{t.name || "Member"}</h3>
                        <p className="text-sm text-gray-500 mb-3">{t.role || "Believer"}</p>
                        <p className="text-gray-700 text-base leading-relaxed italic">
                        “{t.message}”
                        </p>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-gray-200 italic">
                    Testimonials will be updated soon. Praise be to God!
                </p>
                )}
            </div>
        </section>
        {/* CONTACT US SECTION */}
        <section id="contact" className="relative w-full bg-white py-16 px-6 text-[#0B4268]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* 1️⃣ Contact Info */}
                <div className="space-y-6 text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B4268]">
                    Contact Us
                </h2>
                <p className="text-base leading-relaxed mb-4">
                    Reach out for prayer, ministry inquiries, or fellowship — we’d love to connect!
                </p>
                <div className="space-y-3">
                    <p className="flex items-start space-x-3">
                    <span className="text-yellow-500 text-xl mt-1">📍</span>
                    <span>
                        <strong>Berachah Ministries</strong><br/>
                        Royal Function Hall, Railway Goods Shed Road, Bharath Nagar <br/>
                        Moosapet, Hyderabad, Telangana
                    </span>
                    </p>
                    <p className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-xl">📞</span>
                    <a href="tel:+919876543210" className="hover:text-yellow-600">
                        +91 98765 43210
                    </a>
                    </p>
                    <p className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-xl">✉️</span>
                    <a
                        href="mailto:info@berachahministries.in"
                        className="hover:text-yellow-600"
                    >
                        info@berachahministries.in
                    </a>
                    </p>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-5 mt-6">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-yellow-500 text-2xl">🌐</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-yellow-500 text-2xl">📸</a>
                <a href="https://www.youtube.com/@ShekenaGlory" target="_blank" rel="noreferrer" className="hover:text-yellow-500 text-2xl">▶️</a>
            </div>
        </div>

        {/* 2️⃣ Message Form */}
        <div className="bg-yellow-50 rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>
            <form action={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-yellow-500"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email (optional)"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-yellow-500"
                />

                {/* 📱 Country Code + Mobile Number */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <select
                    name="countryCode"
                    defaultValue="+91"
                    className="bg-gray-100 px-3 py-2 border-r border-gray-300 text-gray-700 outline-none"
                    >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+49">🇩🇪 +49</option>
                    </select>

                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        required
                        pattern="[0-9]{7,12}"
                        className="w-full p-2.5 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-yellow-500"
                />

                <button
                    type="submit"
                    className="bg-[#0B4268] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-500 hover:text-[#0B4268] transition w-full"
                >
                    Send Message
                </button>

                {/* Success Message */}
                {showPopup && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center mt-2">
                    ✅ Message received! We will get back to you soon.
                    </div>
                )}
            </form>
        </div>

        {/* 3️⃣ Google Map */}
        <div className="h-[450px] rounded-2xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps?q=Royal%20Function%20Hall%20Moosapet%20Hyderabad&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            />
        </div>

        {/* 4️⃣ Donation QR */}
        <div className="bg-yellow-50 rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold mb-3">Support Our Ministry</h3>
          <p className="text-base text-gray-700 mb-4">
            Your contribution helps us spread the Gospel and support our outreach programs.
          </p>
          <div className="relative w-40 h-40 mb-3">
            <Image
              src="/donation_qr.JPG"
              alt="Donation QR Code"
              fill
              className="object-contain border-4 border-[#0B4268] rounded-xl shadow"
            />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            UPI ID: <strong>calebchinna@ybl</strong>
          </p>
          <a
            href="upi://pay?pa=berachah@upi&pn=Berachah%20Ministries"
            className="bg-yellow-400 text-[#0B4268] font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Donate via UPI
          </a>
        </div>
      </div>
        </section>
    </main>
  );
}