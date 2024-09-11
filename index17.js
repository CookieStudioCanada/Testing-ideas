// Tech Tycoon Turmoil: An Expanded Corporate Ladder RPG

class Player {
    constructor(name) {
        this.name = name;
        this.title = "Intern";
        this.salary = 30000;
        this.money = 1000;
        this.burnout = 0;
        this.skills = {
            coding: 1,
            networking: 1,
            buzzwords: 1,
            leadership: 1
        };
        this.assets = {
            laptop: "Budget Laptop",
            coffee: "Instant Coffee",
            transportation: "Public Transit Pass"
        };
    }
}

class Game {
    constructor() {
        this.player = null;
        this.day = 1;
        this.events = {
            chance: [
                "A famous tech influencer retweets your hot take on AI. Gain 2 networking skills!",
                "Your side project goes viral on GitHub. Gain 3 coding skills!",
                "You predict the next big tech trend in a company meeting. Gain 2 buzzword skills!",
                "Your team's project is featured on TechCrunch. Gain 1 leadership skill!",
                "You win a hackathon with an app that does nothing but raises millions. Gain $10,000!"
            ],
            badLuck: [
                "Your startup idea is revealed to be an elaborate PDF. Lose $5,000.",
                "You push to production on a Friday evening. Spend the weekend fixing bugs. Burnout +10.",
                "A competitor releases your exact product idea. Burnout +5.",
                "Your AI algorithm becomes sentient and decides to take a vacation. Lose 2 coding skills.",
                "You get caught using ChatGPT for all your work. Lose 1 leadership skill."
            ],
            work: [
                "Attend a day-long meeting about the importance of brief meetings.",
                "Spend hours optimizing a function to save 0.01 seconds of load time.",
                "Create a PowerPoint presentation with more animations than content.",
                "Debug code written by an intern who learned programming yesterday.",
                "Implement a blockchain solution for the office coffee machine."
            ]
        };
    }

    start() {
        console.log("Welcome to Tech Tycoon Turmoil: Capitalism Edition!");
        const name = prompt("Enter your name, future tech oligarch:");
        this.player = new Player(name);
        this.gameLoop();
    }

    gameLoop() {
        while (this.player.burnout < 100 && this.player.title !== "CEO") {
            this.displayStatus();
            this.takeTurn();
            this.handleEvents();
            this.day++;
        }
        this.endGame();
    }

    displayStatus() {
        console.log(`\nDay ${this.day} in Silicon Valley`);
        console.log(`Name: ${this.player.name}`);
        console.log(`Title: ${this.player.title}`);
        console.log(`Salary: $${this.player.salary}`);
        console.log(`Money: $${this.player.money}`);
        console.log(`Burnout: ${this.player.burnout}%`);
        console.log("Skills:", this.player.skills);
        console.log("Assets:", this.player.assets);
    }

    takeTurn() {
        console.log("\nWhat would you like to do?");
        console.log("1. Code till your fingers bleed (Coding +2, Burnout +10)");
        console.log("2. Network at a Silicon Valley yacht party (Networking +2, Burnout +5)");
        console.log("3. Attend a 'Disrupt or Die' seminar (Buzzwords +2, Burnout +5)");
        console.log("4. Micromanage your team (Leadership +2, Burnout +8)");
        console.log("5. Take a 'mindfulness' break (Burnout -15, Skills -1)");
        console.log("6. Go shopping for tech gadgets");

        const choice = prompt("Enter your choice (1-6):");
        switch (choice) {
            case "1":
                this.player.skills.coding += 2;
                this.player.burnout += 10;
                console.log("You've written more lines of code than sleep you've had. Ship it!");
                break;
            case "2":
                this.player.skills.networking += 2;
                this.player.burnout += 5;
                console.log("You've collected 50 business cards and 0 meaningful connections.");
                break;
            case "3":
                this.player.skills.buzzwords += 2;
                this.player.burnout += 5;
                console.log("You can now use 'AI', 'blockchain', and 'synergy' in one sentence.");
                break;
            case "4":
                this.player.skills.leadership += 2;
                this.player.burnout += 8;
                console.log("Your team is considering a mutiny, but productivity is up 3%!");
                break;
            case "5":
                this.player.burnout -= 15;
                for (let skill in this.player.skills) {
                    this.player.skills[skill] = Math.max(1, this.player.skills[skill] - 1);
                }
                console.log("You remembered life exists outside work. You feel human again.");
                break;
            case "6":
                this.goShopping();
                break;
            default:
                console.log("Invalid choice. You scrolled Twitter for inspiration all day.");
        }

        this.player.money += this.player.salary / 365; // Daily salary
        this.checkForPromotion();
    }

    goShopping() {
        console.log("\nWelcome to the iStore! What would you like to buy?");
        console.log("1. Quantum Laptop ($5000) - Boosts coding skill");
        console.log("2. AI-powered Coffee Maker ($1000) - Reduces burnout");
        console.log("3. Electric Scooter ($2000) - Improves networking");
        console.log("4. VR Meditation Headset ($3000) - Massively reduces burnout");
        console.log("5. Exit store");

        const choice = prompt("Enter your choice (1-5):");
        switch (choice) {
            case "1":
                if (this.player.money >= 5000) {
                    this.player.money -= 5000;
                    this.player.assets.laptop = "Quantum Laptop";
                    this.player.skills.coding += 3;
                    console.log("You now own a laptop from the future. Coding skill increased!");
                } else {
                    console.log("Not enough money. Have you tried being richer?");
                }
                break;
            case "2":
                if (this.player.money >= 1000) {
                    this.player.money -= 1000;
                    this.player.assets.coffee = "AI-powered Coffee Maker";
                    console.log("Your coffee now predicts when you need it. Burnout reduction improved!");
                } else {
                    console.log("Not enough money. Try selling your data.");
                }
                break;
            case "3":
                if (this.player.money >= 2000) {
                    this.player.money -= 2000;
                    this.player.assets.transportation = "Electric Scooter";
                    this.player.skills.networking += 2;
                    console.log("You're now part of the Silicon Valley scooter gang. Networking improved!");
                } else {
                    console.log("Not enough money. Have you considered a small loan of a million dollars?");
                }
                break;
            case "4":
                if (this.player.money >= 3000) {
                    this.player.money -= 3000;
                    this.player.burnout -= 30;
                    console.log("You've achieved digital nirvana. Burnout significantly reduced!");
                } else {
                    console.log("Not enough money. Maybe meditate on your poverty?");
                }
                break;
            case "5":
                console.log("Thanks for window shopping!");
                break;
            default:
                console.log("Invalid choice. You bought $100 worth of NFTs by accident.");
                this.player.money -= 100;
        }
    }

    handleEvents() {
        for (let i = 0; i < 3; i++) {
            const eventType = this.getRandomEventType();
            const event = this.events[eventType][Math.floor(Math.random() * this.events[eventType].length)];
            console.log(`\nEvent (${eventType}): ${event}`);
            this.applyEventEffect(eventType, event);
        }
    }

    getRandomEventType() {
        const rand = Math.random();
        if (rand < 0.4) return "work";
        if (rand < 0.7) return "chance";
        return "badLuck";
    }

    applyEventEffect(type, event) {
        switch (type) {
            case "chance":
                if (event.includes("Gain")) {
                    const [skill, amount] = event.match(/Gain (\d+) (\w+) skill/).slice(1);
                    this.player.skills[skill.toLowerCase()] += parseInt(amount);
                } else if (event.includes("$")) {
                    const amount = parseInt(event.match(/\$(\d+)/)[1]);
                    this.player.money += amount;
                }
                break;
            case "badLuck":
                if (event.includes("Lose")) {
                    if (event.includes("$")) {
                        const amount = parseInt(event.match(/\$(\d+)/)[1]);
                        this.player.money -= amount;
                    } else {
                        const [amount, skill] = event.match(/Lose (\d+) (\w+) skill/).slice(1);
                        this.player.skills[skill.toLowerCase()] = Math.max(1, this.player.skills[skill.toLowerCase()] - parseInt(amount));
                    }
                } else if (event.includes("Burnout")) {
                    const amount = parseInt(event.match(/Burnout \+(\d+)/)[1]);
                    this.player.burnout += amount;
                }
                break;
            case "work":
                this.player.burnout += 5;
                break;
        }
    }

    checkForPromotion() {
        const totalSkills = Object.values(this.player.skills).reduce((a, b) => a + b, 0);
        if (totalSkills % 10 === 0) {
            this.player.title = this.getNextTitle();
            this.player.salary *= 1.5;
            console.log(`Congratulations! You've been promoted to ${this.player.title}!`);
        }
    }

    getNextTitle() {
        const titles = ["Intern", "Junior Developer", "Senior Developer", "Team Lead", "CTO", "CEO"];
        const currentIndex = titles.indexOf(this.player.title);
        return titles[currentIndex + 1] || "CEO";
    }

    endGame() {
        if (this.player.burnout >= 100) {
            console.log("\nGame Over! You burned out and decided to start a llama farm in Peru.");
        } else {
            console.log("\nCongratulations! You've reached the top of the corporate ladder!");
            console.log("You're now the CEO. Time to disrupt the disruption and innovate innovation!");
        }
        console.log(`Final Status:`);
        this.displayStatus();
    }
}

// Start the game
const game = new Game();
game.start();