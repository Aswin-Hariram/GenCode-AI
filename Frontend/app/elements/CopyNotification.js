import { Check } from 'lucide-react';

const CopyNotification = ({ copied }) => (
  <div
    className={`fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-md flex items-center gap-2 ${
      copied ? 'animate-fadeIn opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    aria-live="polite"
  >
    <Check size={16} />
    <span>Copied to clipboard!</span>
  </div>
);

export default CopyNotification;
