package main

import (
	_ "encoding/gob"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strconv"

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
		ctx.HTML(http.StatusOK, "index.html", gin.H{"username": username})
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
	router.GET("/api/game/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		if matched, _ := regexp.MatchString("^[0-9]+$", path); matched {
			id, convErr := strconv.Atoi(path)
			if convErr != nil {
				fmt.Println("conversion failed", convErr)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": convErr.Error()})
				return
			}
			live, game, err := fetchSingleGame(id)
			if err != nil {
				fmt.Println(err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			fmt.Println(live, game)
			if live {
				ctx.JSON(http.StatusOK, gin.H{"live": true, "game": game.ID})
				return
			}
			ctx.JSON(http.StatusOK, gin.H{"live": false, "game": game})
			return
		}
		if path == "live" {
			ids := fetchLiveGames(5)
			ctx.JSON(http.StatusOK, ids)
			return
		}
		if path == "games" {
			games := fetchFinishedGames(20)
			ctx.JSON(http.StatusOK, games)
			return
		}
	})
	router.POST("/login", handleLogin)
	router.POST("/logout", handleLogout)
	router.POST("/register", handleRegistry)
	router.POST("/token", handleToken)
	router.Run(":8081")
}
