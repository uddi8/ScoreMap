document.getElementById('plannerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const examDateInput = document.getElementById('examDate').value;
    const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
    const subjectsText = document.getElementById('subjectsList').value;

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const examDate = new Date(examDateInput);
    
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
        alert("Please pick a future date for your exam!");
        return;
    }

    let totalChapters = 0;
    let subjectsArray = [];
    
    // Dynamically splits whatever the user types, line-by-line
    const lines = subjectsText.split('\n');
    lines.forEach(line => {
        if(line.trim() === "") return;
        
        const parts = line.split(',');
        if(parts.length >= 2) {
            const name = parts[0].trim();
            const chapters = parseInt(parts[1].trim());
            
            if(!isNaN(chapters)) {
                totalChapters += chapters;
                subjectsArray.push({ name: name, chapters: chapters });
            }
        }
    });

    if (totalChapters === 0) {
        alert("Please enter subjects using the format: Subject Name, Chapters");
        return;
    }

    const chaptersPerDay = (totalChapters / daysLeft).toFixed(2);
    const chaptersPerWeek = Math.ceil((totalChapters / daysLeft) * 7);
    const chaptersPerMonth = Math.ceil((totalChapters / daysLeft) * 30);
    const hoursPerSubject = (hoursPerDay / subjectsArray.length).toFixed(1);

    document.getElementById('outDaysLeft').innerText = `${daysLeft} days`;
    document.getElementById('outTotalChapters').innerText = totalChapters;
    document.getElementById('outChaptersPerDay').innerText = `${chaptersPerDay} / day`;
    document.getElementById('outWeeklyTarget').innerText = `${chaptersPerWeek} ch / wk`;
    document.getElementById('outMonthlyTarget').innerText = `${chaptersPerMonth} ch / mo`;

    const splitList = document.getElementById('outDailySplit');
    splitList.innerHTML = "";
    subjectsArray.forEach(sub => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${sub.name}</strong> <span>${hoursPerSubject} hrs / day</span>`;
        splitList.appendChild(li);
    });

    document.getElementById('outputSection').classList.remove('hidden');
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
});

