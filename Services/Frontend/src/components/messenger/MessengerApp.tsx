// src/components/messenger/MessengerApp.tsx
import { useEffect } from "react";
import { Box } from "@mui/material";
import { useMessenger } from "../../context/MessengerContext";
import IconRail from "./IconRail";
import ChatList from "./ChatList";
import Conversation from "./Conversation";
import ChoiceModal from "./ChoiceModal";
import { useStoryEngine } from "../../hooks/useStoryEngine";

export default function MessengerApp() {
  const { state, dispatch, openChat } = useMessenger();
  const { init, startStoryIfNeeded, autoStartStories } = useStoryEngine();

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Запуск сюжета при открытии чата
  useEffect(() => {
    if (state.activeChatId) {
      startStoryIfNeeded(state.activeChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeChatId]);

  // 🆕 Автостарт при появлении Вовы
  useEffect(() => {
    autoStartStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chats.vova?.hidden]);

  const totalUnread = Object.values(state.chats).reduce(
    (acc, c) => acc + (c.hidden ? 0 : c.unread),
    0,
  );

  const activeChat = state.activeChatId
    ? state.chats[state.activeChatId]
    : null;

  return (
    <>
      <Box
        className={state.activeChatId ? "chat-open" : ""}
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          minHeight: 0,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <IconRail
          filterMode={state.filterMode}
          onFilterChange={(mode) =>
            dispatch({ type: "SET_FILTER", payload: mode })
          }
          totalUnread={totalUnread}
        />

        <ChatList
          chats={state.chats}
          chatOrder={state.chatOrder}
          activeChatId={state.activeChatId}
          filterMode={state.filterMode}
          onSelectChat={openChat}
        />

        <Conversation
          chat={activeChat}
          onBack={() => dispatch({ type: "SET_ACTIVE", payload: null })}
        />
      </Box>

      <ChoiceModal />
    </>
  );
}
