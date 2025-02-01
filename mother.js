document.addEventListener("DOMContentLoaded", () => {
    let milestones = JSON.parse(localStorage.getItem("milestones") || "[]");
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let breathingActive = false;
    let breathingPhase = "inhale";

    function saveData() {
        localStorage.setItem("milestones", JSON.stringify(milestones));
        localStorage.setItem("notes", JSON.stringify(notes));
        alert("Data saved successfully!");
    }

    function clearData() {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            localStorage.removeItem("milestones");
            localStorage.removeItem("notes");
            milestones = [];
            notes = [];
            alert("All data has been cleared.");
        }
    }

    function showTab(tab) {
        const content = document.getElementById("content");
        content.innerHTML = "";

        if (tab === "milestones") {
            content.innerHTML = `
                <h2>Baby Milestones</h2>
                <input type="text" id="milestoneTitle" placeholder="Milestone Title">
                <input type="date" id="milestoneDate">
                <textarea id="milestoneNotes" placeholder="Notes"></textarea>
                <button onclick="addMilestone()">Add Milestone</button>
                <div id="milestoneList"></div>
            `;
            renderMilestones();
        } else if (tab === "breathing") {
            content.innerHTML = `
                <h2>Breathing Exercise</h2>
                <button onclick="toggleBreathing()">Start Breathing</button>
                <p id="breathingPhase">Inhale...</p>
            `;
        } else if (tab === "notes") {
            content.innerHTML = `
                <h2>Daily Notes</h2>
                <textarea id="noteInput" placeholder="How are you feeling today?"></textarea>
                <button onclick="addNote()">Save Note</button>
                <div id="noteList"></div>
            `;
            renderNotes();
        } else if (tab === "relax") {
            content.innerHTML = `
                <h2>Relaxation Sounds</h2>
                <audio controls><source src="/ocean-waves.mp3" type="audio/mpeg"></audio>
                <audio controls><source src="/forest-birds.mp3" type="audio/mpeg"></audio>
                <audio controls><source src="/gentle-rain.mp3" type="audio/mpeg"></audio>
            `;
        } else if (tab === "settings") {
            content.innerHTML = `
                <h2>Settings</h2>
                <button onclick="saveData()">Save All Data</button>
                <button onclick="clearData()">Clear All Data</button>
            `;
        }
    }

    function addMilestone() {
        const title = document.getElementById("milestoneTitle").value;
        const date = document.getElementById("milestoneDate").value;
        const notes = document.getElementById("milestoneNotes").value;

        if (title && date) {
            milestones.push({ id: Date.now(), title, date, notes });
            localStorage.setItem("milestones", JSON.stringify(milestones));
            renderMilestones();
        }
    }

    function renderMilestones() {
        const list = document.getElementById("milestoneList");
        if (!list) return;
        list.innerHTML = milestones.map(m =>
            `<div>
                <h3>${m.title}</h3>
                <p>${m.date}</p>
                <p>${m.notes}</p>
                <button onclick="deleteMilestone(${m.id})">Delete</button>
            </div>`
        ).join("");
    }

    function deleteMilestone(id) {
        milestones = milestones.filter(m => m.id !== id);
        localStorage.setItem("milestones", JSON.stringify(milestones));
        renderMilestones();
    }

    function addNote() {
        const noteText = document.getElementById("noteInput").value;
        if (noteText) {
            notes.push({ id: Date.now(), text: noteText, date: new Date().toISOString() });
            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes();
        }
    }

    function renderNotes() {
        const list = document.getElementById("noteList");
        if (!list) return;
        list.innerHTML = notes.map(n =>
            `<div>
                <p>${n.text}</p>
                <p>${new Date(n.date).toLocaleDateString()}</p>
                <button onclick="deleteNote(${n.id})">Delete</button>
            </div>`
        ).join("");
    }

    function deleteNote(id) {
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
    }

    function toggleBreathing() {
        breathingActive = !breathingActive;
        if (breathingActive) {
            const phaseText = document.getElementById("breathingPhase");
            let phase = "inhale";
            setInterval(() => {
                if (!breathingActive) return;
                phase = phase === "inhale" ? "hold" : phase === "hold" ? "exhale" : "inhale";
                phaseText.innerText = phase.charAt(0).toUpperCase() + phase.slice(1) + "...";
            }, 4000);
        }
    }

    window.showTab = showTab;
    window.addMilestone = addMilestone;
    window.deleteMilestone = deleteMilestone;
    window.addNote = addNote;
    window.deleteNote = deleteNote;
    window.toggleBreathing = toggleBreathing;
});
