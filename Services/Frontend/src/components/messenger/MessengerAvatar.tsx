// src/components/messenger/MessengerAvatar.tsx
import { Avatar, Box } from "@mui/material";
import { hashColor, initials } from "./utils";

interface Props {
  name: string;
  imgSrc?: string;
  size?: 30 | 38 | 44;
}

export default function MessengerAvatar({ name, imgSrc, size = 44 }: Props) {
  const color = hashColor(name);
  const px = size;

  return (
    <Avatar
      src={imgSrc}
      alt={name}
      sx={{
        width: px,
        height: px,
        bgcolor: color,
        fontSize: size === 44 ? 16 : size === 38 ? 14 : 12,
        fontWeight: 700,
        flexShrink: 0,
        "& img": { objectFit: "cover" },
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
