import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Paperclip, Mic, Send, Maximize2, Minus, ChevronLeft, ChevronRight, Smile } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { mockProducts, Product } from './mockProducts';
import chatbotAvatar from '../../assets/chatbot/avatar/chatbot.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARACTERS = 500;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleProductSelect = (product: Product) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I'm interested in ${product.name}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Great choice! The ${product.name} is a popular item. It's currently priced at $${product.price.toFixed(2)} and has a ${product.rating.toFixed(1)} star rating from ${product.reviewCount} reviews. Would you like to know more about it?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleCloseChat = () => {
    setShowCloseDialog(true);
  };

  const handleConfirmClose = () => {
    setMessages([]);
    setIsExpanded(false);
    setShowCloseDialog(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const checkScrollability = () => {
    const container = productsContainerRef.current;
    if (!container) return;

    // Check if scrolling is possible in either direction
    const hasScrollLeft = Math.round(container.scrollLeft) > 0;
    const hasScrollRight = Math.round(container.scrollWidth - container.clientWidth - Math.round(container.scrollLeft)) > 5;

    setCanScrollLeft(hasScrollLeft);
    setCanScrollRight(hasScrollRight);
  };

  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container) return;

    // Initial check after a small delay to ensure content is rendered
    setTimeout(checkScrollability, 100);

    // Add scroll event listener
    container.addEventListener('scroll', checkScrollability);
    // Add resize event listener to check when window size changes
    window.addEventListener('resize', checkScrollability);

    // Check scrollability after images load
    const images = container.getElementsByTagName('img');
    const imageLoadPromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });

    Promise.all(imageLoadPromises).then(() => {
      checkScrollability();
      // Double check after a small delay to ensure accurate measurements
      setTimeout(checkScrollability, 100);
    });

    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
      // Double check after a small delay to ensure accurate measurements
      setTimeout(checkScrollability, 100);
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
      resizeObserver.disconnect();
    };
  }, [messages]);

  const handleScrollProducts = (direction: 'left' | 'right') => {
    if (!productsContainerRef.current) return;
    
    const scrollAmount = 200;
    const container = productsContainerRef.current;
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    // Check scrollability during and after scrolling
    const checkDuringScroll = () => {
      checkScrollability();
      if (container.scrollLeft !== newScrollPosition) {
        requestAnimationFrame(checkDuringScroll);
      }
    };
    requestAnimationFrame(checkDuringScroll);
    // Final check after animation
    setTimeout(checkScrollability, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Minimized State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-dark flex items-center justify-center text-cream hover:scale-110 transition-transform duration-200 hover:bg-teal-medium shadow-lg z-[9999] border-2 border-white"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div 
          className={`fixed ${
            isMaximized 
              ? 'inset-4 md:inset-8 lg:inset-12' 
              : 'bottom-6 right-6 w-96 h-[600px]'
          } bg-gradient-to-br from-teal-light via-cream to-teal-light/30 rounded-lg shadow-xl flex flex-col z-[9999] transition-all duration-300 overscroll-none touch-none`}
        >
          {/* Header */}
          <div 
            className="bg-gradient-to-r from-teal-dark to-teal-medium p-4 rounded-t-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden">
                <img 
                  src={chatbotAvatar}
                  alt="Shopping Assistant Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-cream font-medium">Shopping Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-cream hover:text-teal-light"
                aria-label="Minimize chat"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={toggleMaximize}
                className="text-cream hover:text-teal-light"
                aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
              >
                {isMaximized ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </button>
              <button
                onClick={handleCloseChat}
                className="text-cream hover:text-teal-light"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain touch-none bg-gradient-to-b from-transparent to-white/10"
          >
            {messages.length === 0 ? (
              <>
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden flex-shrink-0 mr-2">
                    <img 
                      src={chatbotAvatar}
                      alt="Shopping Assistant Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-white/90 backdrop-blur-sm border border-teal-light/50 text-teal-dark shadow-sm">
                    <p className="mb-2">Hi! I'm your shopping assistant. Here are some popular products you might like:</p>
                    <div className="relative">
                      <div 
                        ref={productsContainerRef}
                        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth scrollbar-none relative"
                        style={{ 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        }}
                      >
                        {mockProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            {...product}
                            onSelect={() => handleProductSelect(product)}
                          />
                        ))}
                      </div>
                      {/* Always show left scroll button for testing */}
                      <button
                        onClick={() => handleScrollProducts('left')}
                        className={`absolute left-0 top-2/5 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white hover:bg-cream text-teal-dark rounded-full shadow-md transition-all z-20 ${!canScrollLeft && 'opacity-50 pointer-events-none'}`}
                        aria-label="Scroll products left"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {/* Always show right scroll button for testing */}
                      <button
                        onClick={() => handleScrollProducts('right')}
                        className={`absolute right-0 top-2/5 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white hover:bg-cream text-teal-dark rounded-full shadow-md transition-all z-20 ${!canScrollRight && 'opacity-50 pointer-events-none'}`}
                        aria-label="Scroll products right"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <p className="mt-2">Feel free to ask me anything about these products or what you're looking for!</p>
                  </div>
                </div>
              </>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden flex-shrink-0 mr-2">
                      <img 
                        src={chatbotAvatar}
                        alt="Shopping Assistant Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] break-words rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-medium to-teal-light text-white shadow-md'
                        : 'bg-white/90 backdrop-blur-sm border border-teal-light/50 text-teal-dark shadow-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-teal-light/30 bg-gradient-to-t from-white/10 to-transparent">
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message ..."
                  rows={1}
                  className="w-full p-3 pr-12 rounded-lg border border-teal-light/50 focus:outline-none focus:ring-2 focus:ring-teal-medium resize-none bg-white/90 backdrop-blur-sm min-h-[44px]"
                  style={{
                    height: 'auto',
                    overflow: 'hidden'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    inputValue.trim() ? 'text-teal-dark' : 'text-teal-medium'
                  } hover:text-teal-dark p-1`}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 px-1">
                <button 
                  className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10"
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
                <button 
                  className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10"
                  aria-label="Upload file"
                >
                  <Paperclip size={20} />
                </button>
                <button 
                  className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10"
                  aria-label="Emoji picker"
                >
                  <Smile size={20} />
                </button>
                {inputValue.length > 0 && (
                    <div className="text-xs text-gray-500 text-right ml-auto w-fit">
                    {inputValue.length}/{MAX_CHARACTERS}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 text-xs text-teal-dark/80 text-center border-t border-teal-light/30 bg-white/10 backdrop-blur-sm rounded-b-lg">
            AI Chatbot's answers may not be accurate.
            By messaging us, you agree to our Terms and Privacy Policy. Chats may be retained.
          </div>

          {/* Close Dialog - Now contained within the chat window */}
          {showCloseDialog && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-[9999]">
              <div className="bg-gradient-to-br from-cream to-teal-light/30 p-4 sm:p-6 rounded-lg shadow-lg max-w-[320px] mx-4">
                <h3 className="text-teal-dark font-medium mb-4 text-center">
                  Are you sure you want to end this conversation?
                </h3>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setShowCloseDialog(false)}
                    className="px-3 py-1.5 bg-teal-medium text-cream rounded-lg hover:bg-teal-dark hover:shadow-lg transition-all duration-200"
                  >
                    Keep Chatting
                  </button>
                  <button
                    onClick={handleConfirmClose}
                    className="px-3 py-1.5 bg-destructive text-cream rounded-lg hover:bg-destructive-dard hover:shadow-lg transition-all duration-200"
                  >
                    End Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}; 