type Reaction = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes';

const reactionType = (reaction: string): string => {
  if (reactionTypes.includes(reaction)) {
    return reaction;
  }
  return '';
};

const reactionTypes = ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray', 'rocket', 'eyes'];

export { Reaction, reactionType };
