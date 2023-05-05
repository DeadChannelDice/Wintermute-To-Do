 const STORYBLOK_URL = "https://api-us.storyblok.com/v2/cdn/stories/?starts_with=events/&token=6ayrPOcPuJU8puAP8sIWywtt";

 
 const calendar = document.querySelector('#calendar');
 const monthElement = document.querySelector('#month');

 const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
 ];

 const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat']

 let events;

 const today = new Date();
 let currentMonth = today.getMonth();
 let currentYear = today.getFullYear();

//  const loadEvents = async () => {
//     const res = await fetch(STORYBLOK_URL);
//     const data = await res.json();
//     const stories = data.stories;
//     events = stories.reduce((accumulator, story) => {
//         const storyTime = new Date(story.content.time);
//         const storyDate = new Date(storyTime.toDateString());
//         accumulator[storyDate] = story.content;
//         return accumulator;
//     }, {});
//  };

//  loadEvents();

const drawBlankCalendar = () => {
    for(let i = 0; i < 371; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        

        const dayText = document.createElement('p');
        dayText.classList.add('day-text');
        dayText.innerText = days[i % 7];

        const dayNumber = document.createElement('p');
        dayNumber.classList.add('day-number');
        
        const eventName = document.createElement('small');
        eventName.classList.add('event-name');

        day.appendChild(dayText);
        day.appendChild(dayNumber);
        day.appendChild(eventName);

        calendar.appendChild(day);
    }
}

const updateCalendar = (month, year, events) => {
    let theFirst = new Date();
    theFirst.setDate(1);
    theFirst.setMonth(0);
    theFirst.setFullYear(year);

    const monthName = months[month];
    const monthWithYear = `${year} - ${monthName}`;
    monthElement.innerText = monthWithYear;

    // Asigning days dates and adding events
    

    const daysInJan = new Date(year, 0 + 1, 0).getDate();
    const daysInFeb = new Date(year, 1 + 1, 0).getDate();
    const daysInMar = new Date(year, 2 + 1, 0).getDate();
    const daysInApr = new Date(year, 3 + 1, 0).getDate();
    const daysInMay = new Date(year, 4 + 1, 0).getDate();
    const daysInJun = new Date(year, 5 + 1, 0).getDate();
    const daysInJul = new Date(year, 6 + 1, 0).getDate();
    const daysInAug = new Date(year, 7 + 1, 0).getDate();
    const daysInSep = new Date(year, 8 + 1, 0).getDate();
    const daysInOct = new Date(year, 9 + 1, 0).getDate();
    const daysInNov = new Date(year, 10 + 1, 0).getDate();
    const daysInDec = new Date(year, 11 + 1, 0).getDate();

    const daysInMonth = [daysInJan, daysInFeb, daysInMar, daysInApr, daysInMay, daysInJun, daysInJul, daysInAug, daysInSep, daysInOct, daysInNov, daysInDec]; 


    const theFirstDayOfWeek = theFirst.getDay();

    let dayCounter = 1;
    let monthCounter = 0;

    const daysInYear = [...document.querySelectorAll('.day')];
    
  daysInYear.forEach((day) => {
    const dayNumber = day.querySelector('.day-number');
    
    if (dayCounter <= daysInMonth[monthCounter]) {
      dayNumber.innerText = dayCounter;
      dayCounter++;
      console.log(daysInMonth[monthCounter]);
    } else {
      dayCounter = 1;
      dayNumber.innerText = dayCounter;
      dayCounter++;
      monthCounter++;
      
    }
    
  });
}


const previousMonth = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentYear--,
        currentMonth = 11;
    }
    updateCalendar(currentMonth, currentYear, events);
}

const nextMonth = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentYear++,
        currentMonth = 0;
    }
    updateCalendar(currentMonth, currentYear, events);
}

const load = async () => {
    // await loadEvents();
    drawBlankCalendar();
    updateCalendar(0, currentYear, events);   
      
}

load();
