// src/pages/AlexQuestPage.tsx
import { Box } from "@mui/material";
import { MessengerProvider } from "../context/MessengerContext";
import MessengerApp from "../components/messenger/MessengerApp";
import Layout from "../components/Layout";

export default function AlexQuestPage() {
  return (
    <Layout theme="alex">
      <Box
        sx={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          height: "100%",
        }}
      >
        <MessengerProvider>
          <MessengerApp />
        </MessengerProvider>
      </Box>
    </Layout>
  );
}
