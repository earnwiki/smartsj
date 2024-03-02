import {default as isStorageAvailable} from './storage-checker';
import {isPageRefresh} from './track-visited-pages';

export default () => {
    const $countdown = $('.countdown');
    const countdownTime = $countdown.data('time') || 600000; // data-time
    const avoidReset = $countdown.data('avoidReset') || false; // data-avoid-reset
    const resetAfterTimeEnds = $countdown.data('resetAfterEnd') ?? true;  // data-reset-after-end
    const countdownBuffer = 2000;
    const $minutes = $('.minutes-1')
    const $minutes2 = $('.minutes-2')
    const $seconds = $('.seconds-1')
    const $seconds2 = $('.seconds-2')
    const TIMER_STARTED_LOCAL_STORAGE_KEY = 'countdown-start';
    let start;

    if ($countdown && isStorageAvailable('localStorage')) {
        start = new Date(JSON.parse(localStorage.getItem(TIMER_STARTED_LOCAL_STORAGE_KEY)));
        if (!start || (new Date().getTime() - start.getTime() > countdownTime + countdownBuffer)) {
            resetTimer();
        }
        setInterval(updateTimer, 1000);
    } else {
        $countdown.hide();
    }

    function resetTimer()
    {
        if (avoidReset) {
            return;
        }

        start = new Date();
        localStorage.setItem(TIMER_STARTED_LOCAL_STORAGE_KEY, JSON.stringify(start));
    }

    function resetTimerIfNewPage()
    {
        if (!isPageRefresh()) {
            resetTimer()
        }
    }

    async function updateTimer()
    {
        const now = new Date().getTime();
        let timeRemaining = countdownTime + countdownBuffer - (now - start.getTime());
        timeRemaining = timeRemaining > countdownTime ? countdownTime : timeRemaining;
        const minutesLeft = [...Math.floor((timeRemaining % (60000 * 60)) / 60000) + ''];
        const secondsLeft = [...Math.floor((timeRemaining % 60000) / 1000) + ''];
        if (timeRemaining < 0) {
            $minutes.html(0);
            $minutes2.html(0);
            $seconds.html(0);
            $seconds2.html(0);
            if (resetAfterTimeEnds) {
                resetTimer();
            }
        } else {
            const lastDigit = secondsLeft[1] || secondsLeft[0];
            if ($seconds2.html() === lastDigit) {
                await new Promise(r => setTimeout(r, 100));
                await updateTimer();
            }
            $minutes.html(minutesLeft[1] ? minutesLeft[0] : 0);
            $minutes2.html(minutesLeft[1] || minutesLeft[0]);
            $seconds.html(secondsLeft[1] ? secondsLeft[0] : 0);
            $seconds2.html(lastDigit);
        }
    }

    window.resetTimerIfNewPage = resetTimerIfNewPage;
}
