import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories');
  require('../src/stories/Cards.js');
  require('../src/stories/SidePanels.js');
  require('../src/stories/Header.js');
  require('../src/stories/Stats.js');
  require('../src/stories/Banner.js');
}

configure(loadStories, module);
