const Feed = require('../../src/Feed');
const Parser = require('rss-parser');

jest.mock('rss-parser');

describe('Feed', () => {
  let feed;
  let feedConfig;

  beforeEach(() => {
    Parser.mockClear();

    feedConfig = {
      description: 'This is a description',
      title: 'This is a title',
      url: 'http://www.examplefeed.com/rss',
    };
  });

  test('creates feed from configuration', () => {
    feed = Feed({feedConfig});

    expect(feed.config).toEqual(feedConfig);
    expect(Parser).toHaveBeenCalledTimes(1);
  });

  test('resolves feed with valid url', async () => {
    const items = [{ title: 'test', content: 'test 2' }];
    Parser.mockImplementation(() => ({
      parseURL: () => ({ title: 'mock title', items }),
    }));

    const result = await Feed({feedConfig}).resolve();

    expect(result.description).toEqual(feedConfig.description);
    expect(result.title).toEqual(feedConfig.title);
    expect(result.items).toEqual(items);
  });

  test('it removes urls from titles', async () => {
    const items = [{ title: 'test http://www.example.com/', content: 'test more content' }];
    Parser.mockImplementation(() => ({
      parseURL: () => ({ title: 'mock title', items }),
    }));

    const result = await Feed({feedConfig}).resolve();

    expect(result.items[0].title).toEqual('test ');
  });
});
