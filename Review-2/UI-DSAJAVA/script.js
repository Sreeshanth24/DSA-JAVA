function loadCSV() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let csvText = event.target.result;
        processCSV(csvText);
    };
    reader.readAsText(file);
}

function processCSV(csvText) {
    let rows = csvText.split("\n").map(row => row.split(","));
    let headers = rows[0];
    trafficData = rows.slice(1).map(row => ({
        North: Number(row[headers.indexOf("North")]),
        South: Number(row[headers.indexOf("South")]),
        East: Number(row[headers.indexOf("East")]),
        West: Number(row[headers.indexOf("West")])
    }));
    alert("CSV Loaded Successfully!");
}

function calculateGreenLight() {
    let rowNumber = document.getElementById("rowNumber").value;
    if (rowNumber === "" || rowNumber < 0 || rowNumber >= trafficData.length) {
        alert("Please enter a valid row number.");
        return;
    }
    
    let data = trafficData[rowNumber];
    let sortedDirections = Object.entries(data).sort((a, b) => b[1] - a[1]);
    let maxTime = 60;
    let totalVehicles = Object.values(data).reduce((sum, val) => sum + val, 0);

    if (totalVehicles === 0) {
        document.getElementById("result").innerText = "No vehicles detected. Default timing applied.";
        return;
    }
    
    let resultText = "<h3>Green Light Timing (in seconds):</h3><ul>";
    sortedDirections.forEach(([direction, count]) => {
        let timeAllocation = (count / totalVehicles) * maxTime;
        resultText += `<li>${direction}: ${timeAllocation.toFixed(2)} seconds</li>`;
    });
    resultText += "</ul>";
    
    document.getElementById("result").innerHTML = resultText;
}
