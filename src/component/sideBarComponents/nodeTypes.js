import {
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
  FaRobot,
  FaPhoneAlt,
  FaUserTie,
} from "react-icons/fa";
import { TbArrowsSplit } from "react-icons/tb";
import { FiPlayCircle, FiStopCircle, FiClock } from 'react-icons/fi';

export const autoNodeTypes = [
  { type: "sms", label: "SMS", icon: <FaCommentDots />, color: "indigo", shade: "400", nodeActionType: "automatic" },
  { type: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp />, color: "green", shade: "500", nodeActionType: "automatic" },
  { type: "botCall", label: "Bot Call", icon: <FaRobot />, color: "purple", shade: "500", nodeActionType: "automatic" },
  { type: "email", label: "Email", icon: <FaEnvelope />, color: "orange", shade: "500", nodeActionType: "automatic" },
];

export const manualNodeTypes = [
  { type: "fieldAgent", label: "Agent", icon: <FaUserTie />, color: "red", shade: "500", nodeActionType: "manual" },
  { type: "teleCall", label: "Tele Call", icon: <FaPhoneAlt />, color: "stone", shade: "500", nodeActionType: "manual" },
];

export const controlNodesTypes = [
  { type: "start", label: "Start", icon: <FiPlayCircle />, color: "green", shade: "500", nodeActionType: "control" },
  { type: "end", label: "End", icon: <FiStopCircle />, color: "red", shade: "500", nodeActionType: "control" },
  { type: "decision", label: "Decision", icon: <TbArrowsSplit />, color: "orange", shade: "500", nodeActionType: "control" },
  { type: "wait", label: "Wait", icon: <FiClock />, color: "yellow", shade: "500", nodeActionType: "control" },
];