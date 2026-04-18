// backend/utils/seed.js
// Run: node utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Doctor   = require('../models/Doctor');
const Post     = require('../models/Post');
const connectDB = require('../config/database');

const SAMPLE_DOCTORS = [
  {
    name: 'Dr. Meera Agarwal', specialty: 'gynecologist', experience: 15,
    rating: 4.9, reviewCount: 234, consultationFee: 500, videoFee: 400,
    expertise: ['PCOS Expert', 'High Risk Pregnancy'],
    qualifications: ['MBBS', 'MD Gynecology', 'DGO'],
    languages: ['Hindi', 'English', 'Marathi'],
    location: { city: 'Mumbai', state: 'Maharashtra', clinic: 'Apollo Hospital', address: 'Juhu, Mumbai' },
    nextAvailable: 'Today, 4:00 PM', verified: true,
    bio: 'Specialist in reproductive health & PCOS management with 15 years of experience.',
    availability: [
      { day: 'Mon', slots: ['10:00 AM', '11:00 AM', '4:00 PM', '5:00 PM'] },
      { day: 'Wed', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Fri', slots: ['10:00 AM', '11:00 AM', '4:00 PM'] },
    ],
  },
  {
    name: 'Dr. Priya Patel', specialty: 'fertility', experience: 12,
    rating: 4.8, reviewCount: 189, consultationFee: 600, videoFee: 500,
    expertise: ['Infertility', 'IVF Specialist', 'PCOS'],
    qualifications: ['MBBS', 'MS OBG', 'Fellowship IVF'],
    languages: ['Hindi', 'English', 'Gujarati'],
    location: { city: 'Delhi', state: 'Delhi', clinic: 'Fortis Hospital', address: 'Vasant Kunj, Delhi' },
    nextAvailable: 'Tomorrow, 10:00 AM', verified: true,
    bio: 'Leading fertility expert with 3000+ successful IVF cycles.',
    availability: [
      { day: 'Tue', slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
      { day: 'Thu', slots: ['9:00 AM', '3:00 PM', '4:00 PM'] },
      { day: 'Sat', slots: ['10:00 AM', '11:00 AM', '12:00 PM'] },
    ],
  },
  {
    name: 'Dr. Anjali Desai', specialty: 'gynecologist', experience: 20,
    rating: 4.9, reviewCount: 312, consultationFee: 450, videoFee: 350,
    expertise: ['Menopause', 'Hormonal Issues', 'Thyroid'],
    qualifications: ['MBBS', 'MD Gynecology', 'FRCOG'],
    languages: ['Hindi', 'English', 'Kannada'],
    location: { city: 'Bangalore', state: 'Karnataka', clinic: 'Manipal Hospital', address: 'Whitefield, Bangalore' },
    nextAvailable: 'Today, 6:30 PM', verified: true,
    bio: 'Expert in menopause management and hormonal health for women of all ages.',
    availability: [
      { day: 'Mon', slots: ['9:00 AM', '6:30 PM'] },
      { day: 'Wed', slots: ['9:00 AM', '6:30 PM'] },
      { day: 'Fri', slots: ['9:00 AM', '6:30 PM'] },
    ],
  },
  {
    name: 'Dr. Sunita Rao', specialty: 'ayurveda', experience: 18,
    rating: 4.7, reviewCount: 156, consultationFee: 300, videoFee: 250,
    expertise: ['PCOS Ayurveda', 'Infertility', 'Hormonal Balance'],
    qualifications: ['BAMS', 'MD Ayurveda'],
    languages: ['Hindi', 'English', 'Marathi'],
    location: { city: 'Pune', state: 'Maharashtra', clinic: 'Ayushman Clinic', address: 'Aundh, Pune' },
    nextAvailable: 'Today, 2:00 PM', verified: true,
    bio: 'Classical Ayurveda practitioner specializing in women\'s reproductive health.',
    availability: [
      { day: 'Mon', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Thu', slots: ['10:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Sat', slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
    ],
  },
  {
    name: 'Dr. Rekha Sharma', specialty: 'endocrinologist', experience: 14,
    rating: 4.6, reviewCount: 203, consultationFee: 700, videoFee: 550,
    expertise: ['Thyroid', 'PCOS', 'Diabetes in Pregnancy'],
    qualifications: ['MBBS', 'MD Medicine', 'DM Endocrinology'],
    languages: ['Hindi', 'English'],
    location: { city: 'Hyderabad', state: 'Telangana', clinic: 'KIMS Hospital', address: 'Secunderabad, Hyderabad' },
    nextAvailable: 'Tomorrow, 3:00 PM', verified: true,
    bio: 'Endocrinologist specializing in thyroid disorders and hormonal imbalances in women.',
    availability: [
      { day: 'Tue', slots: ['3:00 PM', '4:00 PM', '5:00 PM'] },
      { day: 'Fri', slots: ['3:00 PM', '4:00 PM'] },
    ],
  },
];

const SAMPLE_POSTS = [
  {
    room: 'pcos', anonymous: false, title: 'Metformin for PCOS - experiences?',
    content: 'Has anyone tried metformin for PCOS? My doctor just prescribed it. Bit nervous about side effects 😅',
    tags: ['metformin', 'pcos', 'medication'],
    reactions: { heart: 12, support: 8, thumbsUp: 5 }, commentCount: 23,
  },
  {
    room: 'general', anonymous: true, title: 'Best Indian foods for PCOS?',
    content: 'Looking for natural dietary ways to manage PCOS. Has anyone tried the ragi and methi combination? My nutritionist suggested it and I\'m curious about others\' experiences!',
    tags: ['diet', 'pcos', 'indian-food'],
    reactions: { heart: 45, support: 28, thumbsUp: 33 }, commentCount: 89, isPinned: false,
  },
  {
    room: 'general', anonymous: false, title: 'Home remedies for period cramps that actually work',
    content: 'I\'ve been using a hot water bottle with ajwain seeds and it\'s been a game changer! What works for you all?',
    tags: ['cramps', 'remedies', 'period'],
    reactions: { heart: 67, support: 42, thumbsUp: 51 }, commentCount: 134,
  },
  {
    room: 'mental_health', anonymous: true,
    content: 'Anyone else feel like a completely different person a week before their period? The mood swings are so intense lately. Looking for coping strategies.',
    tags: ['pms', 'mood', 'mental-health'],
    reactions: { heart: 89, support: 76, thumbsUp: 34 }, commentCount: 67,
  },
  {
    room: 'pregnancy', anonymous: false, title: 'First trimester tips',
    content: 'Just found out I\'m 6 weeks pregnant! So nervous and excited. What helped you all through the first trimester?',
    tags: ['pregnancy', 'first-trimester'],
    reactions: { heart: 55, support: 43, thumbsUp: 28 }, commentCount: 78,
  },
];

async function seed() {
  await connectDB();

  console.log('🌱 Seeding database…');

  // Clear existing
  await Doctor.deleteMany({});
  await Post.deleteMany({});

  // Need a dummy user for posts
  const User = require('../models/User');
  let seedUser = await User.findOne({ email: 'seed@herhealth.com' });
  if (!seedUser) {
    seedUser = await User.create({
      name: 'HerHealth Team',
      email: 'seed@herhealth.com',
      password: 'seed123456',
      onboardingComplete: true,
    });
  }

  await Doctor.insertMany(SAMPLE_DOCTORS);
  console.log(`✅ Seeded ${SAMPLE_DOCTORS.length} doctors`);

  await Post.insertMany(SAMPLE_POSTS.map(p => ({ ...p, user: seedUser._id })));
  console.log(`✅ Seeded ${SAMPLE_POSTS.length} community posts`);

  console.log('🌸 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
