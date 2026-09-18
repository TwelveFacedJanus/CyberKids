import type { SvgIconComponent } from '@mui/icons-material'
import MarkEmailUnread from '@mui/icons-material/MarkEmailUnread'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined'
import BugReportOutlined from '@mui/icons-material/BugReportOutlined'
import PrivacyTipOutlined from '@mui/icons-material/PrivacyTipOutlined'
import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import PanToolOutlined from '@mui/icons-material/PanToolOutlined'
import ViewInAr from '@mui/icons-material/ViewInAr'
import QuizOutlined from '@mui/icons-material/QuizOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import BalanceOutlined from '@mui/icons-material/BalanceOutlined'
import TipsAndUpdatesOutlined from '@mui/icons-material/TipsAndUpdatesOutlined'
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import RocketLaunchOutlined from '@mui/icons-material/RocketLaunchOutlined'
import Security from '@mui/icons-material/Security'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
import LockOpen from '@mui/icons-material/LockOpen'
import Mood from '@mui/icons-material/Mood'
import MoodBad from '@mui/icons-material/MoodBad'
import Verified from '@mui/icons-material/Verified'
import WarningAmber from '@mui/icons-material/WarningAmber'
import CodeIcon from '@mui/icons-material/Code';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ViewKanban from '@mui/icons-material/ViewKanban';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import GamepadIcon from '@mui/icons-material/Games';
import QuizIcon from '@mui/icons-material/Quiz';
import ShieldIcon from '@mui/icons-material/Shield';

export const topicIcons: Record<string, SvgIconComponent> = {
  phishing: MarkEmailUnread,
  cyberbullying: ShieldOutlined,
  passwords: VpnKeyOutlined,
  viruses: BugReportOutlined,
  privacy: PrivacyTipOutlined,
  safe: HealthAndSafetyOutlined,
  python: CodeIcon,
  lua: DeveloperBoardIcon,
  gaming_scams: GamepadIcon,
  safety_test: QuizIcon,
  cyber_hero_test: ShieldIcon,
}

export const taskTypeIcons: Record<string, SvgIconComponent> = {
  dragdrop: PanToolOutlined,
  drag3d: ViewInAr,
  quiz: QuizOutlined,
  sort: CategoryOutlined,
  true_false: BalanceOutlined,
  scenario: TipsAndUpdatesOutlined,
  code: CodeIcon,
  debug: BugReportOutlined,
  ai_prompt: AutoAwesome,
  algorithm: ViewKanban,
}

export const ageGroupIcons: Record<string, SvgIconComponent> = {
  junior: ChildCareOutlined,
  middle: SchoolOutlined,
  senior: RocketLaunchOutlined,
}

const zoneAliases: Record<string, SvgIconComponent> = {
  email: MarkEmailUnread,
  shield: ShieldOutlined,
  key: VpnKeyOutlined,
  bug: BugReportOutlined,
  privacy: PrivacyTipOutlined,
  safety: HealthAndSafetyOutlined,
  phishing: MarkEmailUnread,
  cyberbullying: ShieldOutlined,
  passwords: VpnKeyOutlined,
  viruses: BugReportOutlined,
  safe: HealthAndSafetyOutlined,
  danger: Cancel,
  strong: VpnKeyOutlined,
  weak: LockOpen,
  kind: Mood,
  mean: MoodBad,
  trust: Verified,
  suspect: WarningAmber,
  private: PrivacyTipOutlined,
  ok: CheckCircle,
  virus: BugReportOutlined,
}

export function zoneIconFor(id?: string): SvgIconComponent {
  if (id && zoneAliases[id]) return zoneAliases[id]
  return PrivacyTipOutlined
}

export { Security, CheckCircle, Cancel }

export type { SvgIconComponent }

export function darkenHex(hex: string, amt = 45): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) - amt))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) - amt))
  const b = Math.min(255, Math.max(0, (n & 255) - amt))
  return `rgb(${r},${g},${b})`
}