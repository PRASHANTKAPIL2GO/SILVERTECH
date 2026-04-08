import { NextResponse } from 'next/server';

type ClientMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// responses for SilverTech
const responses: { [key: string]: string } = {
  'modules': '📚 We offer 18 digital skills modules: Smartphone Basics, Email, Social Media, Online Shopping, Web Search, Password Security, Digital Banking, Messaging Apps, Video Calling, Government Services, Scams & Safety, Streaming Services, Health Online, Cloud Storage & File Sharing, Online Privacy & Cybersecurity, Internet Safety for Seniors, Productivity Tools & Office Apps, and Photos & Digital Memories. Each has lessons and quizzes!',
  'help': '👋 Hi! I\'m your SilverTech assistant. I can help with modules, lessons, quizzes, and digital skills.e What would you like to learn?',
  'progress': '📊 Visit your dashboard to track progress. Complete lessons and quizzes to earn points and certificates!',
  'smartphone': '📱 Smartphone Basics covers navigation, apps, settings, calling, messaging, and troubleshooting. Perfect for beginners!',
  'email': '📧 Email module teaches you how to create accounts, send/receive emails, attachments, and email safety.',
  'social': '👥 Social Media module covers Facebook, WhatsApp, Instagram basics, privacy settings, and online safety.',
  'shopping': '🛒 Online Shopping teaches finding products, comparing prices, secure payment, and avoiding scams.',
  'search': '🔍 Web Search module shows how to use Google, search filters, evaluating results, and finding reliable information.',
  'security': '🔐 Password Security teaches strong passwords, two-factor auth, recognizing phishing, and protecting accounts.',
  'banking': '🏦 Digital Banking covers mobile apps, online transfers, checking balance, security tips, and fraud prevention.',
  'messaging': '💬 Messaging Apps like WhatsApp, Telegram - sending messages, calls, group chats, and privacy features.',
  'video': '📹 Video Calling with Zoom, Skype, Google Meet - setting up, joining calls, screen sharing, and etiquette.',
  'government': '🏛️ Government Services covers online portals, digital ID, tax filing, permits, and official services.',
  'scams': '⚠️ Scams & Safety teaches recognizing fraud, phishing, malware, protecting info, and reporting scams.',
  'streaming': '🎬 Streaming Services covers YouTube, Netflix, hotstar - watching content, managing subscriptions safely.',
  'health': '⚕️ Health Online for finding medical info, telehealth, health apps, privacy, and evaluating sources.',
  'beginner': '🌟 SilverTech is perfect for beginners! We start with the basics and gradually build your skills. No experience needed!',
  'certificate': '🏆 Complete modules and quizzes to earn digital certificates that prove your skills!',
  'practice': '✍️ Each module includes hands-on practice exercises to help you learn by doing.',
  'quiz': '❓ Quizzes test your knowledge with interactive questions. You can retake them anytime!',
  'lesson': '📖 Lessons are short, easy-to-understand videos and guides. Perfect for learning at your own pace.',
  'points': '⭐ Earn points for completing lessons, quizzes, and practicing new skills. Redeem them for rewards!',
  'support': '💬 Need help? Use our mentorship forum to ask questions and learn from others in the community.',
  'mentor': '👨‍🏫 Our mentors are experienced and ready to help. Ask questions anytime in the mentorship section!',
  'time': '⏱️ Most lessons take 10-15 minutes. You can learn whenever you have time!',
  'offline': '📱 You can download content to learn offline. Perfect for learning on the go!',
  'free': '💰 SilverTech is completely free! No hidden charges or premium features.',
  'skills': '🎯 Learn practical digital skills that are useful in everyday life. Get ahead in the digital world!',
  'start': '🚀 Ready to get started? Choose any module and begin with Lesson 1. Take it at your own pace!',
  'community': '👥 Join thousands of learners worldwide. Share your progress and celebrate wins together!',
  'mobile': '📱 Access SilverTech on your smartphone, tablet, or computer. Learn anywhere, anytime!',
  'feedback': '💭 We love your feedback! Tell us what you think so we can improve SilverTech for you.',
  'advanced': '🚀 After mastering the basics, explore advanced topics and expert tips in each module!',
  'cloud': '☁️ Cloud Storage & File Sharing teaches you how to safely store files online, backup your phone, and share documents with others securely.',
  'privacy': '🛡️ Online Privacy & Cybersecurity covers protecting your personal information, adjusting privacy settings, and recognizing cyber threats.',
  'internet-safety': '🌐 Internet Safety for Seniors teaches safe browsing, identifying trustworthy websites, and secure online payments.',
  'productivity': '📊 Productivity Tools & Office Apps covers Google Docs, Sheets, email management, and keeping your digital life organized.',
  'photos': '📸 Photos & Digital Memories teaches how to take better photos, organize your collection, and share memories safely with family.',
  'default': '😊 That\'s a great question! Ask about any module, how to get started, or your progress. I\'m here to help!'
};

function getResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Check for keywords
  if (msg.includes('module') || msg.includes('course')) return responses['modules'];
  if (msg.includes('help') || msg.includes('hi') || msg.includes('hello')) return responses['help'];
  if (msg.includes('progress') || msg.includes('track') || msg.includes('dashboard')) return responses['progress'];
  if (msg.includes('smartphone') || msg.includes('phone')) return responses['smartphone'];
  if (msg.includes('email')) return responses['email'];
  if (msg.includes('social') || msg.includes('facebook') || msg.includes('whatsapp')) return responses['social'];
  if (msg.includes('shopping') || msg.includes('buy')) return responses['shopping'];
  if (msg.includes('search') || msg.includes('google')) return responses['search'];
  if (msg.includes('password') || msg.includes('security') || msg.includes('safe')) return responses['security'];
  if (msg.includes('banking') || msg.includes('bank') || msg.includes('digital')) return responses['banking'];
  if (msg.includes('messaging') || msg.includes('message')) return responses['messaging'];
  if (msg.includes('video') || msg.includes('call')) return responses['video'];
  if (msg.includes('government') || msg.includes('govt')) return responses['government'];
  if (msg.includes('scam') || msg.includes('fraud')) return responses['scams'];
  if (msg.includes('streaming') || msg.includes('netflix') || msg.includes('youtube')) return responses['streaming'];
  if (msg.includes('health') || msg.includes('medical')) return responses['health'];
  if (msg.includes('beginner') || msg.includes('start') || msg.includes('new')) return responses['beginner'];
  if (msg.includes('certificate') || msg.includes('cert')) return responses['certificate'];
  if (msg.includes('practice')) return responses['practice'];
  if (msg.includes('quiz')) return responses['quiz'];
  if (msg.includes('lesson')) return responses['lesson'];
  if (msg.includes('point') || msg.includes('reward')) return responses['points'];
  if (msg.includes('support') || msg.includes('assist')) return responses['support'];
  if (msg.includes('mentor')) return responses['mentor'];
  if (msg.includes('time') || msg.includes('how long')) return responses['time'];
  if (msg.includes('offline') || msg.includes('download')) return responses['offline'];
  if (msg.includes('free') || msg.includes('cost') || msg.includes('price')) return responses['free'];
  if (msg.includes('skill')) return responses['skills'];
  if (msg.includes('ready') || msg.includes('begin') || msg.includes('start')) return responses['start'];
  if (msg.includes('community') || msg.includes('friends') || msg.includes('people')) return responses['community'];
  if (msg.includes('mobile') || msg.includes('app') || msg.includes('computer')) return responses['mobile'];
  if (msg.includes('feedback') || msg.includes('suggest') || msg.includes('improve')) return responses['feedback'];
  if (msg.includes('advanced') || msg.includes('expert') || msg.includes('difficult')) return responses['advanced'];
  if (msg.includes('cloud') || msg.includes('backup') || msg.includes('storage')) return responses['cloud'];
  if (msg.includes('privacy') || msg.includes('cyber') || msg.includes('cybersecurity')) return responses['privacy'];
  if (msg.includes('internet') || msg.includes('browser') || msg.includes('website')) return responses['internet-safety'];
  if (msg.includes('productivity') || msg.includes('office') || msg.includes('google docs')) return responses['productivity'];
  if (msg.includes('photo') || msg.includes('picture') || msg.includes('camera')) return responses['photos'];
  
  return responses['default'];
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: 'Please send a message!' });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ reply: responses['help'] });
    }

    // Get hardcoded response based on keywords
    const reply = getResponse(lastMessage.content);
    
    console.log('User:', lastMessage.content);
    console.log('Assistant:', reply);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred' },
      { status: 500 }
    );
  }
}