import { Response } from '../types/';

function sendResponse({ message, payload, error, token }: Response) {
  return {
    message,
    payload,
    error,
    token,
  };
}

export default sendResponse;
