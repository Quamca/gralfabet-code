import { renderHook, act } from '@testing-library/react-native';
import { Audio } from 'expo-av';
import { useAudio } from '../useAudio';

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

const MOCK_ASSET = 1 as unknown as number;

function makeSoundMock() {
  return {
    stopAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    setOnPlaybackStatusUpdate: jest.fn(),
  };
}

describe('useAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createAsync with the asset path and shouldPlay: true', async () => {
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({ sound: makeSoundMock() });

    const { result } = renderHook(() => useAudio(MOCK_ASSET));

    await act(async () => {
      await result.current.play();
    });

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(MOCK_ASSET, { shouldPlay: true });
  });

  it('stops and unloads the previous sound when play is called again', async () => {
    const firstSound = makeSoundMock();
    const secondSound = makeSoundMock();

    (Audio.Sound.createAsync as jest.Mock)
      .mockResolvedValueOnce({ sound: firstSound })
      .mockResolvedValueOnce({ sound: secondSound });

    const { result } = renderHook(() => useAudio(MOCK_ASSET));

    await act(async () => { await result.current.play(); });
    await act(async () => { await result.current.play(); });

    expect(firstSound.stopAsync).toHaveBeenCalledTimes(1);
    expect(firstSound.unloadAsync).toHaveBeenCalledTimes(1);
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(2);
  });

  it('does not throw when createAsync rejects', async () => {
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(new Error('asset missing'));

    const { result } = renderHook(() => useAudio(MOCK_ASSET));

    await expect(
      act(async () => { await result.current.play(); })
    ).resolves.not.toThrow();
  });
});
