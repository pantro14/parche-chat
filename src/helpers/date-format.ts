import dayjs from 'dayjs';

export const formatDateTime = (dateString: Date): string => {
  const now = dayjs();
  const messageDate = dayjs(dateString);
  // date less 1 min ago, show "just now"
  if (now.diff(messageDate, 'minute') < 1) {
    return 'just now';
  }
  // date less 1 hour ago, show "x minutes ago"
  if (now.diff(messageDate, 'hour') < 1) {
    const minutesAgo = now.diff(messageDate, 'minute');
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  }
  // date today, show "HH:mm"
  if (now.isSame(messageDate, 'day')) {
    return messageDate.format('HH:mm A');
  }
  // date yesterday, show "Yesterday at HH:mm"
  if (now.subtract(1, 'day').isSame(messageDate, 'day')) {
    return `Yesterday at ${messageDate.format('HH:mm')}`;
  }
  // date older than 7 days, show "DD/MM/YYYY at HH:mm"
  if (now.diff(messageDate, 'day') >= 7) {
    return messageDate.format('DD/MM/YYYY at HH:mm');
  }
  return messageDate.format('DDD MM YYYY HH:mm A');
};
