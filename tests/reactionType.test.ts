import { reactionType } from '../src/reactionType';

describe('reactionType test', function () {
  it('valid reaction type should be the same value', () => {
    const validReactions = ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray', 'rocket', 'eyes'];
    for (const validReaction of validReactions) {
      expect(reactionType(validReaction)).toEqual(validReaction);
    }
  });

  it('not valid reaction type should be sanitized to ``', () => {
    const notValidReactions = ['', 'foo'];
    for (const notValidReaction of notValidReactions) {
      expect(reactionType(notValidReaction)).toEqual('');
    }
  });
});
