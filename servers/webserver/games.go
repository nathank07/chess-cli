package main

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type Game struct {
	ID          int    `json:"id"`
	Fen         string `json:"fen"`
	Uci         string `json:"uci"`
	TimedUci    string `json:"timed_uci"`
	White       string `json:"whitePlayer"`
	Black       string `json:"blackPlayer"`
	Winner      string `json:"winner"`
	Reason      string `json:"reason"`
	GameCreated string `json:"game_created"`
}

// fetchLiveGames only needs id because node websocket will fetch the rest

func fetchLiveGames(amount int) []int {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	games, err := db.Query("SELECT id FROM game WHERE game_ended IS NULL ORDER BY id DESC LIMIT ?", amount)
	if err != nil {
		panic(err)
	}
	var ids []int
	for games.Next() {
		var id int
		err = games.Scan(&id)
		if err != nil {
			panic(err)
		}
		ids = append(ids, id)
	}
	return ids
}

func fetchFinishedGames(amount int) []Game {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	games, err := db.Query("SELECT id, fen, IFNULL(uci, ''), IFNULL(timed_uci, ''), IFNULL(whitePlayerID, '0'), IFNULL(blackPlayerID, '0'), game_created FROM game WHERE game_ended IS NOT NULL ORDER BY id DESC LIMIT ?", amount)
	if err != nil {
		panic(err)
	}
	var Games []Game
	for games.Next() {
		var game Game
		var whitePlayerID, blackPlayerID int
		err = games.Scan(&game.ID, &game.Fen, &game.Uci, &game.TimedUci, &whitePlayerID, &blackPlayerID, &game.GameCreated)
		game.Winner, game.Reason = fetchResult(game.ID)
		game.White = idToUsername(whitePlayerID)
		game.Black = idToUsername(blackPlayerID)
		if err != nil {
			panic(err)
		}
		Games = append(Games, game)
	}
	return Games
}

func idToUsername(id int) string {
	if id == 0 {
		return ""
	}
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	var username string
	err = db.QueryRow("SELECT username FROM user WHERE id=?", id).Scan(&username)
	if err != nil {
		if err == sql.ErrNoRows {
			return "Deleted User"
		}
		panic(err)
	}
	return username
}

func fetchResult(id int) (string, string) {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	var winner, reason string
	err = db.QueryRow("SELECT winner, reason FROM game_ended WHERE id=?", id).Scan(&winner, &reason)
	if err != nil {
		panic(err)
	}
	return winner, reason
}

func fetchSingleGame(id int) (bool, Game, error) {
	db, err := sql.Open("sqlite3", dbLoc)
	var game Game
	if err != nil {
		return false, game, err
	}
	defer db.Close()

	var whitePlayerID, blackPlayerID, game_ended int
	var live = true
	err = db.QueryRow("SELECT id, fen, IFNULL(uci, ''), IFNULL(timed_uci, ''), IFNULL(whitePlayerID, '0'), IFNULL(blackPlayerID, '0'), IFNULL(game_ended, '0') FROM game WHERE id=?", id).Scan(&game.ID, &game.Fen, &game.Uci, &game.TimedUci, &whitePlayerID, &blackPlayerID, &game_ended)
	if err != nil {
		return live, game, err
	}
	if game_ended != 0 {
		game.Winner, game.Reason = fetchResult(game.ID)
		live = false
	}
	game.White = idToUsername(whitePlayerID)
	game.Black = idToUsername(blackPlayerID)
	return live, game, nil
}
