package main

import (
	"database/sql"
	_ "encoding/gob"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
)

const dbLoc = "./servers/db/data.db"

var store = sessions.NewCookieStore([]byte("secret"))

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("./dist/*.html")
	router.Static("./assets", "./dist/assets")
	router.GET("/", func(ctx *gin.Context) {
		session, _ := store.Get(ctx.Request, "login-session")
		username := session.Values["username"]
		ids := fetchGames(5)
		ctx.HTML(http.StatusOK, "index.html", gin.H{"username": username, "idlist": ids})
	})
	router.GET("/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		session, _ := store.Get(ctx.Request, "login-session")
		username := session.Values["username"]
		if matched, _ := regexp.MatchString("^[0-9]+$", path); matched {
			ctx.HTML(http.StatusOK, "game.html", gin.H{"id": path, "username": username})
			return
		}
		_, err := os.Stat("dist/" + path + ".html")
		if err != nil {
			ctx.Redirect(http.StatusNotFound, "/")
			panic(err)
		}
		if path == "login" {
			if username == nil {
				ctx.HTML(http.StatusOK, path+".html", gin.H{"username": username})
			} else {
				ctx.Redirect(http.StatusFound, "/")
			}
			return
		}
		if path == "" || path == "game" {
			ctx.Redirect(http.StatusNotFound, "/")
			return
		}
		ctx.HTML(http.StatusOK, path+".html", gin.H{"username": username})
	})
	router.POST("/login", handleLogin)
	router.POST("/logout", handleLogout)
	router.POST("/register", handleRegistry)
	router.POST("/token", handleToken)
	router.Run(":8081")
}

func fetchGames(amount int) []int {
	db, err := sql.Open("sqlite3", dbLoc)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	games, err := db.Query("SELECT id FROM game WHERE game_ended_reason IS NULL ORDER BY id DESC LIMIT ?", amount)
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
