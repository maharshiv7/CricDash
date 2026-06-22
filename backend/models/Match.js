const mongoose = require('mongoose');

const ballSchema = new mongoose.Schema({
    bowler: String,
    striker: String,
    nonStriker: String,
    runsOffBat: { type: Number, default: 0 },
    extras: { type: Number, default: 0 },
    extraType: { type: String, enum: ['none', 'wd', 'nb', 'lb', 'b'], default: 'none' },
    isWicket: { type: Boolean, default: false },
    wicketType: String // e.g., 'bowled', 'caught'
});

const overSchema = new mongoose.Schema({
    overNumber: Number,
    bowler: String,
    balls: [ballSchema], // Array of balls bowled in this over
    totalRuns: { type: Number, default: 0 }
});

const inningsSchema = new mongoose.Schema({
    battingTeam: String,
    bowlingTeam: String,
    target: Number,
    score: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    oversCompleted: { type: Number, default: 0 },
    overs: [overSchema] // Array of overs
});

const matchSchema = new mongoose.Schema({
    teamA: String,
    teamB: String,
    tossWinner: String,
    tossChoice: { type: String, enum: ['batting', 'bowling'] },
    totalOvers: Number,
    matchStatus: { type: String, enum: ['setup', 'live', 'completed'], default: 'setup' },
    firstInnings: inningsSchema,
    secondInnings: inningsSchema,
    winner: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
