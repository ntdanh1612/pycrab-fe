Design Goal: Create an elegant, helpful, and conversion-focused chatbot experience that seamlessly integrates into the e-commerce site (UI Version).

# 1. Chatbot Bubble (Minimized State)
- Appearance: A circular floating button, positioned typically in the bottom-right corner of the screen.
- Color: Uses --color-teal-dark for the background for strong visibility and --color-cream for the icon inside.
- Icon: A clean, stylized chat bubble icon or a subtle, abstract representation related to the avatar (e.g., a simplified version or a geometric shape).
- Animation (Subtle Sophistication):
    - Gentle pulsing effect to draw attention without being annoying.
    - On hover: Slightly scales up (e.g., scale(1.1)) and potentially shifts the background color slightly lighter (e.g., towards --color-teal-medium) for feedback.
- Conversion Focus: The attractive design and subtle animation encourage clicks to initiate interaction.

# 2. Chat Interface (Expanded State)
- Trigger: Clicking the chat bubble.
- Layout: A rectangular chat window anchored to the corner where the bubble was, expanding upwards and slightly inwards. It will have a larger vertical height than standard chatbots to maximize the chat area.
- Overall Background: --color-cream
- Dimensions: Wider and taller than typical small chat widgets to provide ample space, especially for the conversation area.

## Components:
### A. Header:

- Background: --color-teal-medium
- Height: Relatively slim but distinct.
- Elements (Left to Right):
    - Avatar: A small circular image of the bot's avatar on the far left.
    - Bot Name (Optional but Recommended): e.g., "Shopping Assistant" or a branded name. Text color: --color-cream. Font: Clean sans-serif.
    - Minimize Button: Standard underscore (_) icon. Color: --color-cream. Function: Collapses the chat back to the bubble state.
    - Close Conversation Button: A dedicated "X" or similar close icon (distinct from minimize). Color: --color-cream. Placed on the far right. Triggers the confirmation dialog.

### B. Conversation Area:
- Background: --color-cream
- Height: Occupies the largest portion of the chat window (enhanced vertical space as requested).
- Scrolling: Enabled for longer conversations.
- Message Bubbles:
    - User Messages: Align right. Background: --color-teal-light. Text color: --color-teal-dark or black for contrast. Rounded corners.
    - Bot Messages: Align left. Background: White or a very light shade slightly off --color-cream (like #FFFFFF). Border: Thin, --color-teal-light border. Text color: --color-teal-dark or black. Rounded corners. May include product cards, images, buttons for categories/recommendations.
- Timestamp (Optional): Subtle grey text below each bubble.

### C. Input Area:
- Background: --color-cream (matches the conversation area background).
- Layout: A container at the bottom of the chat window.
- Elements:
    - File Upload Icon: Paperclip or image icon, placed to the far left, outside or just inside the text input field. Color: --color-teal-medium.
    - Text Input Field:
        - Background: White (#FFFFFF) or a very light grey, distinct from the main background.
        - Border: Thin, --color-teal-light border. Rounded corners.
        - Padding: Sufficient internal padding, especially on the right, to accommodate the embedded icons without text overlapping.
        - Placeholder Text: e.g., "Type a message, ask about products, or describe what you're looking for..." Color: Grey.
    - Emoji Icon: Standard emoji face icon. Placed inside the text input field, to the left of the voice icon. Color: --color-teal-medium.
    - Voice Icon: Microphone icon. Placed inside the text input field, aligned to the right, but before the send icon. Color: --color-teal-medium.
    - Send Icon: Paper plane icon. Placed inside the text input field, aligned to the far right. Color: --color-teal-dark (as it's a primary action). Becomes active/changes color slightly when there's text in the input field.

### D. Footer (Disclaimer):
- Position: Below the input area, at the very bottom of the chat window.
- Background: --color-cream (same as conversation area).
- Text: "AI Chatbot's answers may not be accurate. By messaging us, you agree to our Terms and Privacy Policy. Chats - may be retained."
- Styling: Small font size. Text color: A muted grey or a less prominent shade like a desaturated --color-teal-medium.

# 3. Close Conversation Flow

1. User Action: Clicks the "Close Conversation" (X) button in the header.
2. Dialog Box Appears: A modal overlay appears, dimming the chat interface slightly.
- Background: White or --color-cream.
- Border: Thin, --color-teal-light.
- Text: "Are you sure you want to end this conversation?" (Use --color-teal-dark for text).
- Buttons:
    - "Keep Chatting": Standard button style. Background: --color-teal-medium. Text: --color-cream. Action: Closes the dialog, chat remains active.
    - "End Chat": Destructive action style. Background: --color-destructive (oklch(0.648274 0.193891 22.3521)). Text: --color-cream or White. Action: Closes the dialog, clears the chat history visually in the current session (or resets the bot's state for the user), potentially collapses the chat window back to the bubble.


CSS Color Variable Application Summary:
--color-cream: Main background, potentially dialog background.
--color-teal-light: User message bubbles, borders, potentially hover states.
--color-teal-medium: Header background, bot message borders (optional), some icons, "Keep Chatting" button.
--color-teal-dark: Bubble background, header text, primary text color, Send icon, potentially bot message text.
--color-destructive: "End Chat" button background.
This design aims for a clean, modern, and trustworthy appearance using the provided color palette, while ensuring all functional requirements and UI elements are present and logically placed for a good user experience that supports conversion goals.