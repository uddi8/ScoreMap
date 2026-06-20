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

    // Calculations
    const chaptersPerDay = (totalChapters / daysLeft).toFixed(2);
    const chaptersPerMonth = Math.ceil((totalChapters / daysLeft) * 30);

    // Update global metrics
    document.getElementById('outDaysLeft').innerText = `${daysLeft} days`;
    document.getElementById('outTotalChapters').innerText = totalChapters;
    document.getElementById('outChaptersPerDay').innerText = `${chaptersPerDay} / day`;
    document.getElementById('outMonthlyTarget').innerText = `${chaptersPerMonth} ch / mo`;

    // Dynamic Weekly Target Rule (Hide if less than 7 days)
    const weeklyCard = document.getElementById('outWeeklyTarget').closest('.card');
    if (daysLeft < 7) {
        weeklyCard.style.display = 'none';
    } else {
        weeklyCard.style.display = 'block';
        const chaptersPerWeek = Math.ceil((totalChapters / daysLeft) * 7);
        document.getElementById('outWeeklyTarget').innerText = `${chaptersPerWeek} ch / wk`;
    }

    // Proportional Time Block Distribution per Subject
    const hoursPerSubject = hoursPerDay / subjectsArray.length;
    
    // Split each subject's time into 3 focus blocks: 40% Read, 30% Examples, 30% Question Qs
    const readTime = (hoursPerSubject * 0.4).toFixed(1);
    const practiceTime = (hoursPerSubject * 0.3).toFixed(1);
    const questionTime = (hoursPerSubject * 0.3).toFixed(1);

    const splitList = document.getElementById('outDailySplit');
    splitList.innerHTML = "";
    
    subjectsArray.forEach(sub => {
        const li = document.createElement('li');
        li.className = "subject-block";
        li.innerHTML = `
            <div class="subject-header"><strong>${sub.name}</strong> <span>(${hoursPerSubject.toFixed(1)} hrs total)</span></div>
            <div class="time-blocks">
                <div>📚 Read NCERT Thoroughly: <span>${readTime} hrs</span></div>
                <div>✏️ Practice NCERT Exercises: <span>${practiceTime} hrs</span></div>
                <div>⏱️ Question Drilling/PYQs: <span>${questionTime} hrs</span></div>
            </div>
        `;
        splitList.appendChild(li);
    });

    document.getElementById('outputSection').classList.remove('hidden');
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
});

