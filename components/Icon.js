import React from "react";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

const BaseIcon = ({ icon, onPress }) => (
  <Pressable
    disabled={!onPress}
    onPress={onPress}
    style={{ marginStart: "auto" }}
  >
    {icon}
  </Pressable>
);

const mapIcon = ({ type, name, onPress, style }) => {
  if (type === "MaterialCommunityIcons") {
    return (
      <MaterialCommunityIcon name={name} onPress={onPress} style={style} />
    );
  }
  return null;
};

export const Icon = ({ type, name, onPress, style }) => {
  const { globalStyles } = useStyles();
  if (!type || !name) return null;
  const icon = mapIcon({ type, name, onPress, style });
  if (!icon) return null;
  return <BaseIcon icon={icon} onPress={onPress} />;
};

export const MaterialCommunityIcon = ({ name, onPress, style }) => {
  const { globalStyles } = useStyles();
  const icon = (
    <MaterialCommunityIcons name={name} style={[globalStyles.icon, style]} />
  );
  return <BaseIcon icon={icon} onPress={onPress} />;
};

// Dynamic Icons
export const ArrowIcon = ({ header, onPress, style }) => {
  const { isRTL } = useI18N();
  if (isRTL && header)
    return <ArrowForwardIcon onPress={onPress} style={style} />;
  if (header) return <ArrowBackIcon onPress={onPress} style={style} />;
  if (isRTL) return <ArrowBackIcon onPress={onPress} style={style} />;
  return <ArrowForwardIcon onPress={onPress} style={style} />;
};

export const ChevronIcon = ({ header, onPress, style }) => {
  const { isRTL } = useI18N();
  if (isRTL && header)
    return <ChevronForwardIcon onPress={onPress} style={style} />;
  if (header) return <ChevronBackIcon onPress={onPress} style={style} />;
  if (isRTL) return <ChevronBackIcon onPress={onPress} style={style} />;
  return <ChevronForwardIcon onPress={onPress} style={style} />;
};

// Static Icons

export const AddIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="plus" onPress={onPress} style={style} />
);
export const AddNewIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="plus-circle-outline"
    onPress={onPress}
    style={style}
  />
);
export const AlertIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="alert-circle-outline"
    onPress={onPress}
    style={style}
  />
);
export const ArrowBackIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="arrow-left" onPress={onPress} style={style} />
);
export const ArrowForwardIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="arrow-right" onPress={onPress} style={style} />
);
export const BellIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="bell" onPress={onPress} style={style} />
);
export const CancelIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="close" onPress={onPress} style={style} />
);
export const CaretIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chevron-down" onPress={onPress} style={style} />
);
export const CheckIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="check" onPress={onPress} style={style} />
);
export const ChevronDownIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chevron-down" onPress={onPress} style={style} />
);
export const ChevronUpIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chevron-up" onPress={onPress} style={style} />
);
export const ChevronBackIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chevron-left" onPress={onPress} style={style} />
);
export const ChevronForwardIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chevron-right" onPress={onPress} style={style} />
);
export const ClearIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="close" onPress={onPress} style={style} />
);
export const ClearAllIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="notification-clear-all"
    onPress={onPress}
    style={style}
  />
);
export const ClearFiltersIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="filter-variant-remove"
    onPress={onPress}
    style={style}
  />
);
export const CloseIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="close" onPress={onPress} style={style} />
);
export const CircleIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="circle" onPress={onPress} style={style} />
);
export const CircleOutlineIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="circle-outline"
    onPress={onPress}
    style={style}
  />
);
export const CogIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="cog" onPress={onPress} style={style} />
);
export const CommentPlusIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="comment-plus" onPress={onPress} style={style} />
);
export const CopyIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="content-copy" onPress={onPress} style={style} />
);
export const DarkModeIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="theme-light-dark"
    onPress={onPress}
    style={style}
  />
);
export const DeleteIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="delete" onPress={onPress} style={style} />
);
export const DoneIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="check" onPress={onPress} style={style} />
);
export const AcceptIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="check-circle" onPress={onPress} style={style} />
);
export const DeclineIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="close-circle" onPress={onPress} style={style} />
);
export const EditIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="pencil" onPress={onPress} style={style} />
);
export const ExpandIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="arrow-expand" onPress={onPress} style={style} />
);
export const ExternalLinkIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="open-in-new" onPress={onPress} style={style} />
);
export const EyeIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="eye" onPress={onPress} style={style} />
);
export const FeedbackIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="frequently-asked-questions"
    onPress={onPress}
    style={style}
  />
);
export const FlashIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="flash" onPress={onPress} style={style} />
);
export const HamburgerIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="dots-horizontal"
    onPress={onPress}
    style={style}
  />
);
export const HelpIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="help-circle" onPress={onPress} style={style} />
);
export const InfinityIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="infinity" onPress={onPress} style={style} />
);
export const KebabIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="dots-vertical" onPress={onPress} style={style} />
);
export const KeyIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="key-variant" onPress={onPress} style={style} />
);
export const LeaderIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="foot-print" onPress={onPress} style={style} />
);
export const LinkIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="link" onPress={onPress} style={style} />
);
export const LockIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="lock-outline" onPress={onPress} style={style} />
);
export const LoginIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="login-variant" onPress={onPress} style={style} />
);
export const LogoutIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="logout" onPress={onPress} style={style} />
);
export const MapIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="earth" onPress={onPress} style={style} />
);
export const MeatballIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="dots-horizontal"
    onPress={onPress}
    style={style}
  />
);
export const OnePasswordIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="onepassword" onPress={onPress} style={style} />
);
export const UnreadIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="checkbox-blank-circle"
    onPress={onPress}
    style={style}
  />
);
export const ReadIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="checkbox-marked-circle-outline"
    onPress={onPress}
    style={style}
  />
);
export const ReadAllIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="checkbox-multiple-marked-circle-outline"
    onPress={onPress}
    style={style}
  />
);
export const RemoveIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="minus" onPress={onPress} style={style} />
);
export const SaveIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="content-save" onPress={onPress} style={style} />
);
export const SearchIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="magnify" onPress={onPress} style={style} />
);
export const SecurityIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="security" onPress={onPress} style={style} />
);
export const SendIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="send-circle" onPress={onPress} style={style} />
);
export const SortIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="sort" onPress={onPress} style={style} />
);
export const SquareIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="square" onPress={onPress} style={style} />
);
export const StarIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="star" onPress={onPress} style={style} />
);
export const StarOutlineIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="star-outline" onPress={onPress} style={style} />
);
export const TranslateIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="translate" onPress={onPress} style={style} />
);

// Various Calendars
export const CalendarIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="calendar" onPress={onPress} style={style} />
);

// Notifications
export const CommentIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="comment-text-outline"
    onPress={onPress}
    style={style}
  />
);
export const CommentAlertIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="comment-alert" onPress={onPress} style={style} />
);
export const CommentEditIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="comment-edit-outline"
    onPress={onPress}
    style={style}
  />
);
export const MentionIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="at" onPress={onPress} style={style} />
);

// Sort
export const SortAscIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-ascending"
    onPress={onPress}
    style={style}
  />
);
export const SortDescIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-descending"
    onPress={onPress}
    style={style}
  />
);
export const SortAscIconDate = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-calendar-ascending"
    onPress={onPress}
    style={style}
  />
);
export const SortDescIconDate = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-calendar-descending"
    onPress={onPress}
    style={style}
  />
);
export const SortAscIconMod = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-clock-ascending"
    onPress={onPress}
    style={style}
  />
);
export const SortDescIconMod = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sort-clock-descending"
    onPress={onPress}
    style={style}
  />
);

// Nav Tab Bar
export const HomeIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="home-analytics"
    onPress={onPress}
    style={style}
  />
);
export const AccountIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="account" onPress={onPress} style={style} />
);
export const AccountsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="account-group" onPress={onPress} style={style} />
);
export const UserIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="account-circle"
    onPress={onPress}
    style={style}
  />
);
export const MoreIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="menu" onPress={onPress} style={style} />
);
export const PostIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="file-multiple" onPress={onPress} style={style} />
);
export const TrainingsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="school" onPress={onPress} style={style} />
);
export const MeetingsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="calendar-multiselect"
    onPress={onPress}
    style={style}
  />
);
export const CampaignsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="bullhorn" onPress={onPress} style={style} />
);
export const StreamsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="axis-arrow" onPress={onPress} style={style} />
);
export const SubscriptionsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="playlist-check"
    onPress={onPress}
    style={style}
  />
);
export const MetricsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chart-bar" onPress={onPress} style={style} />
);
export const GenmapperIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="sitemap-outline"
    onPress={onPress}
    style={style}
  />
);

// Login screen
export const UsernameIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="account-key" onPress={onPress} style={style} />
);

// Other icons
export const ArchiveIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="archive" onPress={onPress} style={style} />
);
export const ActivityIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="timeline-outline"
    onPress={onPress}
    style={style}
  />
);
export const CommentActivityIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="timeline-text-outline"
    onPress={onPress}
    style={style}
  />
);
export const ShareIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="share-variant" onPress={onPress} style={style} />
);
export const UpdateRequiredIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="progress-alert"
    onPress={onPress}
    style={style}
  />
);
export const TasksIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="clock-check-outline"
    onPress={onPress}
    style={style}
  />
);
export const FollowingIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="eye-outline" onPress={onPress} style={style} />
);
export const ShowIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="eye" onPress={onPress} style={style} />
);
export const HideIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="eye-off" onPress={onPress} style={style} />
);
export const PreferencesIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="cog-outline" onPress={onPress} style={style} />
);
export const InfoIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="information-outline"
    onPress={onPress}
    style={style}
  />
);
export const LogsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="timeline-clock-outline"
    onPress={onPress}
    style={style}
  />
);
export const MapsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="map" onPress={onPress} style={style} />
);
export const TreesIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="family-tree" onPress={onPress} style={style} />
);
export const ChartsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="chart-pie" onPress={onPress} style={style} />
);
export const HighlightsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="white-balance-sunny"
    onPress={onPress}
    style={style}
  />
);
export const SettingsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="cog" onPress={onPress} style={style} />
);
export const PersonIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="child" onPress={onPress} style={style} />
);
export const MaleIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="human-male" onPress={onPress} style={style} />
);
export const FemaleIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon name="human-female" onPress={onPress} style={style} />
);
export const GroupsIcon = ({ onPress, style }) => (
  <MaterialCommunityIcon
    name="account-group-outline"
    onPress={onPress}
    style={style}
  />
);
