import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../api/chatApi';
import useTranslation from '../utils/useTranslation';
import {
    MessageCircle, X, Send,
    Bot, User, Loader
} from 'lucide-react';

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: 'Hello! I am AgriBot. How can I help you today?',
            time: new Date().toLocaleTimeString(
                'en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() =>
                inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            text: input.trim(),
            time: new Date().toLocaleTimeString(
                'en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await sendMessage({
                message: input.trim()
            });

            const botMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                text: res.data.message,
                time: new Date().toLocaleTimeString(
                    'en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
            };

            setMessages(prev => [...prev, botMessage]);

        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: 'Sorry, I am unable to respond right now. Please try again.',
                time: new Date().toLocaleTimeString(
                    'en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = [
        'Best fertilizer for tomatoes?',
        'How to treat yellow leaves?',
        'When to irrigate wheat?',
        'Pest control for rice?',
    ];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50
                           bg-green-600 hover:bg-green-700
                           text-white w-16 h-16 rounded-full
                           shadow-2xl shadow-green-300
                           flex items-center justify-center
                           transition-colors">
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90,
                                       opacity: 0 }}
                            animate={{ rotate: 0,
                                       opacity: 1 }}
                            exit={{ rotate: 90,
                                    opacity: 0 }}
                            transition={{ duration: 0.2 }}>
                            <X size={26}/>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90,
                                       opacity: 0 }}
                            animate={{ rotate: 0,
                                       opacity: 1 }}
                            exit={{ rotate: -90,
                                    opacity: 0 }}
                            transition={{ duration: 0.2 }}>
                            <MessageCircle size={26}/>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse ring */}
                {!isOpen && (
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="absolute inset-0
                                   rounded-full border-2
                                   border-green-400"/>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0,
                                   scale: 0.8,
                                   y: 20 }}
                        animate={{ opacity: 1,
                                   scale: 1,
                                   y: 0 }}
                        exit={{ opacity: 0,
                                scale: 0.8,
                                y: 20 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300
                        }}
                        className="fixed bottom-28 right-6
                                   z-50 w-80 sm:w-96
                                   bg-white rounded-3xl
                                   shadow-2xl overflow-hidden
                                   border-2 border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r
                                        from-green-600
                                        to-emerald-600 p-4
                                        flex items-center
                                        gap-3">
                            <div className="bg-white/20
                                            rounded-full p-2">
                                <Bot size={22}
                                    className="text-white"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white
                                               font-bold
                                               text-lg">
                                    AgriBot
                                </h3>
                                <div className="flex
                                                items-center
                                                gap-1">
                                    <div className="w-2 h-2
                                                   bg-green-300
                                                   rounded-full
                                                   animate-pulse"/>
                                    <span className="text-green-100
                                                     text-xs">
                                        Online — Farming Expert
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setIsOpen(false)}
                                className="text-white/70
                                           hover:text-white
                                           transition-colors">
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto
                                        p-4 space-y-4
                                        bg-gray-50">
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0,
                                                   y: 10 }}
                                        animate={{ opacity: 1,
                                                   y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`flex
                                            items-end gap-2
                                            ${msg.role === 'user'
                                                ? 'flex-row-reverse'
                                                : 'flex-row'
                                            }`}>

                                        {/* Avatar */}
                                        <div className={`w-8 h-8
                                            rounded-full flex
                                            items-center
                                            justify-center
                                            shrink-0 text-white
                                            ${msg.role === 'user'
                                                ? 'bg-blue-500'
                                                : 'bg-green-600'
                                            }`}>
                                            {msg.role === 'user'
                                                ? <User size={14}/>
                                                : <Bot size={14}/>}
                                        </div>

                                        {/* Bubble */}
                                        <div className={`max-w-xs
                                            flex flex-col gap-1
                                            ${msg.role === 'user'
                                                ? 'items-end'
                                                : 'items-start'
                                            }`}>
                                            <div className={`px-4
                                                py-3 rounded-2xl
                                                text-sm
                                                leading-relaxed
                                                ${msg.role === 'user'
                                                    ? 'bg-green-600 text-white rounded-br-sm'
                                                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200 shadow-sm'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-xs
                                                             text-gray-400
                                                             px-1">
                                                {msg.time}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading bubble */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0,
                                               y: 10 }}
                                    animate={{ opacity: 1,
                                               y: 0 }}
                                    className="flex items-end
                                               gap-2">
                                    <div className="w-8 h-8
                                                   bg-green-600
                                                   rounded-full
                                                   flex
                                                   items-center
                                                   justify-center">
                                        <Bot size={14}
                                            className="text-white"/>
                                    </div>
                                    <div className="bg-white
                                                   border
                                                   border-gray-200
                                                   rounded-2xl
                                                   rounded-bl-sm
                                                   px-4 py-3
                                                   shadow-sm">
                                        <div className="flex
                                                        gap-1
                                                        items-center">
                                            {[0, 1, 2].map(
                                                i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        y: [-3,
                                                            3,
                                                            -3]
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        delay: i * 0.15
                                                    }}
                                                    className="w-2
                                                               h-2
                                                               bg-green-400
                                                               rounded-full"/>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 py-2
                                            bg-white border-t
                                            border-gray-100">
                                <p className="text-xs
                                              text-gray-400
                                              mb-2">
                                    Quick questions:
                                </p>
                                <div className="flex flex-wrap
                                                gap-1">
                                    {quickQuestions.map(q => (
                                        <button
                                            key={q}
                                            onClick={() => {
                                                setInput(q);
                                                inputRef
                                                    .current
                                                    ?.focus();
                                            }}
                                            className="text-xs
                                                bg-green-50
                                                text-green-700
                                                px-2 py-1
                                                rounded-lg
                                                hover:bg-green-100
                                                transition-colors">
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 bg-white border-t
                                        border-gray-100 flex
                                        items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter'
                                    && handleSend()}
                                placeholder="Ask about crops,
                                    fertilizers..."
                                className="flex-1 bg-gray-50
                                           border-2
                                           border-gray-200
                                           rounded-2xl px-4
                                           py-3 text-sm
                                           outline-none
                                           focus:border-green-400
                                           text-gray-800"/>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSend}
                                disabled={loading
                                    || !input.trim()}
                                className="bg-green-600
                                           hover:bg-green-700
                                           disabled:opacity-50
                                           text-white w-11 h-11
                                           rounded-2xl flex
                                           items-center
                                           justify-center
                                           transition-colors
                                           shrink-0">
                                {loading
                                    ? <Loader size={18}
                                        className="animate-spin"/>
                                    : <Send size={18}/>}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;