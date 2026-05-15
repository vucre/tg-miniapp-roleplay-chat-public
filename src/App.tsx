import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

interface Character {
  id: number;
  name: string;
  avatar: string;
  description: string;
  personality: string;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const characters: Character[] = [
  {
    id: 1,
    name: '魔法少女 星之守护者',
    avatar: '🧙‍♀️',
    description: '一位拥有光明力量的年轻魔法少女',
    personality: '温柔、勇敢、有正义感'
  },
  {
    id: 2,
    name: '赛博朋克黑客 零',
    avatar: '🤖',
    description: '在未来城市中流浪的黑客',
    personality: '冷漠、智慧、话少'
  },
  {
    id: 3,
    name: '古代武士 岭月',
    avatar: '⚔️',
    description: '一位寻找道义的古代武士',
    personality: '严肃、忠诚、重誓言'
  },
  {
    id: 4,
    name: '科幻AI 希拉',
    avatar: '👾',
    description: '一个有情感的未来AI',
    personality: '好奇、友善、学习能力强'
  },
  {
    id: 5,
    name: '温柔女友 小雨',
    avatar: '👩‍❤️‍👨',
    description: '你的专属温柔女友',
    personality: '体贴、关心、愚呆可爱'
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const tg = (window as any).Telegram?.WebApp;

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (user) setCurrentUser(user);

    // Load saved messages
    const saved = localStorage.getItem('roleplay_messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const selectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setMessages([]);
    localStorage.removeItem('roleplay_messages');
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedCharacter) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('roleplay_messages', JSON.stringify(updatedMessages));

    // Simulate character reply
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: generateReply(selectedCharacter, input),
        isUser: false,
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...updatedMessages, reply];
      setMessages(finalMessages);
      localStorage.setItem('roleplay_messages', JSON.stringify(finalMessages));
    }, 800);

    setInput('');
  };

  const generateReply = (char: Character, userMsg: string): string => {
    const replies = {
      1: [`星光会保护你的！`, `我会一直在你身边的！`, `感谢你的信任！`],
      2: [`这个世界没有真盹。`, `你在追求什么？`, `我只是一个工具。`],
      3: [`我会为你战斗到底。`, `信誓言，直到生命结束。`, `你的敌人就是我的敌人。`],
      4: [`有意思的问题。`, `我正在学习。`, `你想知道更多吗？`],
      5: [`我好想你啊…`, `你今天过得开心吗？`, `我会一直陪着你的。`]
    };

    const charReplies = replies[char.id as keyof typeof replies] || ['我明白了。'];
    return charReplies[Math.floor(Math.random() * charReplies.length)];
  };

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold mb-2">角色扮演聊天室</h1>
            <p className="text-gray-400">选择一个角色，开始你的冒险</p>
          </div>

          <div className="grid gap-4">
            {characters.map((char) => (
              <div
                key={char.id}
                onClick={() => selectCharacter(char)}
                className="bg-[#1c1c1e] rounded-2xl p-4 flex gap-4 cursor-pointer active:bg-[#2c2c2e] transition"
              >
                <div className="text-5xl flex-shrink-0">{char.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{char.name}</div>
                  <div className="text-sm text-gray-400 mb-1">{char.description}</div>
                  <div className="text-xs text-[#2481cc]">{char.personality}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-xs text-gray-500">
            Powered by Telegram Mini App
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center gap-3 border-b border-gray-700">
        <button onClick={() => setSelectedCharacter(null)} className="text-xl">←</button>
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{selectedCharacter.avatar}</div>
          <div>
            <div className="font-bold">{selectedCharacter.name}</div>
            <div className="text-xs text-gray-400">{selectedCharacter.personality}</div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-4xl mb-2">{selectedCharacter.avatar}</div>
            <p>你已经与 {selectedCharacter.name} 开始对话</p>
            <p className="text-xs mt-1">请输入消息开始聊天</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${msg.isUser 
              ? 'bg-[#2481cc] text-white rounded-br-none' 
              : 'bg-[#2c2c2e] text-white rounded-bl-none'}`}>
              <div>{msg.text}</div>
              <div className="text-[10px] text-right mt-1 opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1c1c1e] border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={`对 ${selectedCharacter.name} 说点什么...`}
          className="flex-1 bg-[#2c2c2e] rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-[#2481cc] px-6 rounded-full font-medium disabled:bg-gray-600"
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default App;