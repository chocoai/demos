import fetch from "../../xhr/fetch";

export const share = param => fetch("POST", "/wx/v1/bonus/share", param);
export const getMyRedPacket = param =>
  fetch("GET", "/wx/v1/bonus/listPageVO", param);
export const getHelpContent = param =>
  fetch("GET", "/wx/v1/bonus/helpPageVO", param);
export const help = param => fetch("POST", "/wx/v1/bonus/help", param);
export const getRedPacketContent = param =>
  fetch("GET", "/wx/v1/bonus/bonusPageVO", param);
