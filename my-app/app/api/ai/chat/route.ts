import { NextResponse } from 'next/server';

// Hardcoded responses for testing
const hardcodedResponses: { [key: string]: string } = {
  'modules': 'We offer 13 interactive modules covering essential digital skills including: Smartphone Basics, Email, Social Media, Online Shopping, Web Search, Password Security, Digital Banking, Messaging Apps, Video Calling, Government Services, Scams & Safety, Streaming Services, and Health Online. Each module has lessons and quizzes!',
  'help': 'I\'m here to help you! You can ask me about courses, modules, lessons, quizzes, or digital skills. What would you like to know?',
  'progress': 'You can track your learning progress on your dashboard. Complete lessons and quizzes to earn points and certificates!',
  'smartphone': 'The Smartphone Basics module teaches you how to use modern smartphones safely and effectively. It covers navigation, apps, settings, and troubleshooting.',
  'security': 'Our Password Security module helps you create strong passwords and understand digital security best practices to protect your accounts.',
  'default': 'That\'s a great question! I\'m here to help you learn digital skills. Feel free to ask about any of our modules, lessons, or how to get started!'
};

function getHardcodedResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check for keywords to match with responses
  if (lowerMsg.includes('module') || lowerMsg.includes('course')) return hardcodedResponses['modules'];
  if (lowerMsg.includes('help') || lowerMsg.includes('how') || lowerMsg.includes('what')) return hardcodedResponses['help'];
  if (lowerMsg.includes('progress') || lowerMsg.includes('track') || lowerMsg.includes('score')) return hardcodedResponses['progress'];
  if (lowerMsg.includes('smartphone') || lowerMsg.includes('phone')) return hardcodedResponses['smartphone'];
  if (lowerMsg.includes('password') || lowerMsg.includes('security') || lowerMsg.includes('safe')) return hardcodedResponses['security'];
  
  return hardcodedResponses['default'];
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: 'Please send a message!' });
    }

    // Get the last user message
    const lastUserMessage = messages.reverse().find((m: any) => m.role === 'user');
    if (!lastUserMessage) {
      return NextResponse.json({ reply: 'Please send a message!' });
    }

    // Get hardcoded response
    const reply = getHardcodedResponse(lastUserMessage.content);

    // Log for debugging
    console.log('User message:', lastUserMessage.content);
    console.log('Assistant reply:', reply);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}