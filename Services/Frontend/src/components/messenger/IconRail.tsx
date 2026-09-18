// src/components/messenger/IconRail.tsx
import { Box, Button, Badge } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { ChatFilter } from "../../types/messenger";

import { SvgIcon } from "@mui/material";
import ChatIcon from "../../../public/ui-icons/message.svg?react";
import ContactsIcon from "../../../public/ui-icons/contacts.svg?react";
import TelephoneIcon from "../../../public/ui-icons/telephone.svg?react";
import SettingsIcon from "../../../public/ui-icons/settings.svg?react";

interface Props {
  filterMode: ChatFilter;
  onFilterChange: (mode: ChatFilter) => void;
  totalUnread: number;
}

const RAIL_BTN_SX = {
  width: 52,
  height: 52,
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  minWidth: 0,
  fontSize: 10.5,
  color: "#8a8f98",
  fontWeight: 600,
  textTransform: "none" as const,
  padding: 0,
  mb: "6px",
  "& svg": { fontSize: 22 },
  "&:hover": { color: "#5e5e5e" },
  "&.active": { color: "#020202" },
};

export default function IconRail({
  filterMode,
  onFilterChange,
  totalUnread,
}: Props) {
  return (
    <Box
      sx={{
        width: 76,
        bgcolor: "#fff",
        borderRight: "1px solid #e7e9ec",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2.25,
        flexShrink: 0,
        minHeight: 0,
      }}
    >
      <Button
        onClick={() => onFilterChange("all")}
        disableRipple
        className={filterMode === "all" ? "active" : ""}
        sx={{
          ...RAIL_BTN_SX,
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "transparent" },
        }}
      >
        <ChatIcon />
        Все
      </Button>

      <Button
        onClick={() => onFilterChange("unread")}
        disableRipple
        className={filterMode === "unread" ? "active" : ""}
        sx={{
          ...RAIL_BTN_SX,
          position: "relative",
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "transparent" },
        }}
      >
        <ChatIcon />
        Новые
        {totalUnread > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 10,
              minWidth: 16,
              height: 16,
              px: "4px",
              borderRadius: "8px",
              bgcolor: "#2f7bf6",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {totalUnread > 9 ? "9+" : totalUnread}
          </Box>
        )}
      </Button>

      <Button
        disabled
        disableRipple
        sx={{
          ...RAIL_BTN_SX,
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "transparent" },
        }}
      >
        <ContactsIcon />
        Контакты
      </Button>

      <Button
        disabled
        disableRipple
        sx={{
          ...RAIL_BTN_SX,
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "transparent" },
        }}
      >
        <TelephoneIcon />
        Звонки
      </Button>

      <Box sx={{ flex: 1 }} />

      <Button
        disabled
        disableRipple
        sx={{
          ...RAIL_BTN_SX,
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "transparent" },
        }}
      >
        <SettingsIcon />
        Настройки
      </Button>
    </Box>
  );
}
