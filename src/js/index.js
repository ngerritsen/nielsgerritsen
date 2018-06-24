import autoSetAge from './autoSetAge';
import initPublicationThumbnails from './publicationThumbnails';
import { ready } from './domUtils';

ready(() => {
  autoSetAge();
  initPublicationThumbnails();
});
