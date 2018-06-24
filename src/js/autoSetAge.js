import moment from 'moment';

export default function autoSetAge() {
  const ageEl = document.querySelector('[data-age]');
  const birth = moment('18-07-1989', 'DD-MM-YYYY');
  const now = moment();
  const age = now.diff(birth, 'years');
  const postFix = ageEl.getAttribute('data-postfix');

  ageEl.textContent = String(age) + postFix;
}
