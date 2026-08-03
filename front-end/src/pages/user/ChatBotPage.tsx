import {ChatWindow} from "@/features/user-chatbot/ChatWindow";

const ChatBotPage = () => {

  return (
    <div>
      <div className="flex min-h-screen flex-col w-full">
        <main className="flex-1">
          <ChatWindow
            messages={[]}
            isLoading={false}
            onSend={() => { }}
            onClose={() => { }}
          />
        </main>
      </div>

    </div>
    
  )
}

export default ChatBotPage