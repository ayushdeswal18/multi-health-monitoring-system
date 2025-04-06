// Background Animation Setup
document.addEventListener('DOMContentLoaded', () => {
    initHeartBackground();
    initHudInterface();
    initParticles();
});

// Geometric Heart Background
function initHeartBackground() {
    const heartBg = document.getElementById('heartBg');
    const numNodes = 15;
    const nodes = [];

    // Create nodes
    for (let i = 0; i < numNodes; i++) {
        const node = document.createElement('div');
        node.className = 'heart-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        heartBg.appendChild(node);
        nodes.push(node);

        // Create connections between nodes
        if (i > 0) {
            const connection = document.createElement('div');
            connection.className = 'heart-connection';
            heartBg.appendChild(connection);

            // Update connection position and rotation
            updateConnection(connection, nodes[i-1], node);
        }
    }

    // Animate nodes
    setInterval(() => {
        nodes.forEach(node => {
            const newX = parseFloat(node.style.left) + (Math.random() - 0.5) * 2;
            const newY = parseFloat(node.style.top) + (Math.random() - 0.5) * 2;
            node.style.left = `${Math.max(0, Math.min(100, newX))}%`;
            node.style.top = `${Math.max(0, Math.min(100, newY))}%`;
        });

        // Update connections
        const connections = heartBg.getElementsByClassName('heart-connection');
        for (let i = 0; i < connections.length; i++) {
            updateConnection(connections[i], nodes[i], nodes[i+1]);
        }
    }, 3000);
}

// Update connection position and rotation
function updateConnection(connection, nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    const dx = rectB.left - rectA.left;
    const dy = rectB.top - rectA.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    connection.style.width = `${distance}px`;
    connection.style.left = `${rectA.left}px`;
    connection.style.top = `${rectA.top + 4}px`;
    connection.style.transform = `rotate(${angle}deg)`;
}

// HUD Interface Background
function initHudInterface() {
    const hudBg = document.getElementById('hudBg');
    const numCircles = 5;

    for (let i = 0; i < numCircles; i++) {
        const circle = document.createElement('div');
        circle.className = 'hud-circle';
        const size = 100 + i * 100;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `calc(50% - ${size/2}px)`;
        circle.style.top = `calc(50% - ${size/2}px)`;
        hudBg.appendChild(circle);

        // Add HUD data elements
        const dataPoints = 4;
        for (let j = 0; j < dataPoints; j++) {
            const data = document.createElement('div');
            data.className = 'hud-data';
            const angle = (j / dataPoints) * 360;
            const radius = size / 2;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            data.style.left = `calc(50% + ${x}px - 40px)`;
            data.style.top = `calc(50% + ${y}px - 10px)`;
            data.textContent = `DATA_${i}_${j}`;
            hudBg.appendChild(data);
        }
    }
}

// Particle Effects
function initParticles() {
    const container = document.getElementById('particles');
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}