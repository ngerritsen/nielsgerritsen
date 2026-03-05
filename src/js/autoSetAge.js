export default function autoSetAge() {
  const ageEl = document.querySelector('[data-age]');
  const birth = new Date(1989, 6, 18); // month is 0-indexed
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) age--;

  const postFix = ageEl.getAttribute('data-postfix');
  ageEl.textContent = String(age) + postFix;
}
