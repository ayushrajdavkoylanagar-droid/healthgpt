import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Heart, 
  Brain, 
  Moon, 
  Smile, 
  Droplets,
  Bot,
  User,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  parameter?: string;
}

interface HealthParameter {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  improvementTips: string[];
}

const healthParameters: HealthParameter[] = [
  {
    name: "Heart Rate",
    icon: <Heart className="w-4 h-4" />,
    color: "bg-red-500",
    description: "Measures your heart beats per minute (BPM). Normal resting heart rate is 60-100 BPM.",
    improvementTips: [
      "Regular cardiovascular exercise (30 minutes daily)",
      "Practice deep breathing and meditation",
      "Reduce caffeine intake",
      "Maintain healthy weight",
      "Get adequate sleep (7-9 hours)",
      "Quit smoking and limit alcohol"
    ]
  },
  {
    name: "Stress Score",
    icon: <Brain className="w-4 h-4" />,
    color: "bg-purple-500",
    description: "Indicates your stress levels based on heart rate variability and other physiological markers.",
    improvementTips: [
      "Practice mindfulness meditation (10-15 minutes daily)",
      "Regular physical activity to release endorphins",
      "Maintain work-life balance",
      "Get enough quality sleep",
      "Connect with friends and family",
      "Consider yoga or tai chi"
    ]
  },
  {
    name: "Sleep Score",
    icon: <Moon className="w-4 h-4" />,
    color: "bg-blue-500",
    description: "Evaluates the quality and quantity of your sleep based on sleep patterns and recovery.",
    improvementTips: [
      "Maintain consistent sleep schedule (same bedtime/wake time)",
      "Create a relaxing bedtime routine",
      "Keep bedroom cool, dark, and quiet",
      "Avoid screens 1 hour before bed",
      "Limit caffeine after 2 PM",
      "Consider natural sleep aids like chamomile tea"
    ]
  },
  {
    name: "Emotion Score",
    icon: <Smile className="w-4 h-4" />,
    color: "bg-yellow-500",
    description: "Assesses your emotional well-being and mood patterns based on various indicators.",
    improvementTips: [
      "Practice gratitude journaling",
      "Engage in activities you enjoy",
      "Build and maintain social connections",
      "Seek professional help if needed",
      "Practice positive self-talk",
      "Spend time in nature"
    ]
  },
  {
    name: "Hydration Score",
    icon: <Droplets className="w-4 h-4" />,
    color: "bg-cyan-500",
    description: "Monitors your body's hydration levels based on water intake and physiological markers.",
    improvementTips: [
      "Drink 8-10 glasses of water daily",
      "Carry a water bottle everywhere",
      "Set reminders to drink water",
      "Eat water-rich foods (fruits, vegetables)",
      "Monitor urine color (pale yellow is ideal)",
      "Limit diuretics like excessive coffee/tea"
    ]
  }
];

const HealthChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Health Assistant. I can provide detailed advice about Heart Rate, Stress Score, Sleep Score, Emotion Score, and Hydration Score. How can I help you improve your health today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Heart Rate Questions (10)
    if (lowerInput.includes('heart rate') || lowerInput.includes('heart') || lowerInput.includes('pulse') || lowerInput.includes('bpm')) {
      if (lowerInput.includes('normal') || lowerInput.includes('range') || lowerInput.includes('average')) {
        return "🫀 **Normal Heart Rate:**\n\n• Adults: 60-100 BPM (beats per minute)\n• Athletes: 40-60 BPM\n• Children: 70-120 BPM (varies by age)\n\n💡 **Factors affecting heart rate:**\n• Exercise and fitness level\n• Stress and emotions\n• Medications\n• Body temperature\n• Caffeine intake\n\n📈 **To improve:** Regular cardio exercise, stress management, adequate sleep!";
      }
      if (lowerInput.includes('high') || lowerInput.includes('fast') || lowerInput.includes('tachycardia')) {
        return "🫀 **High Heart Rate (Tachycardia):**\n\n**Causes:**\n• Stress, anxiety, excitement\n• Caffeine, nicotine\n• Fever, dehydration\n• Medications\n• Heart conditions\n\n**When to worry:**\n• Resting rate >100 BPM consistently\n• Dizziness, shortness of breath\n• Chest pain, fainting\n\n🏥 **Consult doctor if persistent.** Regular exercise and stress reduction help!";
      }
      if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('fitness')) {
        return "💪 **Heart Rate & Exercise:**\n\n**Target Zones:**\n• Moderate: 50-70% of max (90-126 BPM)\n• Vigorous: 70-85% of max (126-153 BPM)\n\n**Calculate Max HR:** 220 - Your Age\n\n**Benefits:**\n• Improved cardiovascular health\n• Better endurance\n• Weight management\n• Stress reduction\n\n⏱️ **Recovery time** indicates fitness level. Faster recovery = better fitness!";
      }
      return "🫀 **Heart Rate Health:**\n\n**Quick tips:**\n• Normal range: 60-100 BPM at rest\n• Exercise regularly for cardiovascular health\n• Manage stress through relaxation techniques\n• Limit caffeine and alcohol\n• Get adequate sleep (7-9 hours)\n• Stay hydrated\n\n🏥 **When to see doctor:**\n• Consistently high/low rates\n• Palpitations, dizziness\n• Chest pain, shortness of breath";
    }

    // Stress Score Questions (10)
    if (lowerInput.includes('stress') || lowerInput.includes('stress score') || lowerInput.includes('anxiety') || lowerInput.includes('pressure')) {
      if (lowerInput.includes('reduce') || lowerInput.includes('manage') || lowerInput.includes('lower') || lowerInput.includes('decrease')) {
        return "🧘 **Stress Reduction Techniques:**\n\n**Immediate relief (5 minutes):**\n• Deep breathing: 4-7-8 pattern\n• Progressive muscle relaxation\n• Quick walk or stretching\n• Listen to calming music\n\n**Daily practices:**\n• Meditation: 10-20 minutes daily\n• Regular exercise (30 minutes)\n• Journaling thoughts and feelings\n• Time in nature\n\n**Lifestyle changes:**\n• Prioritize sleep (7-9 hours)\n• Limit caffeine and alcohol\n• Maintain work-life balance\n• Connect with supportive people\n\n📱 **Apps:** Calm, Headspace, Insight Timer offer guided sessions!";
      }
      if (lowerInput.includes('symptoms') || lowerInput.includes('signs') || lowerInput.includes('feel')) {
        return "😰 **Stress Symptoms:**\n\n**Physical:**\n• Headaches, muscle tension\n• Fatigue, sleep problems\n• Chest pain, rapid heartbeat\n• Digestive issues\n• Weakened immune system\n\n**Emotional:**\n• Anxiety, irritability\n• Depression, sadness\n• Overwhelm, lack of motivation\n• Mood swings\n\n**Cognitive:**\n• Memory problems, poor focus\n• Racing thoughts\n• Poor judgment\n• Negative thinking\n\n⚠️ **Chronic stress** can lead to serious health conditions. Seek help if symptoms persist!";
      }
      if (lowerInput.includes('work') || lowerInput.includes('job') || lowerInput.includes('office')) {
        return "💼 **Workplace Stress Management:**\n\n**Common causes:**\n• Heavy workload, tight deadlines\n• Difficult coworkers/boss\n• Job insecurity\n• Work-life imbalance\n\n**Strategies:**\n• Take regular breaks (5 min/hour)\n• Prioritize tasks, say no when needed\n• Use time management techniques\n• Create boundaries between work/home\n• Practice stress-reduction at desk\n\n**Communication:**\n• Discuss workload with supervisor\n• Request resources/support\n• Consider flexible arrangements\n\n🏢 **Your workspace** should support mental health, not harm it!";
      }
      return "😰 **Stress Management:**\n\n**Quick relief techniques:**\n• Deep breathing exercises\n• Progressive muscle relaxation\n• Take a short walk\n• Listen to calming music\n\n**Long-term strategies:**\n• Regular exercise routine\n• Adequate sleep (7-9 hours)\n• Mindfulness meditation\n• Healthy work-life balance\n\n🏥 **Seek professional help** if stress becomes overwhelming or affects daily functioning!";
    }

    // Sleep Score Questions (10)
    if (lowerInput.includes('sleep') || lowerInput.includes('sleep score') || lowerInput.includes('insomnia') || lowerInput.includes('rest')) {
      if (lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('quality')) {
        return "😴 **Improving Sleep Quality:**\n\n**Sleep hygiene tips:**\n• Consistent schedule (same bedtime/wake time)\n• Cool, dark, quiet bedroom (60-67°F)\n• No screens 1 hour before bed\n• Avoid caffeine after 2 PM\n• Limit alcohol, especially before bed\n• Regular exercise (but not close to bedtime)\n\n**Bedtime routine ideas:**\n• Warm bath or shower\n• Reading physical book\n• Gentle stretching or yoga\n• Meditation or deep breathing\n• Journaling thoughts\n\n🌙 **Quality over quantity** - 7-9 hours of quality sleep is better than 10 hours of restless sleep!";
      }
      if (lowerInput.includes('hours') || lowerInput.includes('duration') || lowerInput.includes('how much')) {
        return "⏰ **Sleep Duration Recommendations:**\n\n**By age group:**\n• Adults (18-64): 7-9 hours\n• Teenagers (14-17): 8-10 hours\n• Older adults (65+): 7-8 hours\n• Children (6-13): 9-11 hours\n\n**Individual variation exists:**\n• Some people naturally need more/less\n• Genetics play a role\n• Activity level affects needs\n• Quality matters as much as quantity\n\n**Signs you're not getting enough:**\n• Daytime fatigue, irritability\n• Difficulty concentrating\n• Falling asleep unintentionally\n• Need caffeine to function\n\n🛌 **Listen to your body** - aim for the amount that leaves you refreshed!";
      }
      if (lowerInput.includes('insomnia') || lowerInput.includes('trouble sleeping') || lowerInput.includes('can\'t sleep')) {
        return "😫 **Insomnia Solutions:**\n\n**Immediate strategies:**\n• Get out of bed after 20 minutes\n• Do something relaxing in dim light\n• Return to bed only when sleepy\n• Don't watch the clock\n\n**Cognitive techniques:**\n• Challenge racing thoughts\n• Write down worries before bed\n• Practice progressive muscle relaxation\n• Use guided imagery\n\n**Lifestyle changes:**\n• Establish consistent routine\n• Exercise regularly (morning/afternoon)\n• Limit screen time before bed\n• Avoid large meals, caffeine, alcohol\n\n💊 **Consider professional help** if insomnia persists >3 weeks or affects daily life significantly!";
      }
      return "😴 **Sleep Health:**\n\n**Key recommendations:**\n• 7-9 hours quality sleep nightly\n• Consistent sleep schedule\n• Cool, dark, quiet bedroom\n• No screens 1 hour before bed\n• Avoid caffeine after 2 PM\n• Regular exercise routine\n\n🏥 **See doctor if:**\n• Chronic insomnia\n• Loud snoring, breathing issues\n• Excessive daytime sleepiness\n• Restless legs, frequent awakenings";
    }

    // Emotion Score Questions (10)
    if (lowerInput.includes('emotion') || lowerInput.includes('emotion score') || lowerInput.includes('mood') || lowerInput.includes('feelings')) {
      if (lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('enhance')) {
        return "😊 **Improving Emotional Health:**\n\n**Daily practices:**\n• Gratitude journaling (3 things daily)\n• Mindfulness meditation (10 minutes)\n• Regular physical activity\n• Adequate sleep (7-9 hours)\n• Social connection and support\n\n**Cognitive strategies:**\n• Challenge negative thoughts\n• Practice self-compassion\n• Focus on present moment\n• Set realistic goals\n\n**Lifestyle factors:**\n• Balanced nutrition, omega-3s\n• Limit alcohol, avoid drugs\n• Spend time in nature\n• Engage in hobbies you enjoy\n\n🧠 **Emotional health** is a skill that improves with practice and self-awareness!";
      }
      if (lowerInput.includes('depression') || lowerInput.includes('sad') || lowerInput.includes('low mood')) {
        return "😔 **Managing Depression & Low Mood:**\n\n**Warning signs:**\n• Persistent sadness, emptiness\n• Loss of interest in activities\n• Changes in sleep, appetite\n• Fatigue, low energy\n• Feelings of worthlessness\n• Difficulty concentrating\n\n**Self-help strategies:**\n• Regular exercise (especially outdoors)\n• Social connection, avoid isolation\n• Routine and structure\n• Small, achievable goals\n• Limit alcohol, avoid drugs\n\n**When to seek help:**\n• Symptoms >2 weeks\n• Affecting daily functioning\n• Thoughts of self-harm\n\n🏥 **Depression is treatable** - professional help can make a huge difference!";
      }
      if (lowerInput.includes('anxiety') || lowerInput.includes('worry') || lowerInput.includes('panic')) {
        return "😰 **Anxiety Management:**\n\n**Immediate relief techniques:**\n• Deep breathing: 4-7-8 pattern\n• Grounding: 5-4-3-2-1 technique\n• Progressive muscle relaxation\n• Cold water on face\n\n**Long-term strategies:**\n• Regular exercise (especially yoga)\n• Meditation, mindfulness practice\n• Limit caffeine, alcohol\n• Adequate sleep hygiene\n\n**Cognitive approaches:**\n• Challenge catastrophic thinking\n• Practice acceptance (not control)\n• Focus on present, not future worries\n\n🏥 **Professional help** if anxiety interferes with daily life, relationships, or work!";
      }
      return "😊 **Emotional Health:**\n\n**Key practices:**\n• Regular self-reflection and journaling\n• Mindfulness and meditation\n• Strong social connections\n• Physical activity and exercise\n• Adequate sleep and nutrition\n• Professional help when needed\n\n🏥 **Seek help if:**\n• Persistent low mood or anxiety\n• Difficulty functioning daily\n• Thoughts of self-harm\n• Relationship problems";
    }

    // Hydration Score Questions (10)
    if (lowerInput.includes('hydration') || lowerInput.includes('water') || lowerInput.includes('fluid') || lowerInput.includes('drink')) {
      if (lowerInput.includes('how much') || lowerInput.includes('amount') || lowerInput.includes('glasses') || lowerInput.includes('liters')) {
        return "💧 **Daily Hydration Recommendations:**\n\n**General guidelines:**\n• Men: ~3.7 liters (125 ounces) daily\n• Women: ~2.7 liters (91 ounces) daily\n• Includes all fluids, not just water\n• 20% from food, 80% from beverages\n\n**Factors increasing needs:**\n• Exercise: Add 1.5-2.5 cups per hour\n• Hot/humid weather: Extra 2-4 cups\n• Illness/fever: Additional fluids\n• Pregnancy/breastfeeding: +2-3 cups\n\n**Easy tracking:**\n• 8 glasses (8 oz each) = 64 ounces\n• Water bottle with time markings\n• Urine color: Pale yellow = hydrated\n\n⚠️ **Listen to your body** - thirst indicates you're already slightly dehydrated!";
      }
      if (lowerInput.includes('benefits') || lowerInput.includes('why') || lowerInput.includes('important')) {
        return "💧 **Benefits of Proper Hydration:**\n\n**Physical health:**\n• Regulates body temperature\n• Lubricates joints, prevents cramps\n• Improves kidney function\n• Maintains blood pressure\n• Delivers nutrients, oxygen\n\n**Mental performance:**\n• Improves concentration, focus\n• Enhances memory, cognition\n• Reduces mental fatigue\n• Stabilizes mood\n\n**Appearance:**\n• Healthier skin, reduced wrinkles\n• Brighter eyes, less puffiness\n• Better muscle tone\n• Weight management support\n\n**Energy levels:**\n• Prevents fatigue, lethargy\n• Improves physical performance\n• Reduces headaches, dizziness\n\n🌟 **Proper hydration** is one of the simplest ways to improve overall health immediately!";
      }
      if (lowerInput.includes('signs') || lowerInput.includes('symptoms') || lowerInput.includes('dehydration')) {
        return "⚠️ **Signs of Dehydration:**\n\n**Early signs (1-2% fluid loss):**\n• Thirst, dry mouth\n• Dark yellow urine\n• Fatigue, low energy\n• Headache, dizziness\n• Dry skin, lips\n\n**Moderate dehydration (3-5% loss):**\n• Decreased urine output\n• Rapid heartbeat, low blood pressure\n• Confusion, irritability\n• Muscle cramps, weakness\n• Sunken eyes\n\n**Severe dehydration (>5% loss):**\n• Extreme thirst, no urination\n• Rapid breathing, weak pulse\n• Confusion, loss of consciousness\n• Medical emergency\n\n🚨 **Severe dehydration requires immediate medical attention!**";
      }
      return "💧 **Hydration Health:**\n\n**Key recommendations:**\n• 8-10 glasses water daily\n• More with exercise, heat, illness\n• Monitor urine color (pale yellow)\n• Drink before feeling thirsty\n• Carry water bottle\n• Eat water-rich foods\n\n🏥 **See doctor if:**\n• Persistent dehydration signs\n• Dark urine despite drinking\n• Frequent urination issues\n\n❓ **Ask specific questions** about hydration for detailed advice!";
    }
    
    // General health advice
    if (lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('advice')) {
      return "I'd be happy to help you improve your health! Please specify which health parameter you'd like to focus on:\n\n• Heart Rate ❤️\n• Stress Score 🧠\n• Sleep Score 😴\n• Emotion Score 😊\n• Hydration Score 💧\n\nJust mention the specific parameter, and I'll provide detailed improvement strategies!";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! 👋 I'm here to help you with your health journey. Ask me about any of the 5 health parameters, and I'll provide personalized advice for improvement!";
    }
    
    if (lowerInput.includes('thank')) {
      return "You're welcome! 🌟 Remember, small consistent changes lead to big health improvements. Feel free to ask me anything else about your health parameters!";
    }
    
    return "I'm here to help with your health questions! Please ask me about specific health parameters like Heart Rate, Stress Score, Sleep Score, Emotion Score, or Hydration Score, and I'll provide detailed improvement advice! 💪";
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleParameterClick = (parameter: HealthParameter) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Tell me about ${parameter.name}`,
      sender: 'user',
      timestamp: new Date(),
      parameter: parameter.name
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `🏥 **${parameter.name}**\n\n${parameter.description}\n\n📈 **Improvement Tips:**\n${parameter.improvementTips.map((tip, index) => `${index + 1}. ${tip}`).join('\n')}\n\nWould you like more specific advice about any of these tips?`,
        sender: 'bot',
        timestamp: new Date(),
        parameter: parameter.name
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 relative overflow-hidden group"
          size="icon"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
          
          {/* Inner glow effect */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
          
          {/* Chat icon with enhanced styling */}
          <div className="relative z-10 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          
          {/* Hover shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[600px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white p-4 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
            
            <div className="relative z-10 flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 bg-yellow-300/30 rounded-full animate-ping" />
                </div>
                AI Health Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-[calc(100%-80px)] flex flex-col">
            {/* Quick Parameter Buttons */}
            <div className="p-3 border-b bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick Access:</p>
              <div className="flex flex-wrap gap-1">
                {healthParameters.map((param) => (
                  <Button
                    key={param.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleParameterClick(param)}
                    className="text-xs h-6 px-2 hover:bg-gray-100"
                  >
                    <span className={`w-2 h-2 rounded-full ${param.color} mr-1`} />
                    {param.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {message.sender === 'bot' ? (
                            <Bot className="w-4 h-4 text-blue-600" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your health parameters..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={inputText.trim() === ''}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthChatBot;
