import type { FC, ChangeEvent, KeyboardEvent } from 'react'
import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare,
  X,
  Minimize2,
  Paperclip,
  Mic,
  Send,
  Maximize2,
  Minus,
  ChevronLeft,
  ChevronRight,
  Image,
  FileText,
  File,
  Download,
  ExternalLink,
} from 'lucide-react'
import { ProductCard } from './ProductCard'
import { mockProducts, Product } from './mockProducts'
import chatbotAvatar from '../../assets/chatbot/avatar/chatbot.png'
import { EmojiPicker } from './EmojiPicker'

interface FileAttachment {
  file: File
  preview?: string
  id: string
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  attachments?: FileAttachment[]
}

interface PreviewModalProps {
  attachment: FileAttachment | null
  onClose: () => void
}

const PreviewModal: FC<PreviewModalProps> = ({ attachment, onClose }) => {
  if (!attachment) return null

  const isImage = attachment.file.type.startsWith('image/')
  const isText = attachment.file.type.startsWith('text/')
  const isPDF = attachment.file.type === 'application/pdf'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-teal-light/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getFileIcon(attachment.file.type)}
            <div>
              <h3 className="font-medium text-teal-dark">{attachment.file.name}</h3>
              <p className="text-sm text-teal-medium">
                {(attachment.file.size / 1024).toFixed(1)}KB • {attachment.file.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={attachment.preview || URL.createObjectURL(attachment.file)}
              download={attachment.file.name}
              className="p-1.5 rounded hover:bg-teal-light/10 text-teal-medium hover:text-teal-dark"
              title="Download file"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-teal-light/10 text-teal-medium hover:text-teal-dark"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-[300px] bg-neutral-50">
          {isImage && attachment.preview && (
            <img
              src={attachment.preview}
              alt={attachment.file.name}
              className="max-w-full max-h-[60vh] object-contain mx-auto"
            />
          )}
          {isPDF && (
            <iframe
              src={URL.createObjectURL(attachment.file)}
              className="w-full h-full min-h-[500px] border-0"
              title={attachment.file.name}
            />
          )}
          {isText && <PreviewText file={attachment.file} />}
          {!isImage && !isPDF && !isText && (
            <div className="h-full flex flex-col items-center justify-center text-teal-medium">
              <File size={48} className="mb-4" />
              <p className="text-center">
                Preview not available for this file type.
                <br />
                Click the download button to view the file.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PreviewText: FC<{ file: File }> = ({ file }) => {
  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setContent(e.target?.result as string)
    }
    reader.onerror = () => {
      setError('Failed to read file content')
    }
    reader.readAsText(file)
  }, [file])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-white rounded border border-teal-light/30">
      {content}
    </pre>
  )
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image size={16} />
  if (type.startsWith('text/')) return <FileText size={16} />
  return <File size={16} />
}

export const Chatbot: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const productsContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_CHARACTERS = 500
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newAttachments: FileAttachment[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      const attachment: FileAttachment = {
        file,
        id: crypto.randomUUID(),
      }

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        attachment.preview = URL.createObjectURL(file)
      }

      newAttachments.push(attachment)
    }

    setAttachments((prev) => [...prev, ...newAttachments])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const filtered = prev.filter((att) => att.id !== id)
      // Cleanup preview URLs
      const removed = prev.find((att) => att.id === id)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return filtered
    })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() && attachments.length === 0) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
    setAttachments([]) // Clear attachments after sending
    setIsBotTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text:
          attachments.length > 0
            ? `I've received your message with ${attachments.length} file${attachments.length > 1 ? 's' : ''}. How can I help you with these?`
            : 'Thank you for your message! How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      }
      setIsBotTyping(false)
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleProductSelect = (product: Product) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I'm interested in ${product.name}`,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsBotTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Great choice! The ${product.name} is a popular item. It's currently priced at $${product.price.toFixed(2)} and has a ${product.rating.toFixed(1)} star rating from ${product.reviewCount} reviews. Would you like to know more about it?`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setIsBotTyping(false)
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleCloseChat = () => {
    setShowCloseDialog(true)
  }

  const handleConfirmClose = () => {
    // Clean up all attachment previews
    attachments.forEach((att) => {
      if (att.preview) {
        URL.revokeObjectURL(att.preview)
      }
    })

    // Clean up any previews from messages
    messages.forEach((message) => {
      message.attachments?.forEach((att) => {
        if (att.preview) {
          URL.revokeObjectURL(att.preview)
        }
      })
    })

    // Reset all states
    setMessages([])
    setAttachments([])
    setInputValue('')
    setIsExpanded(false)
    setShowCloseDialog(false)
    setPreviewAttachment(null)

    // Reset file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const checkScrollability = () => {
    const container = productsContainerRef.current
    if (!container) return

    // Check if scrolling is possible in either direction
    const hasScrollLeft = Math.round(container.scrollLeft) > 0
    const hasScrollRight =
      Math.round(container.scrollWidth - container.clientWidth - Math.round(container.scrollLeft)) >
      5

    setCanScrollLeft(hasScrollLeft)
    setCanScrollRight(hasScrollRight)
  }

  useEffect(() => {
    const container = productsContainerRef.current
    if (!container) return

    // Initial check after a small delay to ensure content is rendered
    setTimeout(checkScrollability, 100)

    // Add scroll event listener
    container.addEventListener('scroll', checkScrollability)
    // Add resize event listener to check when window size changes
    window.addEventListener('resize', checkScrollability)

    // Check scrollability after images load
    const images = container.getElementsByTagName('img')
    const imageLoadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    })

    Promise.all(imageLoadPromises).then(() => {
      checkScrollability()
      // Double check after a small delay to ensure accurate measurements
      setTimeout(checkScrollability, 100)
    })

    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability()
      // Double check after a small delay to ensure accurate measurements
      setTimeout(checkScrollability, 100)
    })
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
      resizeObserver.disconnect()
    }
  }, [messages])

  // Add new useEffect to check scrollability when expand/minimize state changes
  useEffect(() => {
    // Wait for DOM to update after expansion/minimization
    setTimeout(() => {
      checkScrollability()
      // Double check after transition completes (300ms matches the transition-all duration-300)
      setTimeout(checkScrollability, 300)
    }, 50)
  }, [isExpanded, isMaximized])

  const handleScrollProducts = (direction: 'left' | 'right') => {
    if (!productsContainerRef.current) return

    const scrollAmount = 200
    const container = productsContainerRef.current
    const newScrollPosition =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    })

    // Check scrollability during and after scrolling
    const checkDuringScroll = () => {
      checkScrollability()
      if (container.scrollLeft !== newScrollPosition) {
        requestAnimationFrame(checkDuringScroll)
      }
    }
    requestAnimationFrame(checkDuringScroll)
    // Final check after animation
    setTimeout(checkScrollability, 300)
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARACTERS) {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        if (att.preview) {
          URL.revokeObjectURL(att.preview)
        }
      })
    }
  }, [])

  const handlePreviewClick = (attachment: FileAttachment) => {
    setPreviewAttachment(attachment)
  }

  return (
    <>
      {/* Minimized State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-dark flex items-center justify-center text-cream hover:scale-110 transition-transform duration-200 hover:bg-teal-medium shadow-lg z-[9999] border-2 border-white cursor-pointer"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div
          className={`fixed ${
            isMaximized ? 'inset-4 md:inset-8 lg:inset-12' : 'bottom-6 right-6 w-96 h-[600px]'
          } bg-gradient-to-br from-teal-light via-cream to-teal-light/30 rounded-lg shadow-xl flex flex-col z-[9999] transition-all duration-300 overscroll-none touch-none`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-dark to-teal-medium p-4 rounded-t-lg flex items-center justify-between">
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
                className="text-cream hover:text-teal-light cursor-pointer"
                aria-label="Minimize chat"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={toggleMaximize}
                className="text-cream hover:text-teal-light cursor-pointer"
                aria-label={isMaximized ? 'Minimize chat' : 'Maximize chat'}
              >
                {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={handleCloseChat}
                className="text-cream hover:text-teal-light cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain touch-none bg-gradient-to-b from-transparent to-white/10">
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
                  <div className="max-w-[80%] rounded-lg p-3 bg-white/90 backdrop-blur-sm border border-teal-light/50 text-teal-dark shadow-sm cursor-default">
                    <p className="mb-2">
                      Hi! I'm your shopping assistant. Here are some popular products you might
                      like:
                    </p>
                    <div className="relative">
                      <div
                        ref={productsContainerRef}
                        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth scrollbar-none relative"
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch',
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
                        className={`absolute left-0 top-2/5 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white hover:bg-cream text-teal-dark rounded-full shadow-md transition-all z-20 cursor-pointer ${!canScrollLeft && 'opacity-50 pointer-events-none'}`}
                        aria-label="Scroll products left"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {/* Always show right scroll button for testing */}
                      <button
                        onClick={() => handleScrollProducts('right')}
                        className={`absolute right-0 top-2/5 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white hover:bg-cream text-teal-dark rounded-full shadow-md transition-all z-20 cursor-pointer ${!canScrollRight && 'opacity-50 pointer-events-none'}`}
                        aria-label="Scroll products right"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <p className="mt-2">
                      Feel free to ask me anything about these products or what you're looking for!
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                      className={`max-w-[75%] break-words rounded-lg p-3 cursor-default ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-teal-medium to-teal-light text-white shadow-md'
                          : 'bg-white/90 backdrop-blur-sm border border-teal-light/50 text-teal-dark shadow-sm'
                      }`}
                    >
                      {message.text}

                      {/* Display attachments if present */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="group relative rounded-md border border-white/30 bg-white/20 p-1.5 pr-6 cursor-pointer hover:bg-white/30 transition-colors"
                              onClick={() => handlePreviewClick(att)}
                            >
                              <div className="flex items-center gap-2">
                                {att.preview ? (
                                  <img
                                    src={att.preview}
                                    alt={att.file.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center bg-white/30 rounded text-white">
                                    {getFileIcon(att.file.type)}
                                  </div>
                                )}
                                <div className="text-xs">
                                  <div className="font-medium text-white truncate max-w-[100px]">
                                    {att.file.name}
                                  </div>
                                  <div className="text-white/80">
                                    {(att.file.size / 1024).toFixed(1)}KB
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden flex-shrink-0 mr-2">
                      <img
                        src={chatbotAvatar}
                        alt="Shopping Assistant Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="max-w-[75%] rounded-lg p-3 bg-white/90 backdrop-blur-sm border border-teal-light/50 text-teal-dark shadow-sm">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-teal-medium/60 animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-teal-medium/60 animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-teal-medium/60 animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-teal-light/30 bg-gradient-to-t from-white/10 to-transparent">
            <div className="space-y-2">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-white/50 rounded-lg border border-teal-light/30">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="group relative rounded-md border border-teal-light/30 bg-white/90 p-2 pr-8 cursor-pointer hover:bg-teal-light/5"
                      onClick={() => handlePreviewClick(att)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAttachment(att.id)
                        }}
                        className="absolute right-1 top-1 rounded-full p-0.5 text-teal-medium hover:text-teal-dark hover:bg-teal-light/10"
                        aria-label="Remove attachment"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex items-center gap-2">
                        {att.preview ? (
                          <img
                            src={att.preview}
                            alt={att.file.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center bg-teal-light/10 rounded text-teal-dark">
                            {getFileIcon(att.file.type)}
                          </div>
                        )}
                        <div className="text-xs">
                          <div className="font-medium text-teal-dark truncate max-w-[120px]">
                            {att.file.name}
                          </div>
                          <div className="text-teal-medium">
                            {(att.file.size / 1024).toFixed(1)}KB
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    attachments.length > 0
                      ? 'Add a message or press Enter to send...'
                      : 'Type a message ...'
                  }
                  rows={1}
                  className="w-full p-3 pr-12 rounded-lg border border-teal-light/50 focus:outline-none focus:ring-2 focus:ring-teal-medium resize-none bg-white/90 backdrop-blur-sm min-h-[44px] cursor-text"
                  style={{
                    height: 'auto',
                    overflow: 'hidden',
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    inputValue.trim() || attachments.length > 0
                      ? 'text-teal-dark'
                      : 'text-teal-medium'
                  } hover:text-teal-dark p-1 cursor-pointer`}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 px-1">
                <button
                  className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10 cursor-pointer"
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf,text/*"
                  aria-label="Upload files"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10 cursor-pointer"
                  aria-label="Upload files"
                >
                  <Paperclip size={20} />
                </button>
                <EmojiPicker
                  onEmojiSelect={(emoji) => {
                    setInputValue((prev) => prev + emoji)
                    adjustTextareaHeight()
                  }}
                />
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
            AI Chatbot's answers may not be accurate. By messaging us, you agree to our Terms and
            Privacy Policy. Chats may be retained.
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
                    className="px-3 py-1.5 bg-teal-medium text-cream rounded-lg hover:bg-teal-dark hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    Keep Chatting
                  </button>
                  <button
                    onClick={handleConfirmClose}
                    className="px-3 py-1.5 bg-destructive text-cream rounded-lg hover:bg-destructive-dark hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    End Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewAttachment && (
        <PreviewModal attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />
      )}
    </>
  )
}
