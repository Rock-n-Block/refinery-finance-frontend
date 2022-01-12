/* eslint-disable react/react-in-jsx-scope */
import { IstepsDataConfig } from '@/types';

import './StepCard/StepCard.scss';

export const firstStepItems: string[] = ['Sunny', 'Dollop', 'Yellow', 'Garry'];
export const thirdStepItems: string[] = ['OneTeam', 'TwoTeam', 'ThreeTeam'];

export const stepsDataConfig: IstepsDataConfig[] = [
  {
    id: 1,
    mainTitle: 'Get Starter Collectible',
    mainSubtitle:
      'Every profile starts by making a “starter” collectible (NFT).This starter will also become your first profile picture.You can change your profile pic later if you get another approved Pancake Collectible.',
    secondTitle: 'Choose your Starter!',
    secondSubtitle: 'Choose wisely: you can only ever make one starter collectible!Cost: 1.0 CAKE',
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
  },
  {
    id: 3,
    mainTitle: 'Join a Team',
    mainSubtitle: '',
    secondTitle: '',
    secondSubtitle: 'It won’t be possible to undo the choice you make for the foreseeable future!',
  },
  {
    id: 4,
    mainTitle: 'Set Your Name',
    mainSubtitle:
      'This name will be shown in team leaderboards and search results as long as your profile is active.',
    secondTitle: 'Set Your Name',
    secondSubtitle:
      'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
  },
];
