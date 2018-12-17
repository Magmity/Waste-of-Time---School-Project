const gameStage = {
	wasteland: { id: 0, goal: 0.1 },
	pointlessShop: { id: 1, goal: 10 },
	droneEra: { id: 2, goal: 100 },
	lessPointlessWasteland: { id: 3, goal: 829 },
	conversion: { id: 4, goal: 100000000 },
	essay: { id: 5, goal: 2147483647 },
};

const game = new Vue({
	el: '#game',
	data: {
		pointlessWaste: 0,
		pointlessWasteMultiplier: 1,
		pointlessWasteBoostAmount: 2,
		multipliersBought: 0,
		wasteDrones: 0,
		lessPointlessWaste: 0,
		tickspeed: 1000,
		essayPoints: 0,
		stage: gameStage.wasteland,
	},
	watch: {
		pointlessWaste: function (val) {
			if (this.stage == gameStage.conversion) {
				return;
			}
			if (val >= this.stage.goal) {
				this.stage = this.getStageById(this.stage.id + 1);
			}
		}
	},
	computed: {
        multiplierCost: function () {
            return 0.1 * Math.pow(1.6,this.multipliersBought);
        },
		droneCost: function () {
			return 10 * Math.pow(5,this.wasteDrones);
		},
		lessPointlessWasteCost: function () {
			return 100 * Math.pow(3.5,this.lessPointlessWaste);
		},
		essayPointCost: function () {
			return 829 * Math.pow(100000,this.essayPoints);
		}
	},
	methods: {
		addWaste: function () {
			this.pointlessWaste += this.pointlessWasteMultiplier / 100;
		},
		upgradeMultiplier: function () {
			const cost = this.multiplierCost;
			if (this.pointlessWaste >= cost) {
				this.pointlessWaste -= cost;
				this.pointlessWasteMultiplier *= this.pointlessWasteBoostAmount;
				this.multipliersBought += 1;
			}
		},
		upgradeDrone: function () {
			const cost = this.droneCost;
			if (this.pointlessWaste >= cost) {
				this.pointlessWaste -= cost;
				this.wasteDrones += 1;
			}
		},
		upgradeLessPointlessWaste: function () {
			const cost = this.lessPointlessWasteCost;
			if (this.pointlessWaste >= cost) {
				this.pointlessWaste -= cost;
				this.lessPointlessWaste += 1;
				this.pointlessWasteBoostAmount += 0.1;
			}
		},
		addEssayPoint: function () {
			const cost = this.essayPointCost;
			if (this.pointlessWaste >= cost) {
				this.pointlessWaste -= cost;
				this.essayPoints += 1;
			}
		},
		getStageById(id) {
            for (let name of Object.keys(gameStage)) {
                if (gameStage[name].id == id) {
                    return gameStage[name];
                }
            }
            return null;
        }
	},
});

setInterval(function () {
    if (game.stage < gameStage.droneEra) {
        return;
    }
    for (let i = 0; i < game.wasteDrones; i++) {
        game.addWaste();
    }
}, 1000);
