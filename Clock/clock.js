document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  const currentDateElement = document.getElementById('currentDate');
  const timezoneNameElement = document.getElementById('timezoneName');
  const citySelect = document.getElementById('citySelect');

  // Real-Time Update Function
  const updateClock = () => {
    const selectedZone = citySelect.value; // By Default "Asia/Karachi"
    const now = new Date();

    let hours, minutes, seconds, dateString, timeZoneLabel;

    if (selectedZone === 'LOCAL') {
      // Local Device Time
      hours = String(now.getHours()).padStart(2, '0');
      minutes = String(now.getMinutes()).padStart(2, '0');
      seconds = String(now.getSeconds()).padStart(2, '0');

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateString = now.toLocaleDateString(undefined, options);
      timeZoneLabel = `Local System Timezone (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
    } else {
      // Fetch Timezone (Pakistan Standard Time or other selected countries)
      try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        const parts = timeFormatter.formatToParts(now);
        const partMap = {};
        parts.forEach(p => partMap[p.type] = p.value);

        hours = partMap.hour;
        minutes = partMap.minute;
        seconds = partMap.second;

        // Date formatting according to timezone
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedZone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        dateString = dateFormatter.format(now);

        const selectedOptionText = citySelect.options[citySelect.selectedIndex].text;
        timeZoneLabel = selectedOptionText;
      } catch (e) {
        hours = '00';
        minutes = '00';
        seconds = '00';
        dateString = 'Error loading time';
        timeZoneLabel = selectedZone;
      }
    }

    // DOM Updates
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;
    currentDateElement.textContent = dateString;
    timezoneNameElement.textContent = timeZoneLabel;
  };

  // Event Listener for Dropdown Selection Change
  citySelect.addEventListener('change', updateClock);

  // Initial Run (Instant load Pakistan Time)
  updateClock();

  // 100% Live Sync every 1000ms (1 Second)
  setInterval(updateClock, 1000);
});