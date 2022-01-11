/* eslint-disable react/react-in-jsx-scope */
import { RadioGroup, Switch } from '@/components/atoms';
import { IStepsCardsData } from '@/types';

import './StepCard.scss';

const stepOneChildren = (
  <RadioGroup
    items={[
      { text: 'Sleepy', value: 1 },
      { text: 'Dollop', value: 2 },
      { text: 'Twinkile', value: 3 },
      { text: 'Churro', value: 4 },
      { text: 'Sunny', value: 5 },
    ]}
    className="stepCard-body__content__one"
  />
);

const stepTwoChildren = (
  <div>
    <span>Name</span>
    <span>Allow collectible to be locked</span>
    <span>
      The collectible you’ve chosen will be locked in a smart contract while it’s being used as your
      profile picture. Don’t worry - you’ll be able to get it back at any time.
    </span>
  </div>
);

const stepThreeChildren = (
  <RadioGroup
    items={[
      { text: 'Name', value: 1 },
      { text: 'Name', value: 2 },
      { text: 'Name', value: 3 },
    ]}
  />
);

const stepFourChildren = (
  <div>
    <input type="text" />
    <Switch />
    <span>I understand that people can view my wallet if they know my username.</span>
  </div>
);

export const stepsCardsData: IStepsCardsData[] = [
  {
    id: 1,
    mainTitle: 'Get Starter Collectible',
    mainSubtitle:
      'Every profile starts by making a “starter” collectible (NFT).This starter will also become your first profile picture.You can change your profile pic later if you get another approved Pancake Collectible.',
    secondTitle: 'Choose your Starter!',
    secondSubtitle: 'Choose wisely: you can only ever make one starter collectible!Cost: 1.0 CAKE',
    children: stepOneChildren,
  },
  {
    id: 2,
    mainTitle: 'Set Profile Picture',
    mainSubtitle: '',
    secondTitle: 'Choose collectible',
    secondSubtitle: (
      <span>
        Choose a profile picture form the eligible collectibles (NFT) in your wallet, shown
        below.Only approved Pancake Collectibles can be used<a href="/">See the list</a>
      </span>
    ),
    children: stepTwoChildren,
  },
  {
    id: 3,
    mainTitle: 'Join a Team',
    mainSubtitle: '',
    secondTitle: '',
    secondSubtitle: 'It won’t be possible to undo the choice you make for the foreseeable future!',
    children: stepThreeChildren,
  },
  {
    id: 4,
    mainTitle: 'Set Your Name',
    mainSubtitle:
      'This name will be shown in team leaderboards and search results as long as your profile is active.',
    secondTitle: 'Set Your Name',
    secondSubtitle:
      'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
    children: stepFourChildren,
  },
];
