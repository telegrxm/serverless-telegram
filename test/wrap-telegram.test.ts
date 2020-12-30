import { Chat, Message, Update } from 'node-telegram-bot-api';
import wrapTelegram, {
  getMessage,
  strToText,
  ResponseMethod,
  toResponseMethod,
} from '../src/wrap-telegram';

const chat_id = 3;
const chat: Chat = {
  id: chat_id,
  type: 'private',
};

const text = 'Hello World!';

const message: Message = {
  message_id: 2,
  chat,
  text,
  date: 123,
};

const update: Update = {
  update_id: 1,
  message,
};

const responseMethod: ResponseMethod = {
  method: 'sendMessage',
  chat_id,
  text,
};

const media = ['url1', 'url2'];

const mediaResponse: ResponseMethod = {
  method: 'sendMediaGroup',
  chat_id,
  media,
};

const sticker = 'sticker URL';
const stickerResponse: ResponseMethod = {
  method: 'sendSticker',
  chat_id,
  sticker,
};

describe('getMessage', () => {
  it('gets message from an update', () => {
    expect(getMessage(update)).toEqual(message);
  });
  it('ignores non-message updates', () => {
    expect(getMessage({ update_id: 1 })).toBeFalsy();
  });
});

describe('strToText', () => {
  it('converts a string', () => {
    expect(strToText(text)).toEqual({ text });
  });
  it('ignores an object', () => {
    expect(strToText({ text })).toEqual({ text });
    expect(strToText({ media })).toEqual({ media });
  });
  it('ignores undefined', () => {
    expect(strToText()).toBeUndefined();
  });
});

describe('toResponseMethod', () => {
  it('sends a text message', () => {
    expect(toResponseMethod({ text }, chat_id)).toEqual(responseMethod);
  });
  it('sends a media group', () => {
    expect(toResponseMethod({ media }, chat_id)).toEqual(mediaResponse);
  });
  it('sends a sticker', () => {
    expect(toResponseMethod({ sticker }, chat_id)).toEqual(stickerResponse);
  });
  it('sends no response', () => {
    expect(toResponseMethod(undefined, chat_id)).toBeUndefined();
  });
});

describe('wrapTelegram', () => {
  const echoHandler = wrapTelegram(async ({ text }) => text);

  it('passes messages to the handler and forms the response method', async () => {
    expect(await echoHandler(update)).toEqual(responseMethod);
  });

  it("ignores updates that don't contain a message", async () => {
    expect(await echoHandler({ update_id: 1 })).toBeUndefined();
  });
});