document.getElementById('plannerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Fetch Inputs
    const examDateInput = document.getElementById('examDate').value;
    const targetPct = document.getElementById('targetPercentage').value;
    const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
    const subjectsText = document.getElementById('subjectsList').value;

    // 2. Calculate Days Left
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to match input date comparison accurately
    const examDate = new Date(examDateInput);
    
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
        alert("Please pick a future date for your exam!");
        return;
    }

    // 3. Parse Subjects and Count Total Chapters
    let totalChapters = 0;
    let subjectsArray = [];
    
    // Split text input by lines
    const lines = subjectsText.split('\n');
    lines.forEach(line => {
        if(line.trim() === "") return;
        
        // Split by comma: "Math, 15" -> ["Math", "15"]
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
        alert("Please enter your subjects and chapters correctly (e.g., Math, 15).");
        return;
    }

    // 4. Perform MVP Math Matrix Calculations
    const chaptersPerDay = (totalChapters / daysLeft).toFixed(2);
    const chaptersPerWeek = Math.ceil((totalChapters / daysLeft) * 7);
    const chaptersPerMonth = Math.ceil((totalChapters / daysLeft) * 30);

    // Calculate daily time breakdown per subject proportionally 
    const hoursPerSubject = (hoursPerDay / subjectsArray.length).toFixed(1);

    // 5. Update DOM elements to display outputs
    document.getElementById('outDaysLeft').innerText = `${daysLeft} days`;
    document.getElementById('outTotalChapters').innerText = totalChapters;
    document.getElementById('outChaptersPerDay').innerText = `${chaptersPerDay} / day`;
    document.getElementById('outWeeklyTarget').innerText = `${chaptersPerWeek} ch / wk`;
    document.getElementById('outMonthlyTarget').innerText = `${chaptersPerMonth} ch / mo`;

    // Clear and build the subject time splitting UI list
    const splitList = document.getElementById('outDailySplit');
    splitList.innerHTML = "";
    subjectsArray.forEach(sub => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${sub.name}</strong> <span>${hoursPerSubject} hrs / day</span>`;
        splitList.appendChild(li);
    });

    // Reveal output block
    document.getElementById('outputSection').classList.remove('hidden');
    
    // Smooth scroll down to layout the data on small screens
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
});

