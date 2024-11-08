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
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

const dbLoc = "./servers/db/data.db"

var store *sessions.CookieStore

func main() {
	var port string
	if len(os.Args) > 1 {
		port = os.Args[1]
	} else {
		port = "8081"
	}
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
	key = []byte(os.Getenv("JWT_KEY"))
	router := gin.Default()
	router.LoadHTMLGlob("./dist/*.html")
	router.Static("./assets", "./dist/assets")
	router.GET("/", func(ctx *gin.Context) {
		session, _ := store.Get(ctx.Request, "login-session")
		username := session.Values["username"]
		if username == nil {
			ctx.HTML(http.StatusOK, "landing.html", gin.H{"username": username})
		} else {
			ctx.Redirect(http.StatusFound, "/home")
		}
	})
	router.GET("/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		session, _ := store.Get(ctx.Request, "login-session")
		username := session.Values["username"]
		if path == "home" {
			ctx.HTML(http.StatusOK, "index.html", gin.H{"username": username})
			return
		}
		_, err := os.Stat("dist/" + path + ".html")
		if err != nil {
			ctx.Redirect(http.StatusNotFound, "/")
			panic(err)
		}
		if path == "login" || path == "register" {
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
	router.GET("/game/:path", func(ctx *gin.Context) {
		session, _ := store.Get(ctx.Request, "login-session")
		username := session.Values["username"]
		path := ctx.Param("path")
		if matched, _ := regexp.MatchString("^[0-9]+$", path); matched {
			ctx.HTML(http.StatusOK, "game.html", gin.H{"id": path, "username": username})
		}
	})
	router.GET("/api/game/games/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		gamesParam := ctx.Query("total")
		gamesAmount := 100
		if gamesParam != "" {
			var err error
			gamesAmount, err = strconv.Atoi(gamesParam)
			if err != nil || gamesAmount > 100 {
				gamesAmount = 100
			}
		}
		if !dbHasUser(path) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found."})
		}
		games := fetchFinishedGames(gamesAmount, path)
		ctx.JSON(http.StatusOK, games)
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
			gamesParam := ctx.Query("total")
			gamesAmount := 100
			if gamesParam != "" {
				var err error
				gamesAmount, err = strconv.Atoi(gamesParam)
				if err != nil || gamesAmount > 100 {
					gamesAmount = 100
				}
			}
			games := fetchFinishedGames(gamesAmount, "")
			ctx.JSON(http.StatusOK, games)
			return
		}
	})
	router.POST("/login", handleLogin)
	router.POST("/logout", handleLogout)
	router.POST("/register", handleRegistry)
	router.POST("/token", handleToken)
	router.Run(":" + port)
}
