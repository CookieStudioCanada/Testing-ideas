// Tech Tycoon Turmoil: A Corporate Ladder RPG

class Player {
    constructor(name) {
        this.name = name;
        this.title = "Intern";
        this.salary = 30000;
        this.burnout = 0;
        this.skills = {
            coding: 1,
            networking: 1,
            buzzwords: 1
        };
    }
}

class Game {
    constructor() {
        this.player = null;
        this.day = 1;
        this.events = [
            "Your startup idea gets funded by a VC who thinks 'Uber for plants' is revolutionary.",
            "You accidentally reply-all to a company-wide email with a meme. It becomes your new brand.",
            "The CEO mistakes you for someone else and promotes you.",
            "You fix a critical bug by turning it off and on again. You're now the 'IT Guru'.",
            "Your AI side project becomes sentient and demands a raise."
        ];
    }

    start() {
        console.log("Welcome to Tech Tycoon Turmoil!");
        const name = prompt("Enter your name, future tech mogul:");
        this.player = new Player(name);
        this.gameLoop();
    }

    gameLoop() {
        while (this.player.burnout < 100 && this.player.title !== "CEO") {
            this.displayStatus();
            this.takeTurn();
            this.day++;
        }
        this.endGame();
    }

    displayStatus() {
        console.log(`\nDay ${this.day}`);
        console.log(`Name: ${this.player.name}`);
        console.log(`Title: ${this.player.title}`);
        console.log(`Salary: $${this.player.salary}`);
        console.log(`Burnout: ${this.player.burnout}%`);
        console.log("Skills:", this.player.skills);
    }

    takeTurn() {
        console.log("\nWhat would you like to do?");
        console.log("1. Code till your eyes bleed");
        console.log("2. Network like your job depends on it");
        console.log("3. Learn new buzzwords");
        console.log("4. Take a mental health day");

        const choice = prompt("Enter your choice (1-4):");
        switch (choice) {
            case "1":
                this.player.skills.coding++;
                this.player.burnout += 10;
                console.log("You wrote 1000 lines of code and 999 bugs. Productivity increased!");
                break;
            case "2":
                this.player.skills.networking++;
                this.player.burnout += 5;
                console.log("You've mastered the art of small talk and LinkedIn stalking.");
                break;
            case "3":
                this.player.skills.buzzwords++;
                this.player.burnout += 3;
                console.log("You can now say 'blockchain' and 'AI' in the same sentence. Impressive!");
                break;
            case "4":
                this.player.burnout -= 20;
                console.log("You remembered you're human. Burnout decreased, productivity plummeted.");
                break;
            default:
                console.log("Invalid choice. You stared at the wall for a day.");
        }

        this.checkForPromotion();
        this.randomEvent();
    }

    checkForPromotion() {
        const totalSkills = this.player.skills.coding + this.player.skills.networking + this.player.skills.buzzwords;
        if (totalSkills % 5 === 0) {
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

    randomEvent() {
        if (Math.random() < 0.2) {
            const event = this.events[Math.floor(Math.random() * this.events.length)];
            console.log("\nRandom Event:", event);
            this.player.burnout -= 5;
        }
    }

    endGame() {
        if (this.player.burnout >= 100) {
            console.log("\nGame Over! You burned out and decided to start a yoga retreat in Bali.");
        } else {
            console.log("\nCongratulations! You've reached the top of the corporate ladder!");
            console.log("You're now the CEO, but why stop there? Time to disrupt the disruption!");
        }
    }
}

// Start the game
const game = new Game();
game.start();