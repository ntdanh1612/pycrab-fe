import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { EmojiPicker as FrimousseEmojiPicker } from 'frimousse'
import { Smile } from 'lucide-react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="text-teal-medium hover:text-teal-dark p-1.5 rounded hover:bg-teal-light/10 cursor-pointer"
          aria-label="Open emoji picker"
        >
          <Smile size={20} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg shadow-lg border border-teal-light/30 p-2 w-[320px] z-[9999]"
          sideOffset={5}
          align="start"
        >
          <FrimousseEmojiPicker.Root
            onEmojiSelect={({ emoji }) => {
              onEmojiSelect(emoji)
              setOpen(false)
            }}
          >
            <FrimousseEmojiPicker.Search
              className="w-full p-2 mb-2 border border-teal-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-medium text-sm bg-white"
              placeholder="Search emojis..."
            />
            <div className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-light scrollbar-track-transparent">
              <FrimousseEmojiPicker.Viewport>
                <FrimousseEmojiPicker.Loading>
                  <div className="flex items-center justify-center p-4 text-teal-medium">
                    Loading emojis...
                  </div>
                </FrimousseEmojiPicker.Loading>
                <FrimousseEmojiPicker.Empty>
                  <div className="flex items-center justify-center p-4 text-teal-medium">
                    No emojis found.
                  </div>
                </FrimousseEmojiPicker.Empty>
                <FrimousseEmojiPicker.List
                  className="select-none pb-1.5"
                  components={{
                    CategoryHeader: ({ category, ...props }) => (
                      <div
                        className="bg-white px-3 pt-2 pb-1 font-medium text-teal-dark text-xs"
                        {...props}
                      >
                        {category.label}
                      </div>
                    ),
                    Row: ({ children, ...props }) => (
                      <div className="group scroll-my-1.5 px-1.5" {...props}>
                        {children}
                      </div>
                    ),
                    Emoji: ({ emoji, ...props }) => (
                      <button
                        className="flex size-8 items-center justify-center rounded-md text-lg cursor-pointer transition-colors duration-150
                          data-[active]:group-even:nth-[3n+1]:bg-teal-100 
                          data-[active]:group-even:nth-[3n+2]:bg-green-100 
                          data-[active]:group-even:nth-[3n+3]:bg-emerald-100
                          data-[active]:group-odd:nth-[3n+1]:bg-green-100 
                          data-[active]:group-odd:nth-[3n+2]:bg-emerald-100 
                          data-[active]:group-odd:nth-[3n+3]:bg-teal-100
                          dark:data-[active]:group-even:nth-[3n+1]:bg-teal-900
                          dark:data-[active]:group-even:nth-[3n+2]:bg-green-900
                          dark:data-[active]:group-even:nth-[3n+3]:bg-emerald-900
                          dark:data-[active]:group-odd:nth-[3n+1]:bg-green-900
                          dark:data-[active]:group-odd:nth-[3n+2]:bg-emerald-900
                          dark:data-[active]:group-odd:nth-[3n+3]:bg-teal-900
                          hover:scale-110"
                        {...props}
                      >
                        {emoji.emoji}
                      </button>
                    ),
                  }}
                />
              </FrimousseEmojiPicker.Viewport>
            </div>
          </FrimousseEmojiPicker.Root>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
