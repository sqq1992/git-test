export default function formatActivityDesc(str = '') {
  return str.split('\n').map(row => `<p>${row}</p>`).join('');
};
