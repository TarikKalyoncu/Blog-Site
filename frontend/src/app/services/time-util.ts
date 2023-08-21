export function getTimeElapsed(date: Date): string {
    if (typeof date === 'string' || typeof date === 'number') {
        date = new Date(date);
      }
    
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
    
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - date.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) {
      return years === 1 ? '1 yıl önce' : `${years} yıl önce`;
    } else if (months > 0) {
      return months === 1 ? '1 ay önce' : `${months} ay önce`;
    } else if (days > 0) {
      return days === 1 ? '1 gün önce' : `${days} gün önce`;
    } else if (hours > 0) {
      return hours === 1 ? '1 saat önce' : `${hours} saat önce`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 dakika önce' : `${minutes} dakika önce`;
    } else {
      return 'şimdi';
    }
  }